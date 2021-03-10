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

import com.amazon.opendistroforelasticsearch.notifications.util.fieldIfNotNull
import com.amazon.opendistroforelasticsearch.notifications.util.logger
import com.amazon.opendistroforelasticsearch.notifications.util.validateUrl
import com.amazon.opendistroforelasticsearch.notifications.util.valueOf
import org.elasticsearch.common.Strings
import org.elasticsearch.common.io.stream.StreamInput
import org.elasticsearch.common.io.stream.StreamOutput
import org.elasticsearch.common.io.stream.Writeable
import org.elasticsearch.common.xcontent.ToXContent
import org.elasticsearch.common.xcontent.XContentBuilder
import org.elasticsearch.common.xcontent.XContentParser
import org.elasticsearch.common.xcontent.XContentParserUtils

data class Status(
    val configId: String,
    val configName: String,
    val configType: NotificationConfig.ConfigType,
    val emailRecipientStatus: List<EmailRecipientStatus>?,
    val statusDetail: StatusDetail?
): Writeable, ToXContent {

    init {
        require(!Strings.isNullOrEmpty(configId)) { "config id is null or empty" }
        require(!Strings.isNullOrEmpty(configName)) { "config name null or empty" }
        when (configType) {
//            NotificationConfig.ConfigType.Email -> requireNotNull(emailRecipientStatus)
            NotificationConfig.ConfigType.Chime -> requireNotNull(statusDetail)
            NotificationConfig.ConfigType.Webhook -> requireNotNull(statusDetail)
            NotificationConfig.ConfigType.Slack -> requireNotNull(statusDetail)
            NotificationConfig.ConfigType.None -> log.info("Some config field not recognized")
        }
    }

    companion object {
        private val log by logger(NotificationConfig::class.java)
        private const val CONFIG_ID_TAG = "configId"
        private const val CONFIG_NAME_TAG = "configName"
        private const val CONFIG_TYPE_TAG = "configType"
        private const val EMAIL_RECIPIENT_STATUS_TAG = "emailRecipientStatus"
        private const val STATUS_DETAIL_TAG = "statusDetail"

        /**
         * reader to create instance of class from writable.
         */
        val reader = Writeable.Reader { Status(it) }

        /**
         * Creator used in REST communication.
         * @param parser XContentParser to deserialize data from.
         */
        fun parse(parser: XContentParser): Status {
            var configName: String? = null
            var configId: String? = null
            var configType: NotificationConfig.ConfigType? = null
            var emailRecipientStatus: MutableList<EmailRecipientStatus> = mutableListOf()
            var statusDetail: StatusDetail? = null

            XContentParserUtils.ensureExpectedToken(
                XContentParser.Token.START_OBJECT,
                parser.currentToken(),
                parser::getTokenLocation
            )
            while (parser.nextToken() != XContentParser.Token.END_OBJECT) {
                val fieldName = parser.currentName()
                parser.nextToken()
                when (fieldName) {
                    CONFIG_NAME_TAG-> configName = parser.text()
                    CONFIG_ID_TAG -> configId = parser.text()
                    CONFIG_TYPE_TAG -> configType = valueOf(parser.text(), NotificationConfig.ConfigType.None)
                    EMAIL_RECIPIENT_STATUS_TAG -> {
                        XContentParserUtils.ensureExpectedToken(
                            XContentParser.Token.START_OBJECT,
                            parser.currentToken(),
                            parser::getTokenLocation
                        )
                        while (parser.nextToken() != XContentParser.Token.END_ARRAY) {
                            emailRecipientStatus.add(EmailRecipientStatus.parse(parser));
                        }
                    }
                    STATUS_DETAIL_TAG -> statusDetail = StatusDetail.parse(parser)

                    else -> {
                        log.info("Unexpected field: $fieldName, while parsing Notification Status")
                    }
                }
            }
            configName ?: throw IllegalArgumentException("$CONFIG_NAME_TAG field absent")
            configId ?: throw IllegalArgumentException("$CONFIG_ID_TAG field absent")
            configType ?: throw IllegalArgumentException("$CONFIG_TYPE_TAG field absent")

            return Status(
                configId,
                configName,
                configType,
                emailRecipientStatus,
                statusDetail
            )
        }
    }

    constructor(input: StreamInput) : this(
        configId = input.readString(),
        configName= input.readString(),
        configType = input.readEnum(NotificationConfig.ConfigType::class.java),
        emailRecipientStatus = input.readList(EmailRecipientStatus.reader),
        statusDetail = input.readOptionalWriteable(StatusDetail.reader),
        )

    override fun writeTo(output: StreamOutput) {
        output.writeString(configId)
        output.writeString(configName)
        output.writeEnum(configType)
//        output.writeOptionalWriteable(emailRecipientStatus.) //TODO?
        output.writeOptionalWriteable(statusDetail)

    }

    /**
     * {@inheritDoc}
     */
    override fun toXContent(builder: XContentBuilder?, params: ToXContent.Params?): XContentBuilder {
        builder!!
        return builder.startObject()
            .field(CONFIG_ID_TAG, configId)
            .field(CONFIG_TYPE_TAG, configType)
            .field(CONFIG_NAME_TAG, configName)
            .fieldIfNotNull(EMAIL_RECIPIENT_STATUS_TAG, emailRecipientStatus)
            .fieldIfNotNull(STATUS_DETAIL_TAG, statusDetail)
            .endObject()
    }

    data class StatusDetail(
        val statusCode: String,
        val statusText: String,
    ) : Writeable, ToXContent {

        init {
            require(!Strings.isNullOrEmpty(statusCode)) { "StatusCode is null or empty" }
            require(!Strings.isNullOrEmpty(statusText)) { "statusText is null or empty" }

        }
        companion object {
            private val log by logger(StatusDetail::class.java)
            private const val STATUS_CODE_TAG = "statusCode"
            private const val STATUS_TEXT_TAG = "statusText"

            /**
             * reader to create instance of class from writable.
             */
            val reader = Writeable.Reader { StatusDetail(it) }

            /**
             * Creator used in REST communication.
             * @param parser XContentParser to deserialize data from.
             */
            fun parse(parser: XContentParser): StatusDetail {
                var statusCode: String? = null
                var statusText: String? = null

                XContentParserUtils.ensureExpectedToken(
                    XContentParser.Token.START_OBJECT,
                    parser.currentToken(),
                    parser::getTokenLocation
                )
                while (parser.nextToken() != XContentParser.Token.END_OBJECT) {
                    val fieldName = parser.currentName()
                    parser.nextToken()
                    when (fieldName) {
                        STATUS_CODE_TAG -> statusCode = parser.text()
                        STATUS_TEXT_TAG -> statusText = parser.text()
                        else -> {
                            log.info("Unexpected field: $fieldName, while parsing StatusDetail")
                        }
                    }
                }
                statusCode ?: throw IllegalArgumentException("$STATUS_CODE_TAG field absent")
                statusText?: throw IllegalArgumentException("$STATUS_TEXT_TAG field absent")
                return StatusDetail(
                    statusCode,
                    statusText
                )
            }
        }

        constructor(input: StreamInput) : this(
            statusCode = input.readString(),
            statusText = input.readString()
        )

        override fun writeTo(output: StreamOutput) {
            output.writeString(statusCode)
            output.writeString(statusText)
        }

        /**
         * {@inheritDoc}
         */
        override fun toXContent(builder: XContentBuilder?, params: ToXContent.Params?): XContentBuilder {
            builder!!
            return builder.startObject()
                .field(STATUS_CODE_TAG, statusCode)
                .field(STATUS_TEXT_TAG, statusText)
                .endObject()
        }
    }

    data class EmailRecipientStatus(
        val recipient: String,
        val statusDetail: StatusDetail
    ): Writeable, ToXContent {

        init {
            require(!Strings.isNullOrEmpty(recipient)) { "recipient is null or empty" }
        }

        companion object {
            private val log by logger(EmailRecipientStatus::class.java)
            private const val RECIPIENT_TAG = "recipient"
            private const val STATUS_DETAIL_TAG = "statusDetail"

            /**
             * reader to create instance of class from writable.
             */
            val reader = Writeable.Reader { EmailRecipientStatus(it) }

            /**
             * Creator used in REST communication.
             * @param parser XContentParser to deserialize data from.
             */
            fun parse(parser: XContentParser): EmailRecipientStatus {
                var recipient: String? = null
                var statusDetail: StatusDetail? = null

                XContentParserUtils.ensureExpectedToken(
                    XContentParser.Token.START_OBJECT,
                    parser.currentToken(),
                    parser::getTokenLocation
                )
                while (parser.nextToken() != XContentParser.Token.END_OBJECT) {
                    val fieldName = parser.currentName()
                    parser.nextToken()
                    when (fieldName) {
                        RECIPIENT_TAG -> recipient = parser.text()
                        STATUS_DETAIL_TAG -> statusDetail = StatusDetail.parse(parser)
                        else -> {
                            log.info("Unexpected field: $fieldName, while parsing Slack destination")
                        }
                    }
                }
                recipient ?: throw IllegalArgumentException("$RECIPIENT_TAG field absent")
                statusDetail ?: throw IllegalArgumentException("$STATUS_DETAIL_TAG field absent")

                return EmailRecipientStatus(recipient, statusDetail)
            }

        }

        constructor(input: StreamInput) : this(
            recipient = input.readString(),
            statusDetail = StatusDetail.reader.read(input)
        )

        override fun writeTo(output: StreamOutput) {
            output.writeString(recipient)
            statusDetail.writeTo(output)
        }

        /**
         * {@inheritDoc}
         */
        override fun toXContent(builder: XContentBuilder?, params: ToXContent.Params?): XContentBuilder {
            builder!!
            return builder.startObject()
                .field(RECIPIENT_TAG, recipient)
                .field(STATUS_DETAIL_TAG, statusDetail)
                .endObject()
        }
    }
}

