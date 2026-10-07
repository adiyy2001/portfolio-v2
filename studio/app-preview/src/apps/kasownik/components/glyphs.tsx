import { color } from '../tokens';

export const Chevron = ({ tint = color.tertiary }: { tint?: string }) => (
  <svg width="9" height="15" viewBox="0 0 9 15">
    <path d="M1.5 1.5l6 6-6 6" fill="none" stroke={tint} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Check = ({ size = 22, tint = '#fff', progress = 1, width = 3 }: { size?: number; tint?: string; progress?: number; width?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M5 12.5l4.5 4.5L19 7.5"
      fill="none"
      stroke={tint}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - progress}
    />
  </svg>
);

export const Close = ({ tint }: { tint: string }) => (
  <svg width="14" height="14" viewBox="0 0 14 14">
    <path d="M2 2l10 10M12 2L2 12" stroke={tint} strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

export const TabIcon = ({ name, tint }: { name: string; tint: string }) => {
  if (name === 'Bilety')
    return (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke={tint} strokeWidth="2">
        <path d="M4 8.5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2.5a3 3 0 0 0 0 6V19.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V17a3 3 0 0 0 0-6z" strokeLinejoin="round" />
        <path d="M17 7v14" strokeDasharray="2 2.4" />
      </svg>
    );
  if (name === 'Moje')
    return (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke={tint} strokeWidth="2" strokeLinejoin="round">
        <rect x="4" y="9" width="20" height="13" rx="2.5" />
        <path d="M7 6h14M9.5 3.5h9" strokeLinecap="round" />
      </svg>
    );
  if (name === 'Trasa')
    return (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke={tint} strokeWidth="2" strokeLinecap="round">
        <circle cx="7.5" cy="6.5" r="2.5" />
        <circle cx="20.5" cy="21.5" r="2.5" />
        <path d="M7.5 9v4.5a3 3 0 0 0 3 3h7a3 3 0 0 1 3 3v-.5" />
      </svg>
    );
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke={tint} strokeWidth="2">
      <circle cx="14" cy="10" r="4.5" />
      <path d="M5.5 23c1.2-4.4 4.4-6.5 8.5-6.5s7.3 2.1 8.5 6.5" strokeLinecap="round" />
    </svg>
  );
};

export const CardGlyph = () => (
  <svg width="32" height="22" viewBox="0 0 32 22">
    <rect x="0.5" y="0.5" width="31" height="21" rx="4" fill={color.ink} />
    <rect x="0.5" y="5" width="31" height="4" fill="#3A424C" />
    <rect x="4" y="13.5" width="9" height="3" rx="1.5" fill="#8A929C" />
  </svg>
);

export const Tram = ({ tint = '#fff' }: { tint?: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={tint} strokeWidth="1.6" strokeLinejoin="round">
    <rect x="3" y="3" width="10" height="9" rx="2.5" />
    <path d="M3 8h10M5.5 14.5l1-2.5M10.5 14.5l-1-2.5M6 1.5h4" strokeLinecap="round" />
  </svg>
);

export const Walk = ({ tint }: { tint: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={tint} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="2.6" r="1.4" />
    <path d="M6 15l2-5 2 2v3M8 10l.8-4.4L6 7v2.5M8.8 5.6l2.2 2.4h2" />
  </svg>
);

export const Sun = ({ tint }: { tint: string }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke={tint} strokeWidth="1.7" strokeLinecap="round">
    <circle cx="9" cy="9" r="3.4" />
    <path d="M9 1.5v1.8M9 14.7v1.8M1.5 9h1.8M14.7 9h1.8M3.7 3.7l1.3 1.3M13 13l1.3 1.3M3.7 14.3L5 13M13 5l1.3-1.3" />
  </svg>
);
