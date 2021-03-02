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

interface SettingsPanelProps {
  channelType: keyof typeof CHANNEL_TYPE;
  setChannelType: (type: keyof typeof CHANNEL_TYPE) => void;
  channelTypeOptions: Array<EuiSuperSelectOption<keyof typeof CHANNEL_TYPE>>;
  slackWebhook: string;
  setSlackWebhook: (url: string) => void;
}

export function SettingsPanel(props: SettingsPanelProps) {
  const [footer, setFooter] = useState('');
  const [selectedTabFooter, setSelectedTabFooter] = React.useState<
    'write' | 'preview'
  >('write');

  const [header, setHeader] = useState('');
  const [selectedTabHeader, setSelectedTabHeader] = React.useState<
    'write' | 'preview'
  >('write');

  const [sender, setSender] = useState('Admin');
  const senderOptions: Array<EuiSuperSelectOption<string>> = [
    {
      value: 'Admin',
      inputDisplay: 'Admin ',
    },
  ];

  const [
    selectedRecipientGroupOptions,
    setSelectedRecipientGroupOptions,
  ] = useState<Array<EuiComboBoxOptionOption<string>>>([]);
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
    setSelectedRecipientGroupOptions([
      ...selectedRecipientGroupOptions,
      newOption,
    ]);
  };

  const renderSlackSettings = () => {
    return (
      <EuiFormRow label="Slack webhook URL" style={{ maxWidth: '700px' }}>
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
    const [checkboxIdToSelectedMap, setCheckboxIdToSelectedMap] = useState<{
      [x: string]: boolean;
    }>({});
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
    return (
      <>
        <EuiSpacer size="m" />
        <EuiFlexGroup>
          <EuiFlexItem style={{ maxWidth: 400 }}>
            <EuiFormRow
              label="Sender"
              helpText={`A destination only allows one sender. Use "Create sender" to create a sender with its email address, host, port, encryption method.`}
            >
              <EuiSuperSelect
                fullWidth
                options={senderOptions}
                valueOfSelected={sender}
                onChange={setSender}
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
            >
              <EuiComboBox
                placeholder=""
                fullWidth
                options={recipientGroupOptions}
                selectedOptions={selectedRecipientGroupOptions}
                onChange={setSelectedRecipientGroupOptions}
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
            idToSelectedMap={checkboxIdToSelectedMap}
            onChange={(optionId: string) => {
              setCheckboxIdToSelectedMap({
                ...checkboxIdToSelectedMap,
                ...{
                  [optionId]: !checkboxIdToSelectedMap[optionId],
                },
              });
            }}
            legend={{ children: 'Header and footer' }}
          />
        </EuiFormRow>

        {checkboxIdToSelectedMap.header && (
          <EuiFormRow label="Header" fullWidth={true}>
            <ReactMde
              value={header}
              onChange={setHeader}
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

        {checkboxIdToSelectedMap.footer && (
          <EuiFormRow label="Footer" fullWidth={true}>
            <ReactMde
              value={footer}
              onChange={setFooter}
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
