export const statusBarHeight = 54;

export const StatusBar = ({
  time,
  color,
  fontFamily,
}: {
  time: string;
  color: string;
  fontFamily: string;
}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: statusBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '6px 30px 0 38px',
      boxSizing: 'border-box',
      color,
      fontFamily,
      fontWeight: 600,
      fontSize: 17,
      fontFeatureSettings: "'tnum'",
      zIndex: 50,
      pointerEvents: 'none',
    }}>
    <span>{time}</span>
    <svg width="78" height="14" viewBox="0 0 78 14" fill={color}>
      <rect x="0" y="9" width="3.4" height="5" rx="1" />
      <rect x="5" y="6.5" width="3.4" height="7.5" rx="1" />
      <rect x="10" y="4" width="3.4" height="10" rx="1" />
      <rect x="15" y="1.5" width="3.4" height="12.5" rx="1" />
      <path d="M31 13.4l2.5-2.6a3.6 3.6 0 0 0-5 0z" />
      <path
        d="M26.4 8.6l1.3 1.3a5.4 5.4 0 0 1 7.6 0l1.3-1.3a7.2 7.2 0 0 0-10.2 0z"
        fillRule="evenodd"
      />
      <path d="M23.8 6l1.3 1.3a9.1 9.1 0 0 1 12.8 0L39.2 6a10.9 10.9 0 0 0-15.4 0z" />
      <rect
        x="46.5"
        y="1.5"
        width="25"
        height="11.5"
        rx="3.4"
        fill="none"
        stroke={color}
        strokeOpacity="0.4"
        strokeWidth="1.2"
      />
      <rect x="48.5" y="3.5" width="17.5" height="7.5" rx="2" />
      <path d="M73.4 5.4v4a2 2 0 0 0 0-4z" fillOpacity="0.45" />
    </svg>
  </div>
);
