export const HomeIndicator = ({ color }: { color: string }) => (
  <div
    style={{
      position: 'absolute',
      left: '50%',
      bottom: 8,
      width: 140,
      height: 5,
      marginLeft: -70,
      borderRadius: 3,
      background: color,
      zIndex: 50,
    }}
  />
);
