import { ContentPanel } from '../../../components/ContentPanel';
import React from 'react';
import {
  EuiCheckboxGroup,
  EuiCheckboxGroupOption,
  EuiFormRow,
  EuiSpacer,
  EuiText,
} from '@elastic/eui';
import { NOTIFICATION_SOURCE } from '../../../utils/constants';

interface ChannelAvailbilityPanelProps {
  sourceCheckboxIdToSelectedMap: { [x: string]: boolean };
  setSourceCheckboxIdToSelectedMap: (map: { [x: string]: boolean }) => void;
}

export function ChannelAvailbilityPanel(props: ChannelAvailbilityPanelProps) {
  const sourceOptions: EuiCheckboxGroupOption[] = Object.entries(
    NOTIFICATION_SOURCE
  ).map(([key, value]) => ({
    id: key,
    label: value,
  }));

  return (
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
            idToSelectedMap={props.sourceCheckboxIdToSelectedMap}
            onChange={(optionId: string) => {
              props.setSourceCheckboxIdToSelectedMap({
                ...props.sourceCheckboxIdToSelectedMap,
                ...{
                  [optionId]: !props.sourceCheckboxIdToSelectedMap[optionId],
                },
              });
            }}
          />
        </>
      </EuiFormRow>
    </ContentPanel>
  );
}
