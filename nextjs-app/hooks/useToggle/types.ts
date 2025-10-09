export interface RefRegistryEntry {
  element: HTMLElement;
  toggleOff: () => void;
  toggleState: boolean;
}

export interface UseToggleOptions {
  defaultToggleState?: boolean;
  toggleOnRouteChange?: boolean;
}

export type UseToggleReturnType = [
  boolean,
  {
    toggle: () => void;
    toggleOn: () => void;
    toggleOff: () => void;
    registerContainerRef: (ref: HTMLElement | null) => void;
  },
];
