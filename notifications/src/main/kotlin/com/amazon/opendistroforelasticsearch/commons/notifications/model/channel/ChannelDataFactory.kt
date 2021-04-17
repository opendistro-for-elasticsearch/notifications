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

package com.amazon.opendistroforelasticsearch.commons.notifications.model.channel

import com.amazon.opendistroforelasticsearch.commons.notifications.model.NotificationConfigType
import org.elasticsearch.common.xcontent.XContentParser

class ChannelDataFactory {

    companion object {
        @JvmField
        val tagVsType = enumValues<NotificationConfigType>().associate { type:
                                                                         NotificationConfigType ->
            type.getChannelTag() to type
        }

        fun createChannelData(fieldName: String, parser: XContentParser): ChannelData? {
            val configType = tagVsType.get(fieldName)
            if (configType == NotificationConfigType.NONE) {
                return null
            }
            return configType?.createChannelData(parser)
        }

        fun isValidChannelTag(fieldName: String): Boolean {
            return tagVsType.containsKey(fieldName)
        }
    }
}
