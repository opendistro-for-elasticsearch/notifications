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
 *
 */

package com.amazon.opendistroforelasticsearch.commons.notifications.model

import com.amazon.opendistroforelasticsearch.commons.notifications.model.NotificationConfig.Companion.CHIME_TAG
import com.amazon.opendistroforelasticsearch.commons.notifications.model.NotificationConfig.Companion.EMAIL_GROUP_TAG
import com.amazon.opendistroforelasticsearch.commons.notifications.model.NotificationConfig.Companion.EMAIL_TAG
import com.amazon.opendistroforelasticsearch.commons.notifications.model.NotificationConfig.Companion.SLACK_TAG
import com.amazon.opendistroforelasticsearch.commons.notifications.model.NotificationConfig.Companion.SMTP_ACCOUNT_TAG
import com.amazon.opendistroforelasticsearch.commons.notifications.model.NotificationConfig.Companion.WEBHOOK_TAG
import com.amazon.opendistroforelasticsearch.commons.notifications.model.channel.ChannelData
import com.amazon.opendistroforelasticsearch.commons.utils.logger
import org.elasticsearch.common.io.stream.Writeable.Reader
import org.elasticsearch.common.xcontent.XContentParser
import java.lang.UnsupportedOperationException
import com.amazon.opendistroforelasticsearch.commons.notifications.model.channel.Slack as SlackChannelData
import com.amazon.opendistroforelasticsearch.commons.notifications.model.channel.Chime as ChimeChannelData
import com.amazon.opendistroforelasticsearch.commons.notifications.model.channel.Email as EmailChannelData
import com.amazon.opendistroforelasticsearch.commons.notifications.model.channel.EmailGroup as EmailGroupChannelData
import com.amazon.opendistroforelasticsearch.commons.notifications.model.channel.SmtpAccount as SmtpAccountChannelData
import com.amazon.opendistroforelasticsearch.commons.notifications.model.channel.Webhook as WebhookChannelData


private val log by logger(NotificationConfigType::class.java)

enum class NotificationConfigType {
    Slack {
        override fun getChannelTag(): String {
            return SLACK_TAG
        }

        override fun getChannelReader(): Reader<SlackChannelData> {
            return SlackChannelData.reader
        }

        override fun validateDeliveryStatus(deliveryStatus: DeliveryStatus?) {
            requireNotNull(deliveryStatus)
        }

        override fun createChannelData(parser: XContentParser): SlackChannelData {
            return SlackChannelData.parse(parser)
        }
    },
    CHIME {
        override fun getChannelTag(): String {
            return CHIME_TAG
        }

        override fun getChannelReader(): Reader<ChimeChannelData> {
            return ChimeChannelData.reader
        }

        override fun validateDeliveryStatus(deliveryStatus: DeliveryStatus?) {
            requireNotNull(deliveryStatus)
        }

        override fun createChannelData(parser: XContentParser): ChimeChannelData {
            return ChimeChannelData.parse(parser)
        }
    },
    WEBHOOK {
        override fun getChannelTag(): String {
            return WEBHOOK_TAG
        }


        override fun getChannelReader(): Reader<WebhookChannelData> {
            return WebhookChannelData.reader
        }

        override fun validateDeliveryStatus(deliveryStatus: DeliveryStatus?) {
            requireNotNull(deliveryStatus)
        }

        override fun createChannelData(parser: XContentParser): WebhookChannelData {
            return WebhookChannelData.parse(parser)
        }
    },
    EMAIL {
        override fun getChannelTag(): String {
            return EMAIL_TAG
        }


        override fun getChannelReader(): Reader<EmailChannelData> {
            return EmailChannelData.reader
        }

        override fun validateDeliveryStatus(deliveryStatus: DeliveryStatus?) {
            throw UnsupportedOperationException()
        }

        override fun createChannelData(parser: XContentParser): EmailChannelData {
            return EmailChannelData.parse(parser)
        }
    },
    SMTP_ACCOUNT {
        override fun getChannelTag(): String {
            return SMTP_ACCOUNT_TAG
        }

        override fun getChannelReader(): Reader<SmtpAccountChannelData> {
            return SmtpAccountChannelData.reader
        }

        override fun validateDeliveryStatus(deliveryStatus: DeliveryStatus?) {
            requireNotNull(deliveryStatus)
        }

        override fun createChannelData(parser: XContentParser): SmtpAccountChannelData {
            return SmtpAccountChannelData.parse(parser)
        }
    },
    EMAIL_GROUP {
        override fun getChannelTag(): String {
            return EMAIL_GROUP_TAG
        }


        override fun getChannelReader(): Reader<EmailGroupChannelData> {
            return EmailGroupChannelData.reader
        }

        override fun validateDeliveryStatus(deliveryStatus: DeliveryStatus?) {
            requireNotNull(deliveryStatus)
        }

        override fun createChannelData(parser: XContentParser): EmailGroupChannelData {
            return EmailGroupChannelData.parse(parser)
        }
    },
    NONE {
        override fun getChannelTag(): String {
            throw UnsupportedOperationException()
        }

        override fun getChannelReader(): Reader<out ChannelData> {
            throw UnsupportedOperationException()
        }

        override fun validateDeliveryStatus(deliveryStatus: DeliveryStatus?) {
            log.info("Some config field not recognized")
        }

        override fun createChannelData(parser: XContentParser): ChannelData {
            throw UnsupportedOperationException()
        }
    };

    abstract fun getChannelTag(): String
    abstract fun getChannelReader(): Reader<out ChannelData>
    abstract fun createChannelData(parser: XContentParser): ChannelData
    abstract fun validateDeliveryStatus(deliveryStatus: DeliveryStatus?)
}

