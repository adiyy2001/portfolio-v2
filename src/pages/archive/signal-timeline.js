import React from 'react';
import Repo from '../../components/repo';
import Seo from '../../components/seo';
import signalTimeline from '../../components/repo/signal-timeline';

export default function SignalTimeline() {
  return <Repo data={signalTimeline} lang="pl" />;
}

export const Head = () => (
  <Seo
    lang="pl"
    view="signal-timeline"
    title={signalTimeline.pl.title}
    description={signalTimeline.pl.description}
    code={signalTimeline}
  />
);
