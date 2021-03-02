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
} from '@elastic/eui';
import React, { useState } from 'react';

interface CreateSenderModalProps {
  props: any;
  onClose: () => void;
}

export function CreateSenderModal(props: any) {
  const [senderName, setSenderName] = useState('');
  const [email, setEmail] = useState('');
  const [host, setHost] = useState('');
  const [port, setPort] = useState('465');
  const [encryption, setEncryption] = useState<ENCRYPTION_METHOD>('SSL');
  const encryptionOptions: Array<EuiSuperSelectOption<ENCRYPTION_METHOD>> = [
    {
      value: 'SSL',
      inputDisplay: 'SSL',
    },
    {
      value: 'TSL',
      inputDisplay: 'TSL',
    },
  ];

  return (
    <EuiOverlayMask>
      <EuiModal onClose={props.onClose} style={{ width: 650 }}>
        <EuiModalHeader>
          <EuiModalHeaderTitle>Create sender</EuiModalHeaderTitle>
        </EuiModalHeader>

        <EuiModalBody>
          <EuiFormRow
            label="Sender name"
            style={{ maxWidth: '650px' }}
            helpText="Use a unique and descriptive name that's easy to search. The sender name must contain from m to n characters. Valid characters are lowercase a-z, 0-9, and - (hyphen)."
          >
            <EuiFieldText
              fullWidth
              placeholder=""
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
            />
          </EuiFormRow>

          <EuiSpacer size="m" />
          <EuiFlexGroup gutterSize="s">
            <EuiFlexItem grow={4}>
              <EuiFormRow label="Email address">
                <EuiFieldText
                  placeholder=""
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </EuiFormRow>
            </EuiFlexItem>
            <EuiFlexItem grow={4}>
              <EuiFormRow label="Host">
                <EuiFieldText
                  placeholder=""
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                />
              </EuiFormRow>
            </EuiFlexItem>
            <EuiFlexItem grow={2}>
              <EuiFormRow label="Port">
                <EuiFieldNumber
                  placeholder=""
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                />
              </EuiFormRow>
            </EuiFlexItem>
          </EuiFlexGroup>

          <EuiSpacer size="m" />
          <EuiFormRow
            label="Encryption method"
            style={{ maxWidth: '700px' }}
            helpText={
              <div>
                SSL or TSL is recommended for security. SSL and TSL requires
                validation by adding the following two fields to Elasticsearch
                keystore:
                <br />
                opendistro.alerting.destination.mail.adminTest.username:
                [username]
                <br />
                opendistro.alerting.destination.mail.adminTest.password:
                [password]
              </div>
            }
          >
            <EuiSuperSelect
              fullWidth
              options={encryptionOptions}
              valueOfSelected={encryption}
              onChange={setEncryption}
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
