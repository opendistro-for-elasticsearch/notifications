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

import { HISTOGRAM_TYPE } from '../../../../../models/interfaces';
import { EuiSuperSelect, EuiSuperSelectOption } from '@elastic/eui';
import React from 'react';

interface HistogramControlsProps {
  histogramType: HISTOGRAM_TYPE;
  setHistogramType: (histogramType: HISTOGRAM_TYPE) => void;
}

export function HistogramControls(props: HistogramControlsProps) {
  const histogramTypeOptions: Array<EuiSuperSelectOption<HISTOGRAM_TYPE>> = [
    {
      value: 'CHANNEL_TYPE',
      inputDisplay: 'Channel types',
    },
    {
      value: 'SOURCE',
      inputDisplay: 'Notification source',
    },
    {
      value: 'STATUS',
      inputDisplay: 'Notification status',
    },
    {
      value: 'SEVERTY',
      inputDisplay: 'Severity',
    },
    {
      value: 'TOP_10_CHANNELS',
      inputDisplay: 'Top 10 channels',
    },
  ];

  return (
    <>
      <EuiSuperSelect
        style={{ width: 300 }}
        prepend="Slice by"
        fullWidth
        options={histogramTypeOptions}
        valueOfSelected={props.histogramType}
        onChange={props.setHistogramType}
      />
    </>
  );
}
