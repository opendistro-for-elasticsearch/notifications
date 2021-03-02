import { ENCRYPTION_METHOD } from '../../../../models/interfaces';
import {
  EuiOverlayMask,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiModalBody,
  EuiTitle,
  EuiHorizontalRule,
  EuiModalFooter,
  EuiButton,
  EuiModal,
  EuiButtonEmpty,
  EuiFormRow,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFieldNumber,
  EuiSpacer,
  EuiSuperSelect,
  EuiSuperSelectOption,
  EuiText,
  EuiTextArea,
  EuiComboBox,
  EuiComboBoxOptionOption,
} from '@elastic/eui';
import React, { useState } from 'react';

interface CreateSenderModalProps {
  props: any;
  onClose: () => void;
}

export function CreateRecipientGroupModal(props: any) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEmailOptions, setSelectedEmailOptions] = useState<
    Array<EuiComboBoxOptionOption<string>>
  >([]);
  const [emailOptions, setEmailOptions] = useState([
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
      setEmailOptions([...emailOptions, newOption]);
    }
    setSelectedEmailOptions([...selectedEmailOptions, newOption]);
  };

  return (
    <EuiOverlayMask>
      <EuiModal onClose={props.onClose} style={{ width: 650 }}>
        <EuiModalHeader>
          <EuiModalHeaderTitle>Create recipient group</EuiModalHeaderTitle>
        </EuiModalHeader>

        <EuiModalBody>
          <EuiFormRow
            label="Name"
            style={{ maxWidth: '650px' }}
            helpText="The name must contain 2 to 50 characters. Valid characters are lowercase A-Z, a-z, 0-9, (_) underscore, (-) hyphen and unicode characters."
          >
            <EuiFieldText
              fullWidth
              placeholder="Enter channel name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </EuiFormRow>

          <EuiSpacer size="m" />
          <EuiFormRow
            label={
              <span>
                Description - <i style={{ fontWeight: 'normal' }}>optional</i>
              </span>
            }
            style={{ maxWidth: '650px' }}
          >
            <>
              <EuiText size="xs" color="subdued">
                Describe the purpose of the channel.
              </EuiText>
              <EuiTextArea
                fullWidth
                placeholder="Description"
                style={{ height: '2.8rem' }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </>
          </EuiFormRow>

          <EuiSpacer size="m" />
          <EuiFormRow label="Emails" style={{ maxWidth: '650px' }}>
            <EuiComboBox
              placeholder="Email addresses"
              fullWidth
              options={emailOptions}
              selectedOptions={selectedEmailOptions}
              onChange={setSelectedEmailOptions}
              onCreateOption={onCreateEmailOption}
              isClearable={true}
            />
          </EuiFormRow>
        </EuiModalBody>

        <EuiModalFooter>
          <EuiButtonEmpty onClick={props.onClose} size="s">
            Cancel
          </EuiButtonEmpty>
          <EuiButton fill onClick={props.onClose} size="s">
            Create
          </EuiButton>
        </EuiModalFooter>
      </EuiModal>
    </EuiOverlayMask>
  );
}
