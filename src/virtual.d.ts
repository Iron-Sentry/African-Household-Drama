declare module 'virtual:story' {
  export const storyJson: string;
  export const meta: { knots: string[]; moments: { id: string; title: string }[] };
}
