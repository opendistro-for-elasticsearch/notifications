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

import React from 'react';
import {
  EuiFieldSearch,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPagination,
  EuiSearchBar,
  EuiSearchBarProps,
  EuiSelect,
} from '@elastic/eui';
import { FieldValueSelectionFilterConfigType } from '@elastic/eui/src/components/search_bar/filters/field_value_selection_filter';

interface ChannelControlsProps {
  search: string;
  state: string; // active or muted
  type: string;
  source: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTypeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSourceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ChannelsControls = ({
  search,
  state,
  type,
  source,
  onSearchChange,
  onStateChange,
  onTypeChange,
  onSourceChange,
}: ChannelControlsProps) => {
  const renderSearch = () => {
    const filters: FieldValueSelectionFilterConfigType[] = [
      {
        type: 'field_value_selection',
        name: 'State',
        field: 'enabled',
        multiSelect: false,
        options: [
          { name: 'Active', value: true },
          { name: 'Muted', value: false },
        ],
      },
      {
        type: 'field_value_selection',
        name: 'Type',
        field: 'type',
        multiSelect: 'or',
        options: [
          { name: 'Slack', value: 'slack' },
          { name: 'Chime', value: 'chime' },
          { name: 'Email', value: 'email' },
        ],
      },
      {
        type: 'field_value_selection',
        name: 'Source',
        field: 'source',
        multiSelect: 'or',
        options: [
          { name: 'Alerting', value: 'alerting' },
          { name: 'Reporting', value: 'reporting' },
          { name: 'ISM', value: 'ISM' },
        ],
      },
    ];

    return (
      <EuiSearchBar
        box={{
          placeholder: 'Search',
          incremental: false,
        }}
        filters={filters}
        onChange={(args) => {
          if (args.query) {
            console.log(EuiSearchBar.Query.toESQuery(args.query))
            console.log(EuiSearchBar.Query.toESQueryString(args.query))
          };
        }}
      />
    );
  };

  const stateOptions = [
    { value: 'ALL', text: 'Severity' },
    { value: '1', text: '1' },
    { value: '2', text: '2' },
    { value: '3', text: '3' },
    { value: '4', text: '4' },
    { value: '5', text: '5' },
  ];

  const typeOptions = [
    { value: 'ALL', text: 'Status' },
    { value: '1', text: 'Sent' },
    { value: '2', text: 'Error' },
  ];

  const sourceOptions = [
    { value: 'ALL', text: 'Source' },
    { value: '1', text: 'Reporting' },
    { value: '2', text: 'Alerting' },
  ];

  return (
    <>
      {renderSearch()}
      {/* <EuiFlexGroup style={{ padding: '0px 5px' }}>
      <EuiFlexItem>
        <EuiFieldSearch
          fullWidth={true}
          placeholder="Search"
          onChange={onSearchChange}
          value={search}
        />
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiSelect
          options={stateOptions}
          value={state}
          onChange={onStateChange}
        />
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiSelect options={typeOptions} value={type} onChange={onTypeChange} />
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiSelect
          options={sourceOptions}
          value={source}
          onChange={onSourceChange}
        />
      </EuiFlexItem>
    </EuiFlexGroup> */}
    </>
  );
};
