import type { JSX } from 'preact';
import type { AccessoryArt as ArtId } from '../data/types';

const Dripper = () => (
  <g>
    <path class="ar-s" d="M86 114H186V132Q186 148 170 148H102Q86 148 86 132Z" />
    <path class="ar-s" d="M186 120H198Q212 120 212 132Q212 144 198 144H184" />
    <rect class="ar-f" x="44" y="10" width="184" height="11" />
    <path class="ar-f" d="M54 21H218L170 98H102Z" />
    <rect class="ar-f" x="116" y="98" width="40" height="15" />
    <path class="ar-g" d="M86 26L112 94M112 26L124 94M136 26V94M160 26L148 94M186 26L160 94" />
  </g>
);

const Filters = () => (
  <g>
    <path class="ar-s ar-p" d="M44 70Q136 50 228 70L142 144Q136 150 130 144Z" />
    <path class="ar-s ar-p" d="M44 56Q136 36 228 56L142 130Q136 136 130 130Z" />
    <path class="ar-s ar-p" d="M44 42Q136 22 228 42L142 116Q136 122 130 116Z" />
    <path class="ar-s" d="M136 34V112" />
  </g>
);

const Grinder = () => (
  <g>
    <rect class="ar-f" x="106" y="46" width="60" height="14" />
    <rect class="ar-s ar-p" x="96" y="60" width="80" height="72" />
    <path class="ar-s" d="M96 86H176M96 96H176" />
    <rect class="ar-f" x="86" y="132" width="100" height="14" />
    <path class="ar-s ar-thick" d="M136 46V26H224" />
    <rect class="ar-f" x="216" y="8" width="16" height="36" />
  </g>
);

const Mug = () => (
  <g>
    <path class="ar-s" d="M108 24Q96 14 108 4M136 24Q124 14 136 4M164 24Q152 14 164 4" />
    <path class="ar-s ar-p" d="M72 46H200V112Q200 136 176 136H96Q72 136 72 112Z" />
    <path class="ar-s ar-thick" d="M200 62H218Q236 62 236 84Q236 106 218 106H200" />
    <rect class="ar-f" x="66" y="38" width="140" height="12" />
    <text class="lb-t lt9 ar-text" x="136" y="106" text-anchor="middle" font-size="34">
      TRZASK
    </text>
  </g>
);

const arts: Record<ArtId, () => JSX.Element> = {
  dripper: Dripper,
  filters: Filters,
  grinder: Grinder,
  mug: Mug,
};

export const AccessoryArt = ({ art }: { art: ArtId }) => {
  const Art = arts[art];
  return <Art />;
};
