class Raw {
  constructor(value) {
    this.value = value;
  }
  toString() {
    return this.value;
  }
}

export const raw = value => new Raw(String(value));

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function render(value) {
  if (value instanceof Raw) return value.value;
  if (Array.isArray(value)) return value.map(render).join('');
  if (value === null || value === undefined || value === false) return '';
  return escapeHtml(value);
}

export function markup(strings, ...values) {
  let output = strings[0];
  values.forEach((value, index) => {
    output += render(value) + strings[index + 1];
  });
  return new Raw(output);
}

export function plural(count, one, few, many) {
  const tens = count % 100;
  const units = count % 10;
  if (count === 1) return one;
  if (units >= 2 && units <= 4 && !(tens >= 12 && tens <= 14)) return few;
  return many;
}

export function safeBase64(value) {
  return /^[A-Za-z0-9+/]+={0,2}$/.test(value) ? value : '';
}
