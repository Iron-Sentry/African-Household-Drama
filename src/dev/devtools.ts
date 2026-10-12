import type { Session } from '../narrative/session.ts';

interface DevtoolsOptions {
  knots: string[];
  session: () => Session;
  jump: (knot: string, vars: Record<string, unknown>) => void;
}

function coerce(raw: string, original: unknown): unknown {
  if (typeof original === 'boolean') return raw === 'true';
  if (typeof original === 'number') return Number(raw);
  return raw;
}

/** Mount the opt-in `?dev` story inspector. */
export function mountDevtools({ knots, session, jump }: DevtoolsOptions) {
  document.querySelector('.devtools')?.remove();

  const root = document.createElement('aside');
  root.className = 'devtools';
  root.setAttribute('aria-label', 'Story development tools');
  root.innerHTML = `
    <h2>Story tools</h2>
    <label>Jump to knot
      <select class="devtools-knot"></select>
    </label>
    <details>
      <summary>Variables</summary>
      <div class="devtools-vars"></div>
    </details>
    <div class="devtools-actions">
      <button type="button" data-action="refresh">REFRESH VARIABLES</button>
      <button type="button" data-action="jump">JUMP</button>
    </div>
    <pre class="devtools-output" aria-live="polite"></pre>
  `;
  document.body.append(root);

  const knotEl = root.querySelector<HTMLSelectElement>('.devtools-knot')!;
  const varsEl = root.querySelector<HTMLElement>('.devtools-vars')!;
  const output = root.querySelector<HTMLElement>('.devtools-output')!;
  const uniqueKnots = [...new Set(knots)].sort((a, b) => a.localeCompare(b));
  knotEl.replaceChildren(...uniqueKnots.map((knot) => Object.assign(document.createElement('option'), { value: knot, textContent: knot })));

  let originals: Record<string, unknown> = {};
  const renderVars = () => {
    originals = session().vars();
    varsEl.replaceChildren(
      ...Object.entries(originals).map(([name, value]) => {
        const label = document.createElement('label');
        label.textContent = name;
        let control: HTMLInputElement | HTMLSelectElement;
        if (typeof value === 'boolean') {
          const select = document.createElement('select');
          select.append(new Option('true', 'true'), new Option('false', 'false'));
          select.value = String(value);
          control = select;
        } else {
          const input = document.createElement('input');
          input.type = typeof value === 'number' ? 'number' : 'text';
          input.value = String(value);
          control = input;
        }
        control.dataset.variable = name;
        label.append(control);
        return label;
      }),
    );
  };

  const editedVars = () => {
    const vars: Record<string, unknown> = {};
    varsEl.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-variable]').forEach((control) => {
      const name = control.dataset.variable!;
      vars[name] = coerce(control.value, originals[name]);
    });
    return vars;
  };

  root.querySelector('[data-action="refresh"]')!.addEventListener('click', renderVars);
  root.querySelector('[data-action="jump"]')!.addEventListener('click', () => jump(knotEl.value, editedVars()));

  let last = '';
  const update = () => {
    if (!root.isConnected) return;
    const current = session();
    const next = JSON.stringify(
      {
        stats: current.stats,
        tags: current.story.currentTags || [],
        canContinue: current.story.canContinue,
        choices: current.story.currentChoices.map((choice) => choice.text),
      },
      null,
      2,
    );
    if (next !== last) {
      output.textContent = next;
      last = next;
    }
    requestAnimationFrame(update);
  };

  renderVars();
  update();
}
