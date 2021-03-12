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
import { render } from '@testing-library/react';
import { DeleteSenderModal } from '../components/modals/DeleteSenderModal';
import { notificationServiceMock } from '../../../../test/mocks/serviceMock';

describe('<DeleteSenderModal /> spec', () => {
  it('returns if no channels', () => {
    const { container } = render(
      <DeleteSenderModal
        senders={[]}
        onClose={() => {}}
        services={notificationServiceMock}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders the component', () => {
    const senders = [jest.fn() as any];
    const { container } = render(
      <DeleteSenderModal
        senders={senders}
        onClose={() => {}}
        services={notificationServiceMock}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders multiple channels', () => {
    const senders = [jest.fn() as any, jest.fn() as any];
    const { container } = render(
      <DeleteSenderModal
        senders={senders}
        onClose={() => {}}
        services={notificationServiceMock}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

