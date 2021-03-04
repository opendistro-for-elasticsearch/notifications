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
  EuiCheckboxGroup,
  EuiCheckboxGroupOption,
  EuiComboBox,
  EuiComboBoxOptionOption,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiSpacer,
  EuiSuperSelect,
  EuiSuperSelectOption,
} from '@elastic/eui';
import React, { useState } from 'react';
import { CHANNEL_TYPE } from '../../utils/constants';
import { converter } from './utils';
import ReactMde from 'react-mde';
import 'react-mde/lib/styles/css/react-mde-all.css';
import { ModalConsumer } from '../../components/Modal';
import { CreateSenderModal } from './modals/CreateSenderModal';
import { CreateRecipientGroupModal } from './modals/CreateRecipientGroupModal';
import { CreateChannelInputErrorsType } from './CreateChannel';

interface ChannelSettingsPanelProps {
  headerFooterCheckboxIdToSelectedMap: { [x: string]: boolean };
  setHeaderFooterCheckboxIdToSelectedMap: (map: {
    [x: string]: boolean;
  }) => void;
  emailHeader: string;
  setEmailHeader: (emailHeader: string) => void;
  emailFooter: string;
  setEmailFooter: (emailFooter: string) => void;
  sender: string;
  setSender: (sender: string) => void;
  selectedRecipientGroupOptions: Array<EuiComboBoxOptionOption<string>>;
  setSelectedRecipientGroupOptions: (
    options: Array<EuiComboBoxOptionOption<string>>
  ) => void;
  channelType: keyof typeof CHANNEL_TYPE;
  setChannelType: (type: keyof typeof CHANNEL_TYPE) => void;
  channelTypeOptions: Array<EuiSuperSelectOption<keyof typeof CHANNEL_TYPE>>;
  slackWebhook: string;
  setSlackWebhook: (url: string) => void;
  inputErrors: CreateChannelInputErrorsType;
}

export function ChannelSettingsPanel(props: ChannelSettingsPanelProps) {
  const checkboxOptions: EuiCheckboxGroupOption[] = [
    {
      id: 'header',
      label: 'Add header',
    },
    {
      id: 'footer',
      label: 'Add footer',
    },
  ];

  const [selectedTabFooter, setSelectedTabFooter] = React.useState<
    'write' | 'preview'
  >('write');
  const [selectedTabHeader, setSelectedTabHeader] = React.useState<
    'write' | 'preview'
  >('write');
  const senderOptions: Array<EuiSuperSelectOption<string>> = [
    {
      value: 'Admin',
      inputDisplay: 'Admin ',
    },
  ];
  const [recipientGroupOptions, setRecipientGroupOptions] = useState([
    {
      label: 'Titan',
    },
  ]);

  const onCreateEmailOption = (
    searchValue: string,
    flattenedOptions: Array<EuiComboBoxOptionOption<string>> = []
  ) => {
    const normalizedSearchValue = searchValue.trim().toLowerCase();
    if (!normalizedSearchValue) return;

    const newOption = { label: searchValue };
    if (
      flattenedOptions.findIndex(
        (option) => option.label.trim().toLowerCase() === normalizedSearchValue
      ) === -1
    ) {
      setRecipientGroupOptions([...recipientGroupOptions, newOption]);
    }
    props.setSelectedRecipientGroupOptions([
      ...props.selectedRecipientGroupOptions,
      newOption,
    ]);
  };

  const renderSlackSettings = () => {
    return (
      <EuiFormRow
        label="Slack webhook URL"
        style={{ maxWidth: '700px' }}
        error="Slack webhook URL is required."
        isInvalid={props.inputErrors.slackWebhook}
      >
        <EuiFieldText
          fullWidth
          placeholder="https://hook.slack.com/services/T0000000000/B0000000/XXXXXXXXXXXXXXX"
          value={props.slackWebhook}
          onChange={(e) => props.setSlackWebhook(e.target.value)}
        />
      </EuiFormRow>
    );
  };

  const renderEmailSettings = () => {
    return (
      <>
        <EuiSpacer size="m" />
        <EuiFlexGroup>
          <EuiFlexItem style={{ maxWidth: 400 }}>
            <EuiFormRow
              label="Sender"
              helpText={`A destination only allows one sender. Use "Create sender" to create a sender with its email address, host, port, encryption method.`}
              error="Sender is required."
              isInvalid={props.inputErrors.sender}
            >
              <EuiSuperSelect
                fullWidth
                options={senderOptions}
                valueOfSelected={props.sender}
                onChange={props.setSender}
              />
            </EuiFormRow>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiFormRow hasEmptyLabelSpace>
              <ModalConsumer>
                {({ onShow }) => (
                  <EuiButton
                    size="s"
                    onClick={() => onShow(CreateSenderModal, { test: 123 })}
                  >
                    Create sender
                  </EuiButton>
                )}
              </ModalConsumer>
            </EuiFormRow>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiFlexGroup>
          <EuiFlexItem style={{ maxWidth: 400 }}>
            <EuiFormRow
              label="Default recipients"
              helpText={`Add recipient(s) using an email address or pre-created email group. Use "Create email group" to create an email group.`}
              error="Recipient is required."
              isInvalid={props.inputErrors.recipients}
            >
              <EuiComboBox
                placeholder=""
                fullWidth
                options={recipientGroupOptions}
                selectedOptions={props.selectedRecipientGroupOptions}
                onChange={props.setSelectedRecipientGroupOptions}
                onCreateOption={onCreateEmailOption}
                isClearable={true}
              />
            </EuiFormRow>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiFormRow hasEmptyLabelSpace>
              <ModalConsumer>
                {({ onShow }) => (
                  <EuiButton
                    size="s"
                    onClick={() =>
                      onShow(CreateRecipientGroupModal, { test: 123 })
                    }
                  >
                    Create email group
                  </EuiButton>
                )}
              </ModalConsumer>
            </EuiFormRow>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiSpacer size="m" />
        <EuiFormRow>
          <EuiCheckboxGroup
            options={checkboxOptions}
            idToSelectedMap={props.headerFooterCheckboxIdToSelectedMap}
            onChange={(optionId: string) => {
              props.setHeaderFooterCheckboxIdToSelectedMap({
                ...props.headerFooterCheckboxIdToSelectedMap,
                ...{
                  [optionId]: !props.headerFooterCheckboxIdToSelectedMap[
                    optionId
                  ],
                },
              });
            }}
            legend={{ children: 'Header and footer' }}
          />
        </EuiFormRow>

        {props.headerFooterCheckboxIdToSelectedMap.header && (
          <EuiFormRow label="Header" fullWidth={true}>
            <ReactMde
              value={props.emailHeader}
              onChange={props.setEmailHeader}
              selectedTab={selectedTabHeader}
              onTabChange={setSelectedTabHeader}
              toolbarCommands={[
                ['header', 'bold', 'italic', 'strikethrough'],
                ['unordered-list', 'ordered-list', 'checked-list'],
              ]}
              generateMarkdownPreview={(markdown) =>
                Promise.resolve(converter.makeHtml(markdown))
              }
            />
          </EuiFormRow>
        )}

        {props.headerFooterCheckboxIdToSelectedMap.footer && (
          <EuiFormRow label="Footer" fullWidth={true}>
            <ReactMde
              value={props.emailFooter}
              onChange={props.setEmailFooter}
              selectedTab={selectedTabFooter}
              onTabChange={setSelectedTabFooter}
              toolbarCommands={[
                ['header', 'bold', 'italic', 'strikethrough'],
                ['unordered-list', 'ordered-list', 'checked-list'],
              ]}
              generateMarkdownPreview={(markdown) =>
                Promise.resolve(converter.makeHtml(markdown))
              }
            />
          </EuiFormRow>
        )}
      </>
    );
  };

  return (
    <>
      <EuiFormRow label="Channel type">
        <EuiSuperSelect
          options={props.channelTypeOptions}
          valueOfSelected={props.channelType}
          onChange={props.setChannelType}
        />
      </EuiFormRow>
      {props.channelType === 'SLACK'
        ? renderSlackSettings()
        : props.channelType === 'EMAIL'
        ? renderEmailSettings()
        : null}
    </>
  );
}
