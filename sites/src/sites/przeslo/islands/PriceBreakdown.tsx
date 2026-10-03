import type { BookingText } from '../content/booking';
import type { Lang } from '../i18n/lang';
import { formatDayShort, formatExtraLine, formatPln } from '../lib/format';
import type { Quote } from '../lib/pricing';

interface Props {
  quote: Quote;
  lang: Lang;
  text: BookingText;
  voided?: boolean;
  totalLabel?: string;
}

export const PriceBreakdown = ({ quote, lang, text, voided, totalLabel }: Props) => {
  const summary = text.summary;
  return (
    <table class={voided ? 'data-table breakdown breakdown--void' : 'data-table breakdown'}>
      <caption class="visually-hidden">{summary.priceHeading}</caption>
      <thead class="visually-hidden">
        <tr>
          <th scope="col">{summary.priceHeading}</th>
          <th scope="col">{text.aside.total}</th>
        </tr>
      </thead>
      <tbody>
        {quote.nights.map(line => (
          <tr key={line.night}>
            <th scope="row">{summary.nightLine(formatDayShort(line.night, lang))}</th>
            <td class="number">{formatPln(line.price, lang)}</td>
          </tr>
        ))}
        {quote.discount > 0 ? (
          <tr>
            <th scope="row">{summary.longStay(quote.discountPercent)}</th>
            <td class="number">{formatPln(-quote.discount, lang)}</td>
          </tr>
        ) : null}
        {quote.extras.map(line => (
          <tr key={line.id}>
            <th scope="row">
              {formatExtraLine(
                text.extras.items[line.id].name,
                line.count,
                line.multiplier,
                line.id === 'breakfast',
                text.countUnits,
                lang,
              )}
              {line.inPackage ? <span class="breakdown-note">{text.extras.included}</span> : null}
            </th>
            <td class="number">{line.inPackage ? '' : formatPln(line.amount, lang)}</td>
          </tr>
        ))}
        {quote.weekendPackage ? (
          <tr>
            <th scope="row">
              {summary.packageLine}
              <span class="breakdown-note">
                {summary.packageSaving(formatPln(quote.weekendPackage.saving, lang))}
              </span>
            </th>
            <td class="number">{formatPln(quote.weekendPackage.amount, lang)}</td>
          </tr>
        ) : null}
      </tbody>
      <tfoot>
        <tr>
          <th scope="row">{totalLabel ?? summary.total}</th>
          <td class="number">{formatPln(quote.total, lang)}</td>
        </tr>
      </tfoot>
    </table>
  );
};
