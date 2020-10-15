/*
 * Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
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

package com.amazon.opendistroforelasticsearch.notifications

import com.amazon.opendistroforelasticsearch.notifications.resthandler.SendRestHandler.Companion.SEND_BASE_URI
import com.google.gson.JsonObject
import org.elasticsearch.client.Request
import org.elasticsearch.client.RequestOptions
import org.elasticsearch.client.Response
import org.elasticsearch.rest.RestStatus
import org.junit.Assert
import org.springframework.integration.mail.MailReceiver
import org.springframework.integration.mail.MailSendingMessageHandler
import org.springframework.integration.mail.Pop3MailReceiver
import org.springframework.mail.javamail.JavaMailSender


abstract class NotificationsRestTestCase : ODFERestTestCase() {

    override fun initClient() {
        super.initClient()
        setUpEmailDestination()
    }

    private fun setUpEmailDestination() {
        val receiver: MailReceiver = Pop3MailReceiver("pop3://usr:pwd@localhost/INBOX")
    }

    protected fun executeRequestToJson(refTag: String,
                                       recipients: List<String>,
                                       title: String,
                                       textDescription: String,
                                       htmlDescription: String,
                                       attachment: JsonObject): JsonObject {
        val response = executeRequest(refTag, recipients, title, textDescription, htmlDescription, attachment)
        return TestUtils.jsonify(response)
    }

    protected fun executeRequest(refTag: String,
                                 recipients: List<String>,
                                 title: String,
                                 textDescription: String,
                                 htmlDescription: String,
                                 attachment: JsonObject): String {
        val request = buildRequest(refTag, recipients, title, textDescription, htmlDescription, attachment)
        val response = client().performRequest(request)
        Assert.assertEquals(200, response.statusLine.statusCode)
        return TestUtils.getResponseBody(response, true)
    }

    protected fun buildRequest(refTag: String,
                               recipients: List<String>,
                               title: String,
                               textDescription: String,
                               htmlDescription: String,
                               attachment: JsonObject): Request {
        val request = Request("POST", SEND_BASE_URI)

        val jsonEntity = TestUtils.NotificationsJsonEntity.Builder()
            .setRefTag(refTag)
            .setRecipients(recipients)
            .setTitle(title)
            .setTextDescription(textDescription)
            .setHtmlDescription(htmlDescription)
            .setAttachment(attachment.toString())
            .build()
        request.setJsonEntity(jsonEntity.getJsonEntityAsString())

        val restOptionsBuilder = RequestOptions.DEFAULT.toBuilder()
        restOptionsBuilder.addHeader("Content-Type", "application/json")
        request.setOptions(restOptionsBuilder)
        return request
    }

    protected open fun restStatus(response: Response): RestStatus? {
        return RestStatus.fromCode(response.statusLine.statusCode)
    }

}