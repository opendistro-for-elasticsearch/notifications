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
import com.amazon.opendistroforelasticsearch.notifications.settings.PluginSettings
import com.google.gson.JsonObject
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.cancelChildren
import kotlinx.coroutines.launch
import org.elasticsearch.client.Request
import org.elasticsearch.client.RequestOptions
import org.junit.After
import org.junit.Assert
import org.junit.Before
import org.springframework.integration.test.mail.TestMailServer
import java.io.IOException
import java.util.Properties

abstract class NotificationsRestTestCase : ODFERestTestCase() {

    private val props: Properties = System.getProperties()
    private val smtpServer: TestMailServer.SmtpServer
    private lateinit var coroutineJob: Job

    init {
        val smtpPort = PluginSettings.smtpPort
        smtpServer = TestMailServer.smtp(smtpPort)
    }

    @Before
    @Throws(InterruptedException::class)
    open fun setup() {
        if (client() == null) {
            initClient()
        }
        configServers()
        coroutineJob = GlobalScope.launch { smtpServer.run() }

        init()
    }

    @After
    open fun tearDownServer() {
        smtpServer.stop()
        coroutineJob.cancelChildren()
    }

    @After
    open fun wipeAllSettings() {
        wipeAllClusterSettings()
    }

    protected fun executeRequest(refTag: String,
                                 recipients: List<String>,
                                 title: String,
                                 textDescription: String,
                                 htmlDescription: String,
                                 attachment: JsonObject): JsonObject {
        val request = buildRequest(refTag, recipients, title, textDescription, htmlDescription, attachment)
        return executeRequest(request)
    }

    protected fun executeRequest(request: Request): JsonObject {
        val response = client().performRequest(request)
        Assert.assertEquals(200, response.statusLine.statusCode)
        val responseBody = TestUtils.getResponseBody(response, true)
        return TestUtils.jsonify(responseBody)
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

    /** Provided for each test to load test index, data and other setup work */
    protected open fun init() {}

    protected fun configServers() {
        props["mail.smtp.host"] = "127.0.0.1"
        props["mail.smtp.auth"] = "true"
        props["mail.smtp.port"] = smtpServer.port
        props["spring.mail.port"] = smtpServer.port
        props["mail.transport.protocol"] = "smtp"
    }

    @Throws(IOException::class)
    protected open fun getAllClusterSettings(): JsonObject? {
        val request = Request("GET", "/_cluster/settings?flat_settings&include_defaults")
        val restOptionsBuilder = RequestOptions.DEFAULT.toBuilder()
        restOptionsBuilder.addHeader("Content-Type", "application/json")
        request.setOptions(restOptionsBuilder)
        return executeRequest(request)
    }

    @Throws(IOException::class)
    protected fun updateClusterSettings(setting: ClusterSetting): JsonObject? {
        val request = Request("PUT", "/_cluster/settings")
        val persistentSetting = String.format("{\"%s\": {\"%s\": %s}}", setting.type, setting.name, setting.value)
        request.setJsonEntity(persistentSetting)
        val restOptionsBuilder = RequestOptions.DEFAULT.toBuilder()
        restOptionsBuilder.addHeader("Content-Type", "application/json")
        request.setOptions(restOptionsBuilder)
        return executeRequest(request)
    }

    @Throws(IOException::class)
    protected open fun wipeAllClusterSettings() {
        updateClusterSettings(ClusterSetting("persistent", "*", null))
        updateClusterSettings(ClusterSetting("transient", "*", null))
    }

   protected class ClusterSetting(val type: String, val name: String, var value: String?) {
        init {
            this.value = if (value == null) "null" else "\"" + value + "\""
        }

       fun voidSetting(): ClusterSetting {
           return ClusterSetting(type, name, null)
       }
    }
}