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

import { ENCRYPTION_METHOD } from '.notifications/notifications-kibana-plugin/models/interfaces';
import {
  EuiButton,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
  EuiTitle,
} from '@elastic/eui';
import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ContentPanel } from '../../components/ContentPanel';
import { CoreServicesContext } from '../../components/coreServices';
import { BREADCRUMBS } from '../../utils/constants';
import { CreateSenderForm } from './forms/CreateSenderForm';

interface CreateSenderProps extends RouteComponentProps {}

export function CreateSender(props: CreateSenderProps) {
  const context = useContext(CoreServicesContext)!;
  const [senderName, setSenderName] = useState('');
  const [email, setEmail] = useState('');
  const [host, setHost] = useState('');
  const [port, setPort] = useState('465');
  const [encryption, setEncryption] = useState<ENCRYPTION_METHOD>('SSL');

  useEffect(() => {
    context.chrome.setBreadcrumbs([
      BREADCRUMBS.NOTIFICATIONS,
      BREADCRUMBS.EMAIL_GROUPS,
      BREADCRUMBS.CREATE_SENDER,
    ]);
  }, []);

  return (
    <>
      <EuiTitle size="l">
        <h1>Create sender</h1>
      </EuiTitle>

      <EuiSpacer />
      <ContentPanel
        bodyStyles={{ padding: 'initial' }}
        title="Configure sender"
        titleSize="s"
        panelStyles={{ maxWidth: 1000 }}
      >
        <CreateSenderForm
          senderName={senderName}
          setSenderName={setSenderName}
          email={email}
          setEmail={setEmail}
          host={host}
          setHost={setHost}
          port={port}
          setPort={setPort}
          encryption={encryption}
          setEncryption={setEncryption}
        />
      </ContentPanel>

      <EuiSpacer />
      <EuiFlexGroup justifyContent="flexEnd" style={{ maxWidth: 1024 }}>
        <EuiFlexItem grow={false}>
          <EuiButtonEmpty size="s">Cancel</EuiButtonEmpty>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiButton fill size="s">
            Create
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
}
