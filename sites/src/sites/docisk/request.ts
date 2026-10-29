export const assistantEvent = 'docisk:assistant';
export const assistantRootId = 'asystent';

export type AssistantRequest = 'open' | 'booking';

export function initAssistantTriggers() {
  const root = document.getElementById(assistantRootId);
  if (!root) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll<HTMLElement>('[data-assistant]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const request: AssistantRequest =
        trigger.dataset.assistant === 'booking' ? 'booking' : 'open';
      root.dataset.request = request;
      root.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
      document.dispatchEvent(new CustomEvent(assistantEvent));
    });
  });
}
