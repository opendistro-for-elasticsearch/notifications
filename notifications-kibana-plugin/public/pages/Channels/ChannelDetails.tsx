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
import { BREADCRUMBS } from '../../utils/constants';

interface ChannelDetailsProps extends RouteComponentProps {}

export function ChannelDetails(props) {
  const context = useContext(CoreServicesContext)!;
  const name = props.match.params.name;

  // TOTO send request
  const muted = false;

  useEffect(() => {
    context.chrome.setBreadcrumbs([
      BREADCRUMBS.NOTIFICATIONS,
      BREADCRUMBS.CHANNELS,
      {
        text: name,
        href: `${BREADCRUMBS.CHANNELS.href}/${name}`,
      },
    ]);
  }, []);

  // displayed horizontally on the UI, 4 items per row
  const channelDescriptionList = [
    [
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
    ],
    [
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
    ],
    [
      {
        title: 'Notification sources',
        description: 'The game that made me drop out of college.',
      },
      null,
      null,
      null,
    ],
  ];

  return (
    <>
      <EuiFlexGroup
        alignItems="center"
        gutterSize="m"
        style={{ maxWidth: 1316 }}
      >
        <EuiFlexItem grow={false}>
          <EuiTitle size="l">
            <h1>{name}</h1>
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
            actions={[{ component: <EuiButton size="s">Edit</EuiButton> }]}
          />
        }
      >
        {channelDescriptionList.map((row, rowIndex) => (
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
