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

import {
  EuiButton,
  EuiDescriptionList,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHealth,
  EuiSpacer,
  EuiTitle,
} from '@elastic/eui';
import React, { useContext, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  ContentPanel,
  ContentPanelActions,
} from '../../components/ContentPanel';
import { CoreServicesContext } from '../../components/coreServices';
import { BREADCRUMBS, ROUTES } from '../../utils/constants';

interface ListItemType {
  title: NonNullable<React.ReactNode>;
  description: NonNullable<React.ReactNode>;
}

interface ChannelDetailsProps extends RouteComponentProps<{ id: string }> {}

export function ChannelDetails(props: ChannelDetailsProps) {
  const context = useContext(CoreServicesContext)!;
  const id = props.match.params.id;

  // TOTO send request
  const muted = false;

  useEffect(() => {
    context.chrome.setBreadcrumbs([
      BREADCRUMBS.NOTIFICATIONS,
      BREADCRUMBS.CHANNELS,
      {
        text: 'test',
        href: `${BREADCRUMBS.CHANNELS.href}/${id}`,
      },
    ]);
  }, []);

  const channelDescriptionList: Array<ListItemType> = [
    {
      title: 'Channel name',
      description: 'The opening music alone evokes such strong memories.',
    },
    {
      title: 'Description',
      description:
        'The sequel to XWING, join the dark side and fly for the Emporer.',
    },
    {
      title: 'Last updated',
      description: 'The game that made me drop out of college.',
    },
    {
      title: 'Channel type',
      description: 'The game that made me drop out of college.',
    },
    {
      title: 'Sender',
      description: 'The game that made me drop out of college.',
    },
    {
      title: 'Default recipients',
      description: 'The game that made me drop out of college.',
    },
    {
      title: 'Email header',
      description: 'The game that made me drop out of college.',
    },
    {
      title: 'Email footer',
      description: 'The game that made me drop out of college.',
    },
    {
      title: 'Notification sources',
      description: 'The game that made me drop out of college.',
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
          {muted ? (
            <EuiHealth color="subdued">Muted</EuiHealth>
          ) : (
            <EuiHealth color="success">Active</EuiHealth>
          )}
        </EuiFlexItem>
        <EuiFlexItem />
        <EuiFlexItem grow={false}>
          <EuiButton size="s" color="danger">
            Delete
          </EuiButton>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiButton size="s" iconType={muted ? 'bell' : 'bellSlash'}>
            {muted ? 'Unmute channel' : 'Mute channel'}
          </EuiButton>
        </EuiFlexItem>
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
                  <EuiButton size="s" href={`#${ROUTES.EDIT_CHANNEL}/${id}?from=details`}>
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
