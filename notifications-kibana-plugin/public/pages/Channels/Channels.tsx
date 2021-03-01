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
  ChannelsItem,
  TableState,
} from '.notifications/notifications-kibana-plugin/models/interfaces';
import {
  Direction,
  EuiBasicTable,
  EuiHealth,
  EuiHorizontalRule,
  EuiLink,
  EuiTableFieldDataColumnType,
  //@ts-ignore
  Criteria,
  EuiTableSortingType,
  EuiContextMenuItem,
  EuiButton,
} from '@elastic/eui';
import { SORT_DIRECTION } from '../../../common';
import { Pagination } from '@elastic/eui/src/components/basic_table/pagination_bar';
import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  ContentPanel,
  ContentPanelActions,
} from '../../components/ContentPanel';
import { CoreServicesContext } from '../../components/coreServices';
import { ModalConsumer } from '../../components/Modal';
import { DEFAULT_PAGE_SIZE_OPTIONS } from '../Notifications/utils/constants';
import { BREADCRUMBS } from '../../utils/constants';
import { ChannelsControls } from './ChannelControls';
import { ChannelsActions } from './ChannelsActions';
import ErrorDetailModal from '../Notifications/component/ErrorDetailModal/ErrorDetailModel';

interface ChannelsProps extends RouteComponentProps {}

interface ChannelsState extends TableState<ChannelsItem> {
  state: string;
  type: string;
  source: string;
  isActionsPopoverOpen: boolean;
}

export class Channels extends Component<ChannelsProps, ChannelsState> {
  static contextType = CoreServicesContext;
  columns: EuiTableFieldDataColumnType<ChannelsItem>[];

  constructor(props: ChannelsProps) {
    super(props);

    this.state = {
      total: 1,
      from: 0,
      size: 5,
      search: '',
      sortField: 'name',
      sortDirection: SORT_DIRECTION.ASC,
      items: Array.from({ length: 20 }, (v, i) => ({
        name: 'abc' + i,
        status: 'Active',
        type: 'def',
        source: 'ghi',
        description: 'ee',
      })),
      selectedItems: [],
      loading: true,
      state: 'ALL',
      type: 'ALL',
      source: 'ALL',
      isActionsPopoverOpen: false,
    };

    this.columns = [
      {
        field: 'name',
        name: 'Name',
        sortable: true,
        truncateText: true,
        width: '150px',
        render: (name: string) => (
          <EuiLink href="#" target="_blank">
            {name}
          </EuiLink>
        ),
      },
      {
        field: 'status',
        name: 'Notification status',
        sortable: true,
        width: '150px',
        render: (status: string) => {
          const color = status == 'Active' ? 'success' : 'subdued';
          const label = status == 'Active' ? 'Active' : 'subdued';
          return <EuiHealth color={color}>{label}</EuiHealth>;
        },
      },
      {
        field: 'type',
        name: 'Type',
        sortable: true,
        truncateText: false,
        width: '150px',
      },
      {
        field: 'source',
        name: 'Notification source',
        sortable: true,
        truncateText: true,
        width: '150px',
      },
      {
        field: 'description',
        name: 'Description',
        sortable: true,
        truncateText: true,
        width: '150px',
      },
    ];
  }

  async componentDidMount() {
    this.context.chrome.setBreadcrumbs([
      BREADCRUMBS.NOTIFICATIONS,
      BREADCRUMBS.CHANNELS,
    ]);
    // await this.getNotifications();
  }

  onTableChange = ({ page: tablePage, sort }: Criteria<ChannelsItem>): void => {
    const { index: page, size } = tablePage;
    const { field: sortField, direction: sortDirection } = sort;
    this.setState({ from: page * size, size, sortField, sortDirection });
  };

  onSelectionChange = (selectedItems: ChannelsItem[]): void => {
    this.setState({ selectedItems });
  };

  onSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ from: 0, search: e.target.value });
  };

  onStateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ from: 0, state: e.target.value });
  };
  onTypeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ from: 0, type: e.target.value });
  };
  onSourceChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ from: 0, source: e.target.value });
  };

  onPageChange = (page: number): void => {
    const { size } = this.state;
    this.setState({ from: page * size });
  };

  render() {
    const {
      total,
      from,
      size,
      search,
      sortField,
      sortDirection,
      selectedItems,
      items,
      loading,
    } = this.state;

    const filterIsApplied = !!search;
    const page = Math.floor(from / size);

    const pagination: Pagination = {
      pageIndex: page,
      pageSize: size,
      pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
      totalItemCount: total,
    };

    const sorting: EuiTableSortingType<ChannelsItem> = {
      sort: {
        direction: sortDirection,
        field: sortField,
      },
    };

    const selection = {
      selectable: () => true,
      onSelectionChange: this.onSelectionChange,
    };

    return (
      <>
        <ContentPanel
          actions={
            <ContentPanelActions
              actions={[
                {
                  component: (
                    <ChannelsActions selectedItems={this.state.selectedItems} />
                  ),
                },
                {
                  component: <EuiButton>Create channel</EuiButton>,
                },
              ]}
            />
          }
          bodyStyles={{ padding: 'initial' }}
          title={`Channels (${this.state.total})`}
        >
          <ChannelsControls
            search={search}
            state={this.state.state}
            type={this.state.type}
            source={this.state.source}
            onSearchChange={this.onSearchChange}
            onStateChange={this.onStateChange}
            onTypeChange={this.onTypeChange}
            onSourceChange={this.onSourceChange}
            // onRefresh={this.getNotifications}
          />
          <EuiHorizontalRule margin="xs" />

          <EuiBasicTable
            columns={this.columns}
            items={items}
            itemId="name"
            isSelectable={true}
            selection={selection}
            noItemsMessage={
              // TODO: add empty prompt component, pending UXDR
              <div>no item</div>
            }
            onChange={this.onTableChange}
            pagination={pagination}
            sorting={sorting}
          />
        </ContentPanel>
      </>
    );
  }
}
