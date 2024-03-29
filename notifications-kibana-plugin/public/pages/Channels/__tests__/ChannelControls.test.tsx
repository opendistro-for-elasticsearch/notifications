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

import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { ChannelControls } from '../components/ChannelControls';

describe('<ChannelControls /> spec', () => {
  it('renders the component', () => {
    const onSearchChange = jest.fn();
    const { container } = render(
      <ChannelControls search="" onSearchChange={onSearchChange} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders the component', () => {
    const onSearchChange = jest.fn();
    const utils = render(
      <ChannelControls search="" onSearchChange={onSearchChange} />
    );
    const input = utils.getByPlaceholderText('Search');

    fireEvent.change(input, { target: { value: '+(invalid query' } });
    expect(onSearchChange).not.toBeCalled();

    fireEvent.change(input, { target: { value: 'test' } });
    expect(onSearchChange).toBeCalledWith('+test');
  });
});
