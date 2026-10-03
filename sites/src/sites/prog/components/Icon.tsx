export type IconName =
  | 'heart'
  | 'check'
  | 'alert'
  | 'close'
  | 'arrow'
  | 'phone'
  | 'pin'
  | 'list'
  | 'map'
  | 'filter'
  | 'info'
  | 'mail'
  | 'clock'
  | 'plus'
  | 'minus';

interface Props {
  name: IconName;
  size?: number;
}

const paths: Record<IconName, string> = {
  heart: 'M12 20.5s-8-4.9-8-11A4.5 4.5 0 0 1 12 6.7a4.5 4.5 0 0 1 8 2.8c0 6.1-8 11-8 11z',
  check: 'M4 12.5l5 5L20 6.5',
  alert: 'M12 3.5L2.5 20h19L12 3.5zM12 10v5M12 17.2v.6',
  close: 'M5 5l14 14M19 5L5 19',
  arrow: 'M4 12h15M13 6l6 6-6 6',
  phone:
    'M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 5.5 5.5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A15.5 15.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2z',
  pin: 'M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11zM12 12.2a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2z',
  list: 'M8 6h13M8 12h13M8 18h13M3.5 6h.5M3.5 12h.5M3.5 18h.5',
  map: 'M3 6l6-2.5 6 2.5 6-2.5v14.5L15 20.5 9 18l-6 2.5V6zM9 3.5V18M15 6v14.5',
  filter: 'M3 5h18M6.5 12h11M10 19h4',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v6M12 7.3v.4',
  mail: 'M3.5 5.5h17v13h-17v-13zM3.5 6.5l8.5 7 8.5-7',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5.5l3.5 2',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
};

export const Icon = ({ name, size = 20 }: Props) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2.2"
    stroke-linecap="square"
    stroke-linejoin="miter"
    aria-hidden="true"
    focusable="false">
    <path d={paths[name]} />
  </svg>
);

export default Icon;
