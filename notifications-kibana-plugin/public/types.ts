import { NavigationPublicPluginStart } from '../../../src/plugins/navigation/public';

export interface OpendistroNotificationKibanaPluginSetup {
  getGreeting: () => string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface OpendistroNotificationKibanaPluginStart {}

export interface AppPluginStartDependencies {
  navigation: NavigationPublicPluginStart;
}
