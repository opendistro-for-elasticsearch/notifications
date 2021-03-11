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

import com.amazon.opendistroforelasticsearch.notifications.util.logger
import org.elasticsearch.common.Strings
import org.elasticsearch.common.io.stream.StreamInput
import org.elasticsearch.common.io.stream.StreamOutput
import org.elasticsearch.common.io.stream.Writeable
import org.elasticsearch.common.xcontent.ToXContent
import org.elasticsearch.common.xcontent.XContentBuilder
import org.elasticsearch.common.xcontent.XContentParser
import org.elasticsearch.common.xcontent.XContentParserUtils

/**
 * Data class representing Email Recipient Status.
 */
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

    /**
     * Constructor used in transport action communication.
     * @param input StreamInput stream to deserialize data from.
     */
    constructor(input: StreamInput) : this(
        recipient = input.readString(),
        statusDetail = StatusDetail.reader.read(input)
    )

    /**
     * {@inheritDoc}
     */
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