import { useState } from 'preact/hooks';
import { link } from '../../../shared/link';
import { services } from '../data/services';
import { hoursFrom, sumFrom } from '../lib/estimate';
import { formatWorkTime, formatZl } from '../lib/format';

export default function Estimator() {
  const [picked, setPicked] = useState<string[]>([]);
  const toggle = (slug: string): void =>
    setPicked(picked.includes(slug) ? picked.filter(item => item !== slug) : [...picked, slug]);
  const ordered = services.filter(item => picked.includes(item.slug)).map(item => item.slug);
  const total = sumFrom(ordered);
  const hours = hoursFrom(ordered);

  return (
    <div class="estimator">
      <fieldset class="choices">
        <legend class="sr-only">Usługi do policzenia</legend>
        {services.map(item => (
          <label class="choice">
            <input
              type="checkbox"
              checked={picked.includes(item.slug)}
              onChange={() => toggle(item.slug)}
            />
            <span class="choice-name">{item.name}</span>
            <span class="choice-meta">od {formatZl(item.price)}</span>
          </label>
        ))}
      </fieldset>
      <div class="est-total">
        <output class="est-sum">
          {ordered.length === 0
            ? 'Zaznacz usługi, żeby policzyć sumę i czas.'
            : `Razem od ${formatZl(total)}`}
          {ordered.length > 0 && (
            <span class="est-time">Czas pracy łącznie: {formatWorkTime(hours)}</span>
          )}
        </output>
        {ordered.length > 0 && (
          <a class="book-link" href={link(`/nakretka/umow-wizyte/?usluga=${ordered.join(',')}`)}>
            Umów wizytę na wybrane usługi
          </a>
        )}
      </div>
    </div>
  );
}
