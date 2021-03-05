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

import { ChannelItemType } from '.notifications/notifications-kibana-plugin/models/interfaces';
import {
  EuiButton,
  EuiDescriptionList,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHealth,
  EuiSpacer,
  EuiTitle,
} from '@elastic/eui';
import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  ContentPanel,
  ContentPanelActions,
} from '../../components/ContentPanel';
import { CoreServicesContext } from '../../components/coreServices';
import { ModalConsumer } from '../../components/Modal';
import { BREADCRUMBS, ROUTES } from '../../utils/constants';
import { DeleteChannelModal } from './components/modals/DeleteChannelModal';
import { MuteChannelModal } from './components/modals/MuteChannelModal';

interface ListItemType {
  title: NonNullable<React.ReactNode>;
  description: NonNullable<React.ReactNode>;
}

interface ChannelDetailsProps extends RouteComponentProps<{ id: string }> {}

export function ChannelDetails(props: ChannelDetailsProps) {
  const context = useContext(CoreServicesContext)!;
  const id = props.match.params.id;
  const [channel, setChannel] = useState<ChannelItemType>();

  useEffect(() => {
    context.chrome.setBreadcrumbs([
      BREADCRUMBS.NOTIFICATIONS,
      BREADCRUMBS.CHANNELS,
      {
        text: 'test',
        href: `${BREADCRUMBS.CHANNELS.href}/${id}`,
      },
    ]);
    setChannel({
      id,
      name: 'test',
      enabled: true,
      type: 'email',
      allowedFeatures: ['Alerting', 'ISM'],
      lastUpdatedTime: 0,
      destination: {
        slack: {
          url:
            'https://hooks.slack.com/services/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',
        },
      },
    });
  }, []);

  const channelDescriptionList: Array<ListItemType> = [
    {
      title: 'Channel name',
      description: channel?.name || '-',
    },
    {
      title: 'Description',
      description: channel?.description || '-',
    },
    {
      title: 'Last updated',
      description: channel?.lastUpdatedTime || '-',
    },
    {
      title: 'Channel type',
      description: channel?.type || '-',
    },
    {
      title: 'Sender',
      description: '-',
    },
    {
      title: 'Default recipients',
      description: '-',
    },
    {
      title: 'Email header',
      description: '-',
    },
    {
      title: 'Email footer',
      description: '-',
    },
    {
      title: 'Notification sources',
      description: channel?.allowedFeatures.join(', ') || '-',
    },
  ];

  // list is displayed horizontally on the UI, 4 items per row
  // group items into an array of rows
  const channelDescriptionListGroup = channelDescriptionList
    .concat(
      new Array(
        Math.ceil(channelDescriptionList.length / 4) * 4 -
          channelDescriptionList.length
      ).fill(null)
    )
    .reduce(
      (rows: Array<Array<ListItemType>>, item: ListItemType, i: number) => {
        if (i % 4 === 0) rows.push([item]);
        else rows[rows.length - 1].push(item);
        return rows;
      },
      []
    );

  return (
    <>
      <EuiFlexGroup
        alignItems="center"
        gutterSize="m"
        style={{ maxWidth: 1316 }}
      >
        <EuiFlexItem grow={false}>
          <EuiTitle size="l">
            <h1>test</h1>
          </EuiTitle>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          {channel?.enabled === undefined ? null : channel.enabled ? (
            <EuiHealth color="success">Active</EuiHealth>
          ) : (
            <EuiHealth color="subdued">Muted</EuiHealth>
          )}
        </EuiFlexItem>
        <EuiFlexItem />
        <ModalConsumer>
          {({ onShow }) => (
            <>
              <EuiFlexItem grow={false}>
                <EuiButton
                  size="s"
                  color="danger"
                  onClick={() =>
                    onShow(DeleteChannelModal, {
                      channels: [channel],
                    })
                  }
                >
                  Delete
                </EuiButton>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiButton
                  size="s"
                  iconType={channel?.enabled ? 'bellSlash' : 'bell'}
                  onClick={() =>
                    onShow(MuteChannelModal, {
                      channels: [channel],
                      mute: channel?.enabled,
                    })
                  }
                >
                  {channel?.enabled ? 'Mute channel' : 'Unmute channel'}
                </EuiButton>
              </EuiFlexItem>
            </>
          )}
        </ModalConsumer>
      </EuiFlexGroup>

      <EuiSpacer />
      <ContentPanel
        bodyStyles={{ padding: 'initial' }}
        title="Channel configuration"
        titleSize="s"
        panelStyles={{ maxWidth: 1300 }}
        actions={
          <ContentPanelActions
            actions={[
              {
                component: (
                  <EuiButton
                    size="s"
                    href={`#${ROUTES.EDIT_CHANNEL}/${id}?from=details`}
                  >
                    Edit
                  </EuiButton>
                ),
              },
            ]}
          />
        }
      >
        {channelDescriptionListGroup.map((row, rowIndex) => (
          <div key={`channel-description-row-${rowIndex}`}>
            <EuiSpacer />
            <EuiFlexGroup>
              {row.map((item, itemIndex) => (
                <EuiFlexItem key={`channel-description-item-${itemIndex}`}>
                  {item && <EuiDescriptionList listItems={[item]} />}
                </EuiFlexItem>
              ))}
            </EuiFlexGroup>
            <EuiSpacer />
          </div>
        ))}
      </ContentPanel>
    </>
  );
}
