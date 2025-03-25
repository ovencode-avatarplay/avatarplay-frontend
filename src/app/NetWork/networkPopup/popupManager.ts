// utils/popupManager.ts

type PopupParams = {
  title: string;
  description?: string;
};

let trigger: ((params: PopupParams) => void) | null = null;
let resolver: (() => void) | null = null;

export function registerPopupRenderer(fn: typeof trigger) {
  trigger = fn;
}

export function showPopup(params: PopupParams): Promise<void> {
  return new Promise(resolve => {
    resolver = resolve;
    trigger?.(params);
  });
}

export function confirmPopup() {
  resolver?.();
  resolver = null;
}
