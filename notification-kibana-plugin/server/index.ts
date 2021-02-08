import { PluginInitializerContext } from '../../../src/core/server';
import { OpendistroNotificationKibanaPlugin } from './plugin';

//  This exports static code and TypeScript types,
//  as well as, Kibana Platform `plugin()` initializer.

export function plugin(initializerContext: PluginInitializerContext) {
  return new OpendistroNotificationKibanaPlugin(initializerContext);
}

export {
  OpendistroNotificationKibanaPluginSetup,
  OpendistroNotificationKibanaPluginStart,
} from './types';
