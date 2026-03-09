export type SamferEventPayload = {
  event: string;
  category?: string;
  action?: string;
  label?: string;
  location?: string;
  href?: string;
};

type DataLayerWindow = Window & {
  dataLayer?: Record<string, unknown>[];
};

export function trackSamferEvent(payload: SamferEventPayload) {
  if (typeof window === "undefined") return;

  const eventPayload: Record<string, unknown> = {
    ...payload,
    timestamp: new Date().toISOString(),
  };

  const targetWindow = window as DataLayerWindow;
  if (!Array.isArray(targetWindow.dataLayer)) {
    targetWindow.dataLayer = [];
  }

  targetWindow.dataLayer.push(eventPayload);
  window.dispatchEvent(new CustomEvent("samfer:track", { detail: eventPayload }));
}
