import { EuiFieldText, EuiFormRow } from '@elastic/eui';
import React, { useContext } from 'react';
import { CreateChannelContext } from '../CreateChannel';
import { validateSlackWebhook } from '../utils/validationHelper';

interface SlackSettingsProps {
  slackWebhook: string;
  setSlackWebhook: (url: string) => void;
}

export function SlackSettings(props: SlackSettingsProps) {
  const context = useContext(CreateChannelContext)!;

  return (
    <EuiFormRow
      label="Slack webhook URL"
      style={{ maxWidth: '700px' }}
      error="Slack webhook URL is required."
      isInvalid={context.inputErrors.slackWebhook}
    >
      <EuiFieldText
        fullWidth
        placeholder="https://hook.slack.com/services/T0000000000/B0000000/XXXXXXXXXXXXXXX"
        value={props.slackWebhook}
        onChange={(e) => props.setSlackWebhook(e.target.value)}
        onBlur={() => {
          const error = validateSlackWebhook(props.slackWebhook);
          if (error !== context.inputErrors.slackWebhook) {
            context.setInputErrors({
              ...context.inputErrors,
              slackWebhook: error,
            });
          }
        }}
      />
    </EuiFormRow>
  );
}
