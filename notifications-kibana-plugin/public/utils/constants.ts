/*
 * Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

export const ROUTES = Object.freeze({
  // notification
  NOTIFICATIONS: '/notifications',
  CHANNELS: '/channels',
  CREATE_CHANNEL: '/create-channel',
  EDIT_CHANNEL: '/edit-channel',
  EMAIL_GROUPS: '/email-groups',
});

export const BREADCRUMBS = Object.freeze({
  NOTIFICATIONS: { text: 'Notifications', href: '#/' },
  DASHBOARD: { text: 'Dashboard', href: `#${ROUTES.NOTIFICATIONS}` },
  CHANNELS: { text: 'Channels', href: `#${ROUTES.CHANNELS}` },
  CREATE_CHANNEL: { text: 'Create channel', href: `#${ROUTES.CREATE_CHANNEL}` },
  EMAIL_GROUPS: { text: 'Email groups', href: `#${ROUTES.EMAIL_GROUPS}` },
});

export const NOTIFICATION_STATUS = Object.freeze({
  SENT: 'Sent',
  ERROR: 'Error',
});

export const NOTIFICATION_SOURCE = Object.freeze({
  ALERTING: 'Alerting',
  ISM: 'ISM',
  REPORTING: 'Reporting',
});

export const CHANNEL_TYPE = Object.freeze({
  SLACK: 'Slack',
  EMAIL: 'Email',
  CHIME: 'Chime',
});
