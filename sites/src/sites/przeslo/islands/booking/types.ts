import type { BookingText } from '../../content/booking';
import type { PickerText } from '../../content/picker';
import type { Lang } from '../../i18n/lang';
import type { Day } from '../../lib/dates';
import type { FlowState } from '../../lib/flow';

export interface StepProps {
  lang: Lang;
  today: Day;
  text: BookingText;
  picker: PickerText;
  state: FlowState;
  update: (change: (current: FlowState) => FlowState) => void;
}
