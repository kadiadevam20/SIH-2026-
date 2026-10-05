/** Per-tab exit animation so navbar can wait before switching */

type ExitFn = (done: () => void) => void;

const exits = new Map<string, ExitFn>();

export function registerTabExit(tab: string, fn: ExitFn | null) {
  if (fn) exits.set(tab, fn);
  else exits.delete(tab);
}

export function runTabExit(tab: string, done: () => void) {
  const fn = exits.get(tab);
  if (fn) fn(done);
  else done();
}

export function hasTabExit(tab: string) {
  return exits.has(tab);
}

/** Tab order in CustomTabBar — used for icon origin */
export const TAB_ICON_INDEX: Record<string, number> = {
  map: 1,
  durga: 2,
  contacts: 3,
  hardware: 4,
};

export const ANIMATED_TABS = new Set(Object.keys(TAB_ICON_INDEX));
