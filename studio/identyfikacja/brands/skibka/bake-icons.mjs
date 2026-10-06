import { withBrowser } from '../../lib/browser.mjs';
import { bakeHandcut } from './icons.mjs';

await withBrowser(bakeHandcut);
console.log('icons-handcut.json written');
