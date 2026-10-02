import React from 'react';
import { withPrefix } from 'gatsby';
import { LazyMotion, MotionConfig } from 'framer-motion';
import Layout from './components/layout';

const features = () => import('./features').then(module => module.default);

const prefix = withPrefix('/').slice(0, -1);

export const wrapRootElement = ({ element }) => (
  <LazyMotion features={features} strict>
    <MotionConfig reducedMotion="user">{element}</MotionConfig>
  </LazyMotion>
);

export const wrapPageElement = ({ element, props }) => (
  <Layout path={props.location.pathname.slice(prefix.length) || '/'}>{element}</Layout>
);
