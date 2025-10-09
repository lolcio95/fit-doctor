declare global {
  interface Window {
    UC_UI?: {
      areAllConsentsAccepted: () => boolean;
    };
  }
}

export {};
