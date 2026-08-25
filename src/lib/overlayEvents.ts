export const CLOSE_TRANSIENT_OVERLAYS_EVENT = 'python-study:close-transient-overlays';

export function closeTransientOverlays(): void {
  window.dispatchEvent(new Event(CLOSE_TRANSIENT_OVERLAYS_EVENT));
}
