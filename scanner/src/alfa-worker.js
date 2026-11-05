import { parentPort, workerData } from 'node:worker_threads';
import { Audit, Outcome } from '@siteimprove/alfa-act';
import rules from '@siteimprove/alfa-rules';
import { Page } from '@siteimprove/alfa-web';
import { summarizeOutcomes } from './alfa-summary.js';

const page = Page.from(JSON.parse(workerData.snapshot)).getUnsafe();
const outcomes = await Audit.of(page, rules).evaluate();
parentPort.postMessage(summarizeOutcomes([...outcomes].filter(Outcome.isFailed)));
