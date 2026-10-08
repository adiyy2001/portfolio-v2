import { iconSvg as draw } from './components/art';

export const iconSvg = ({ rounded = false, id = 'k' }: { rounded?: boolean; id?: string } = {}) => draw({ rounded, id });
