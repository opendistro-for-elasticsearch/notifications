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

import com.amazon.opendistroforelasticsearch.notifications.channel.EmailChannelFactory.EMAIL_PREFIX
import org.elasticsearch.common.settings.Settings

/**
 * Factory object for creating and providing channel provider.
 */
object ChannelFactory : ChannelProvider {
    private val channelMap = mapOf(EMAIL_PREFIX to EmailChannelFactory)

    /**
     * {@inheritDoc}
     */
    override fun getNotificationChannel(settings: Settings, recipient: String): NotificationChannel {
        var mappedChannel: NotificationChannel = EmptyChannel
        if (!recipient.contains(':')) { // if channel info not present
            mappedChannel = EmailChannelFactory.getNotificationChannel(settings, recipient) // Default channel is email
        } else {
            for (it in channelMap) {
                if (recipient.startsWith(it.key, true)) {
                    mappedChannel = it.value.getNotificationChannel(settings, recipient)
                    break
                }
            }
        }
        return mappedChannel
    }
}