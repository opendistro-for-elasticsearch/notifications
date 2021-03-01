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

import { ChannelsItem } from '.notifications/notifications-kibana-plugin/models/interfaces';
import { EuiPopover, EuiButton, EuiContextMenuItem } from '@elastic/eui';
import React, { useState } from 'react';
import { ModalConsumer } from '../../components/Modal';
import ErrorDetailModal from '../Notifications/component/ErrorDetailModal/ErrorDetailModel';

export function ChannelsActions(props: { selectedItems: ChannelsItem[] }) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const actions = [
    {
      label: 'Edit',
      disabled: props.selectedItems.length !== 1,
      modal: ErrorDetailModal,
    },
    {
      label: 'Delete',
      disabled: props.selectedItems.length === 0,
      modal: ErrorDetailModal,
    },
    {
      label: 'Mute',
      disabled: props.selectedItems.length === 0,
      modal: ErrorDetailModal,
    },
    {
      label: 'Unmute',
      disabled: props.selectedItems.length === 0,
      modal: ErrorDetailModal,
    },
  ];

  return (
    <ModalConsumer>
      {({ onShow }) => (
        <EuiPopover
          panelPaddingSize="none"
          button={
            <EuiButton
              iconType="arrowDown"
              iconSide="right"
              onClick={() => setIsPopoverOpen(!isPopoverOpen)}
            >
              Actions
            </EuiButton>
          }
          isOpen={isPopoverOpen}
          closePopover={() => setIsPopoverOpen(false)}
        >
          {actions.map(({ label, disabled, modal }) => (
            <EuiContextMenuItem
              key={label}
              disabled={disabled}
              onClick={() => {
                setIsPopoverOpen(false);
                onShow(modal, {});
              }}
            >
              {label}
            </EuiContextMenuItem>
          ))}
        </EuiPopover>
      )}
    </ModalConsumer>
  );
}
