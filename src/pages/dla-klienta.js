import React from 'react';
import Moved, { MovedHead } from '../components/moved';

export default function Client() {
  return <Moved lang="pl" />;
}

export const Head = () => <MovedHead lang="pl" />;
