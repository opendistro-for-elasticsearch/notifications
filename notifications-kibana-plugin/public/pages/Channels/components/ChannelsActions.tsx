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

import { ROUTES } from '../../../utils/constants';
import { EuiButton, EuiContextMenuItem, EuiPopover } from '@elastic/eui';
import React, { useState } from 'react';
import { ChannelItemType } from '../../../../models/interfaces';
import { ModalConsumer } from '../../../components/Modal';
import ErrorDetailModal from '../../Notifications/component/ErrorDetailModal/ErrorDetailModel';

interface ChannelActionsParams {
  label: string;
  disabled: boolean;
  modal?: React.ReactNode;
  href?: string;
}

interface ChannelActionsProps {
  selectedItems: ChannelItemType[];
}

export function ChannelsActions(props: ChannelActionsProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const actions: ChannelActionsParams[] = [
    {
      label: 'Edit',
      disabled: props.selectedItems.length !== 1,
      href: `#${ROUTES.EDIT_CHANNEL}/${props.selectedItems[0]?.id}`,
    },
    {
      label: 'Delete',
      disabled: props.selectedItems.length === 0,
      modal: ErrorDetailModal,
    },
    {
      label: 'Mute',
      disabled: props.selectedItems.length !== 1,
      modal: ErrorDetailModal,
    },
    {
      label: 'Unmute',
      disabled: props.selectedItems.length !== 1,
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
              size="s"
              disabled={props.selectedItems.length === 0}
              onClick={() => setIsPopoverOpen(!isPopoverOpen)}
            >
              Actions
            </EuiButton>
          }
          isOpen={isPopoverOpen}
          closePopover={() => setIsPopoverOpen(false)}
        >
          {actions.map((params) => (
            <EuiContextMenuItem
              key={params.label}
              disabled={params.disabled}
              onClick={() => {
                setIsPopoverOpen(false);
                if (params.modal) onShow(params.modal, { detail: [] });
                if (params.href) location.assign(params.href);
              }}
            >
              {params.label}
            </EuiContextMenuItem>
          ))}
        </EuiPopover>
      )}
    </ModalConsumer>
  );
}
