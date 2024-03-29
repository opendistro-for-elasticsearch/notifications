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
  EuiFlexGroup,
  EuiFlexItem,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
  EuiText,
} from '@elastic/eui';
import React from 'react';
import { RecipientGroupItemType } from '../../../../../models/interfaces';
import { ModalRootProps } from '../../../../components/Modal/ModalRoot';

interface DeleteRecipientGroupModalProps extends ModalRootProps {
  recipientGroups: RecipientGroupItemType[];
  onClose: () => void;
}

export const DeleteRecipientGroupModal = (props: DeleteRecipientGroupModalProps) => {
  if (!props.recipientGroups.length) return null;

  const plural = props.recipientGroups.length >= 2;
  const name = plural
    ? `${props.recipientGroups.length} recipient groups`
    : props.recipientGroups[0].name;
  const message = `Delete ${name} permanently? Any channels using ${
    plural ? 'these' : 'this'
  } email recipient group${plural ? 's' : ''} will not be able to receive notifications.`;

  return (
    <EuiOverlayMask>
      <EuiModal onClose={props.onClose} maxWidth={500}>
        <EuiModalHeader>
          <EuiModalHeaderTitle>{`Delete ${name}?`}</EuiModalHeaderTitle>
        </EuiModalHeader>
        <EuiModalBody>
          <EuiText>{message}</EuiText>
        </EuiModalBody>
        <EuiModalFooter>
          <EuiFlexGroup justifyContent="flexEnd">
            <EuiFlexItem grow={false}>
              <EuiButtonEmpty onClick={props.onClose}>Cancel</EuiButtonEmpty>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiButton fill color="danger" onClick={props.onClose}>
                Delete
              </EuiButton>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiModalFooter>
      </EuiModal>
    </EuiOverlayMask>
  );
};
