import { useEffect, useState } from 'preact/hooks';
import { hoursFallback } from '../data/site';
import { warsawClock } from '../lib/clock';
import { openStatus } from '../lib/hours';
import type { OpenStatus } from '../lib/hours';

const idle: OpenStatus = { open: false, text: hoursFallback };

export default function HoursChip() {
  const [status, setStatus] = useState<OpenStatus>(idle);

  useEffect(() => {
    const update = (): void => setStatus(openStatus(warsawClock(new Date())));
    update();
    const timer = window.setInterval(update, 60000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <p class={status.open ? 'open-chip is-open' : 'open-chip'}>
      <span>{status.text}</span>
    </p>
  );
}
