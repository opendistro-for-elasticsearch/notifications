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

import { HISTOGRAM_TYPE } from '.notifications/notifications-kibana-plugin/models/interfaces';
import {
  Axis,
  BarSeries,
  Chart,
  DataGenerator,
  Settings,
} from '@elastic/charts';
import { euiPaletteColorBlind } from '@elastic/eui';
import React, { useState } from 'react';
import {
  ContentPanel,
  ContentPanelActions,
} from '../../../components/ContentPanel';
import { HistogramControls } from './NotificationControls/HistogramControls';

interface NotificationsHistogramProps {}

export function NotificationsHistogram(props: NotificationsHistogramProps) {
  const [histogramType, setHistogramType] = useState<HISTOGRAM_TYPE>(
    'CHANNEL_TYPE'
  );

  const dg = new DataGenerator();
  const data2 = dg.generateGroupedSeries(25, 2, 'Channel-');

  return (
    <>
      <ContentPanel
        actions={
          <ContentPanelActions
            actions={[
              {
                component: (
                  <HistogramControls
                    histogramType={histogramType}
                    setHistogramType={setHistogramType}
                  />
                ),
              },
            ]}
          />
        }
        bodyStyles={{ padding: 'initial' }}
        title="Notifications by channel types"
        titleSize="m"
      >
        <Chart size={{ height: 200 }}>
          <Settings
            theme={{
              colors: {
                vizColors: euiPaletteColorBlind({ sortBy: 'natural' }),
              },
            }}
            showLegend={true}
          />
          <BarSeries
            id="status"
            name="Status"
            data={data2}
            xAccessor={'x'}
            yAccessors={['y']}
            splitSeriesAccessors={['g']}
            stackAccessors={['g']}
          />
          <Axis id="bottom-axis" position="bottom" />
          <Axis id="left-axis" position="left" showGridLines />
        </Chart>
      </ContentPanel>
    </>
  );
}
