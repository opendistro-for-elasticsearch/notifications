import './index.scss';

import { OpendistroNotificationKibanaPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, Kibana Platform `plugin()` initializer.
export function plugin() {
  return new OpendistroNotificationKibanaPlugin();
}
export {
  OpendistroNotificationKibanaPluginSetup,
  OpendistroNotificationKibanaPluginStart,
} from './types';
