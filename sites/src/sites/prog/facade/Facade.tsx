import { drawFacade, type FacadeSpec } from './draw';
import { fitToBox } from './layout';
import { num } from './shapes';

interface Props {
  spec: FacadeSpec;
  width?: number;
  height?: number;
  label?: string;
  class?: string;
}

export const Facade = ({ spec, width = 400, height = 280, label, class: className }: Props) => {
  const drawing = drawFacade(spec);
  const ground = Math.round(height * 0.13);
  const placement = fitToBox(drawing, width, height, ground, 22);
  return (
    <svg
      class={className ? `facade ${className}` : 'facade'}
      viewBox={`0 0 ${width} ${height}`}
      data-tone={spec.tone}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : 'true'}
      focusable="false">
      <rect class="fx-sky" width={width} height={height} />
      <rect class="fx-ground" y={height - ground} width={width} height={ground} />
      <g
        transform={`translate(${num(placement.x)} ${num(placement.y)}) scale(${num(placement.scale)})`}>
        {drawing.layers.map(layer => (
          <path key={layer.role} class={`fx-${layer.role}`} d={layer.d} />
        ))}
      </g>
    </svg>
  );
};
