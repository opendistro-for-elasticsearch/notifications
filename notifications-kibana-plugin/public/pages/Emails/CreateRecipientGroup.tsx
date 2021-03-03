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
  EuiComboBoxOptionOption,
  EuiFlexGroup,
  EuiFlexItem,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
  EuiSpacer,
  EuiTitle,
} from '@elastic/eui';
import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ContentPanel } from '../../components/ContentPanel';
import { CoreServicesContext } from '../../components/coreServices';
import { BREADCRUMBS } from '../../utils/constants';
import { CreateRecipientGroupForm } from './forms/CreateRecipientGroupForm';

interface CreateRecipientGroupProps extends RouteComponentProps {}

export function CreateRecipientGroup(props: CreateRecipientGroupProps) {
  const context = useContext(CoreServicesContext)!;
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

  useEffect(() => {
    context.chrome.setBreadcrumbs([
      BREADCRUMBS.NOTIFICATIONS,
      BREADCRUMBS.EMAIL_GROUPS,
      BREADCRUMBS.CREATE_RECIPIENT_GROUP,
    ]);
  }, []);

  return (
    <>
      <EuiTitle size="l">
        <h1>Create recipient group</h1>
      </EuiTitle>

      <EuiSpacer />
      <ContentPanel
        bodyStyles={{ padding: 'initial' }}
        title="Configure recipient group"
        titleSize="s"
        panelStyles={{ maxWidth: 1000 }}
      >
        <CreateRecipientGroupForm
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          selectedEmailOptions={selectedEmailOptions}
          setSelectedEmailOptions={setSelectedEmailOptions}
          emailOptions={emailOptions}
          setEmailOptions={setEmailOptions}
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
