import React from 'react';
import Repo from '../../../components/repo';
import Seo from '../../../components/seo';
import signalTimeline from '../../../components/repo/signal-timeline';

export default function SignalTimeline() {
  return <Repo data={signalTimeline} lang="en" />;
}

export const Head = () => (
  <Seo
    lang="en"
    view="signal-timeline"
    title={signalTimeline.en.title}
    description={signalTimeline.en.description}
    code={signalTimeline}
  />
);
