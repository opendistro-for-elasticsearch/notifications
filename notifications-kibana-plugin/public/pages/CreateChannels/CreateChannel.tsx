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
  EuiButtonEmpty,
  EuiCheckboxGroup,
  EuiCheckboxGroupOption,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiSpacer,
  EuiSuperSelect,
  EuiSuperSelectOption,
  EuiText,
  EuiTextArea,
  EuiTitle,
} from '@elastic/eui';
import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ContentPanel } from '../../components/ContentPanel';
import { CoreServicesContext } from '../../components/coreServices';
import {
  BREADCRUMBS,
  CHANNEL_TYPE,
  NOTIFICATION_SOURCE,
} from '../../utils/constants';
import { SettingsPanel } from './SettingsPanel';

interface CreateChannelsProps extends RouteComponentProps {}

export function CreateChannel(props: CreateChannelsProps) {
  const context = useContext(CoreServicesContext)!;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [slackWebhook, setSlackWebhook] = useState('');
  const [checkboxIdToSelectedMap, setCheckboxIdToSelectedMap] = useState<{
    [x: string]: boolean;
  }>({});

  useEffect(() => {
    context.chrome.setBreadcrumbs([
      BREADCRUMBS.NOTIFICATIONS,
      BREADCRUMBS.CHANNELS,
      BREADCRUMBS.CREATE_CHANNEL,
    ]);
  }, []);

  const sourceOptions: EuiCheckboxGroupOption[] = Object.entries(
    NOTIFICATION_SOURCE
  ).map(([key, value]) => ({
    id: key,
    label: value,
  }));

  const channelTypeOptions: Array<EuiSuperSelectOption<
    keyof typeof CHANNEL_TYPE
  >> = Object.entries(CHANNEL_TYPE).map(([key, value]) => ({
    value: key as keyof typeof CHANNEL_TYPE,
    inputDisplay: value,
  }));
  const [channelType, setChannelType] = useState(channelTypeOptions[1].value);

  return (
    <>
      <EuiTitle size="l">
        <h1>Create channel</h1>
      </EuiTitle>

      <EuiSpacer />
      <ContentPanel
        bodyStyles={{ padding: 'initial' }}
        title="Name and description"
        titleSize="s"
      >
        <EuiFormRow label="Name">
          <EuiFieldText
            placeholder="Enter channel name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </EuiFormRow>
        <EuiFormRow
          label={
            <span>
              Description - <i style={{ fontWeight: 'normal' }}>optional</i>
            </span>
          }
        >
          <>
            <EuiText size="xs" color="subdued">
              Describe the purpose of the channel.
            </EuiText>
            <EuiTextArea
              placeholder="Describe the channel"
              style={{ height: '2.8rem' }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </>
        </EuiFormRow>
      </ContentPanel>

      <EuiSpacer />
      <ContentPanel
        bodyStyles={{ padding: 'initial' }}
        title="Settings"
        titleSize="s"
      >
        <SettingsPanel
          channelType={channelType}
          setChannelType={setChannelType}
          channelTypeOptions={channelTypeOptions}
          slackWebhook={slackWebhook}
          setSlackWebhook={setSlackWebhook}
        />
      </ContentPanel>

      <EuiSpacer />
      <ContentPanel
        bodyStyles={{ padding: 'initial' }}
        title="Availability"
        titleSize="s"
      >
        <EuiFormRow label="Notification source">
          <>
            <EuiText size="xs" color="subdued">
              Select sources where this channel will be available.
            </EuiText>
            <EuiSpacer size="s" />
            <EuiCheckboxGroup
              options={sourceOptions}
              idToSelectedMap={checkboxIdToSelectedMap}
              onChange={(optionId: string) => {
                setCheckboxIdToSelectedMap({
                  ...checkboxIdToSelectedMap,
                  ...{
                    [optionId]: !checkboxIdToSelectedMap[optionId],
                  },
                });
              }}
            />
          </>
        </EuiFormRow>
      </ContentPanel>

      <EuiSpacer />
      <EuiFlexGroup gutterSize="m" justifyContent="flexEnd">
        <EuiFlexItem grow={false}>
          <EuiButtonEmpty size="s">Cancel</EuiButtonEmpty>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiButton size="s">Send test message</EuiButton>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiButton size="s" fill>
            Create
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
}
