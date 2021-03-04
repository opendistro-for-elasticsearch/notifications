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
  EuiComboBoxOptionOption,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiSpacer,
  EuiSuperSelectOption,
  EuiText,
  EuiTextArea,
  EuiTitle,
} from '@elastic/eui';
import queryString from 'query-string';
import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ContentPanel } from '../../components/ContentPanel';
import { CoreServicesContext } from '../../components/coreServices';
import {
  BREADCRUMBS,
  CHANNEL_TYPE,
  NOTIFICATION_SOURCE,
  ROUTES,
} from '../../utils/constants';
import { ChannelSettingsPanel } from './ChannelSettingsPanel';

interface CreateChannelsProps extends RouteComponentProps<{ id?: string }> {
  edit?: boolean;
}

export type CreateChannelInputErrorsType = {
  name: boolean;
  slackWebhook: boolean;
  sender: boolean;
  recipients: boolean;
};

export function CreateChannel(props: CreateChannelsProps) {
  const context = useContext(CoreServicesContext)!;
  const id = props.match.params.id;
  const prevURL =
    props.edit && queryString.parse(props.location.search).from === 'details'
      ? `#${ROUTES.CHANNEL_DETAILS}/${id}`
      : `#${ROUTES.CHANNELS}`;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [slackWebhook, setSlackWebhook] = useState('');
  const [
    headerFooterCheckboxIdToSelectedMap,
    setHeaderFooterCheckboxIdToSelectedMap,
  ] = useState<{
    [x: string]: boolean;
  }>({});
  const [emailHeader, setEmailHeader] = useState('');
  const [emailFooter, setEmailFooter] = useState('');
  const [sender, setSender] = useState('Admin');
  const [
    selectedRecipientGroupOptions,
    setSelectedRecipientGroupOptions,
  ] = useState<Array<EuiComboBoxOptionOption<string>>>([]);

  const sourceOptions: EuiCheckboxGroupOption[] = Object.entries(
    NOTIFICATION_SOURCE
  ).map(([key, value]) => ({
    id: key,
    label: value,
  }));
  const [
    sourceCheckboxIdToSelectedMap,
    setSourceCheckboxIdToSelectedMap,
  ] = useState<{
    [x: string]: boolean;
  }>({});

  const channelTypeOptions: Array<EuiSuperSelectOption<
    keyof typeof CHANNEL_TYPE
  >> = Object.entries(CHANNEL_TYPE).map(([key, value]) => ({
    value: key as keyof typeof CHANNEL_TYPE,
    inputDisplay: value,
  }));
  const [channelType, setChannelType] = useState(channelTypeOptions[0].value);

  useEffect(() => {
    context.chrome.setBreadcrumbs([
      BREADCRUMBS.NOTIFICATIONS,
      BREADCRUMBS.CHANNELS,
      props.edit ? BREADCRUMBS.EDIT_CHANNEL : BREADCRUMBS.CREATE_CHANNEL,
    ]);
    window.scrollTo(0, 0);

    if (props.edit) {
      setName('test');
      setDescription('test desc');
      setSlackWebhook('hxxp');
    }
  }, []);

  const [inputErrors, setInputErrors] = useState<CreateChannelInputErrorsType>({
    name: false,
    slackWebhook: false,
    sender: false,
    recipients: false,
  });

  // returns whether input passed validation
  const validateInput = (): boolean => {
    const errors = {
      name: name.length === 0,
      slackWebhook: channelType === 'SLACK' && slackWebhook.length === 0,
      sender: channelType === 'EMAIL' && sender.length === 0,
      recipients:
        channelType === 'EMAIL' && selectedRecipientGroupOptions.length === 0,
    };
    setInputErrors(errors);
    return !Object.values(errors).reduce(
      (errorFlag, curr) => errorFlag || curr,
      false
    );
  };

  return (
    <>
      <EuiTitle size="l">
        <h1>{`${props.edit ? 'Edit' : 'Create'} channel`}</h1>
      </EuiTitle>

      <EuiSpacer />
      <ContentPanel
        bodyStyles={{ padding: 'initial' }}
        title="Name and description"
        titleSize="s"
      >
        <EuiFormRow
          label="Name"
          error="Name is required."
          isInvalid={inputErrors.name}
        >
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
        <ChannelSettingsPanel
          headerFooterCheckboxIdToSelectedMap={
            headerFooterCheckboxIdToSelectedMap
          }
          setHeaderFooterCheckboxIdToSelectedMap={
            setHeaderFooterCheckboxIdToSelectedMap
          }
          emailHeader={emailHeader}
          setEmailHeader={setEmailHeader}
          emailFooter={emailFooter}
          setEmailFooter={setEmailFooter}
          sender={sender}
          setSender={setSender}
          selectedRecipientGroupOptions={selectedRecipientGroupOptions}
          setSelectedRecipientGroupOptions={setSelectedRecipientGroupOptions}
          channelType={channelType}
          setChannelType={setChannelType}
          channelTypeOptions={channelTypeOptions}
          slackWebhook={slackWebhook}
          setSlackWebhook={setSlackWebhook}
          inputErrors={inputErrors}
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
              idToSelectedMap={sourceCheckboxIdToSelectedMap}
              onChange={(optionId: string) => {
                setSourceCheckboxIdToSelectedMap({
                  ...sourceCheckboxIdToSelectedMap,
                  ...{
                    [optionId]: !sourceCheckboxIdToSelectedMap[optionId],
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
          <EuiButtonEmpty size="s" href={prevURL}>
            Cancel
          </EuiButtonEmpty>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiButton size="s">Send test message</EuiButton>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiButton
            size="s"
            fill
            onClick={() => {
              if (!validateInput()) return;
              location.assign(prevURL);
            }}
          >
            {props.edit ? 'Save' : 'Create'}
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
}
