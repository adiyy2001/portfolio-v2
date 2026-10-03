import { getListing } from '../data/listings';
import { streetHeroSlug, streetSlugs } from '../data/street';
import { drawFacade, type FacadeSpec } from '../facade/draw';
import { layoutStreet } from '../facade/layout';
import { num } from '../facade/shapes';

const hiddenRoles = new Set(['neighbour', 'neighbourWindow']);

const width = 1360;
const height = 360;
const ground = 30;
const gap = 12;

const specs: FacadeSpec[] = streetSlugs.flatMap(slug => {
  const listing = getListing(slug);
  if (!listing) return [];
  const { mark, ...rest } = listing.facade;
  return [slug === streetHeroSlug ? listing.facade : rest];
});

const heroIndex = streetSlugs.indexOf(streetHeroSlug);

export const Street = () => {
  const drawings = specs.map(drawFacade);
  const placements = layoutStreet(drawings, width, height, ground, gap);
  return (
    <svg
      class="street"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false">
      <rect class="street-pavement" y={height - ground} width={width} height={ground} />
      {drawings.map((drawing, index) => {
        const placement = placements[index];
        const spec = specs[index];
        if (!placement || !spec) return null;
        return (
          <g
            key={spec.seed}
            transform={`translate(${num(placement.x)} ${num(placement.y)}) scale(${num(placement.scale)})`}>
            <g
              class={
                index === heroIndex
                  ? 'street-building street-hero facade'
                  : 'street-building facade'
              }
              data-tone={spec.tone}
              style={`--i:${index}`}>
              {drawing.layers
                .filter(layer => !hiddenRoles.has(layer.role))
                .map(layer => (
                  <path key={layer.role} class={`fx-${layer.role}`} d={layer.d} />
                ))}
            </g>
          </g>
        );
      })}
      <rect class="street-kerb" y={height - 8} width={width} height="8" />
    </svg>
  );
};
