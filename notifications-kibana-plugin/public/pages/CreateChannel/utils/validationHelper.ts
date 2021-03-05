import { EuiComboBoxOptionOption } from "@elastic/eui";

// returns true if input is invalid
export const validateChannelName = (name: string) => {
  return name.length === 0;
}

export const validateSlackWebhook = (url: string) => {
  return url.length === 0;
}

export const validateEmailSender = (sender: string) => {
  return sender.length === 0;
}

export const validateRecipients = (group: Array<EuiComboBoxOptionOption<string>>) => {
  return group.length === 0;
}
