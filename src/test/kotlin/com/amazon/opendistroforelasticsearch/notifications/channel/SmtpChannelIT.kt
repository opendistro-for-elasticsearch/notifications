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

package com.amazon.opendistroforelasticsearch.notifications.channel

import com.amazon.opendistroforelasticsearch.notifications.NotificationsRestTestCase
import com.amazon.opendistroforelasticsearch.notifications.TestUtils

internal class SmtpChannelIT : NotificationsRestTestCase() {

    fun `test send email over Smtp server`() {
        val refTag = "sample raf name";
        val recipients = listOf("mailto:fizhang@amazon.com")
        val title = "sample title"
        val textDescription = "Description for notification in text"
        val htmlDescription = "Description for notification in json encode html format"
        val attachment = TestUtils.jsonify("{\"fileName\": \"odfe.data\",\"fileEncoding\" : \"base64\", \"fileContentType\" : \"application/octet-stream\", \"fileData\" : \"VGVzdCBtZXNzYWdlCgo=\"}")

        val response = executeRequestToJson(refTag, recipients, title, textDescription, htmlDescription, attachment)

    }
}