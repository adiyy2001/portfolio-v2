import React from 'react';
import { needle } from '../wordmark';

export default function Needle() {
  return (
    <svg className="needle-mark" viewBox="3050 65 300 300" aria-hidden="true" focusable="false">
      <path fillRule="evenodd" d={needle} transform="rotate(-126 3200 215)" />
    </svg>
  );
}
