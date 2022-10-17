<template>
	<div>
		<section class="header">
			<h1>Enter the consultation details</h1>
		</section>

		<section class="default">
			<input
				class="consultant required"
				header="Consultant"
				text-field-label="Type the employee to add"
				kind="reachable_employee"/>

			<div class="required">
				<select
					class="consultant-roles"
					label="Address consultant as:">
				</select>
			</div>

			<input
				class="consulters"
				header="Consulters"
				text-field-label="Type the students to add"
				kind="student"/>

			<div class="required">
				<select
					class="reason"
					label="Kind of Reason: "
					placeholder="Choose your reason"></select>
			</div>

			<input
				class="other-reason required"
				label="What are the other reasons(s)?"
				type="text"/>
			<div class="schedule-selector">
				<div class="consultant-has-schedules">
					<p>Please select the day and time from the consultant's available schedules</p>
					<div class="required">
						<select class="selectable-day" label="Day:"></select>
						<div class="selectable date-picker">
							<span>Select a date:</span>
							<input type="date" value=""/>
						</div>
					</div>

					<div>
						<select
							class="selectable-time"
							label="Time:">
						</select>
					</div>
				</div>
			</div>
		</section>

		<section class="footer">
		</section>
	</div>
</template>

<script setup lang="ts">
import { inject } from "vue"

import type { PageContext } from "$/types/renderer"
import type { DeserializedUserResource } from "$/types/documents/user"
import type { DeserializedRoleDocument } from "$/types/documents/role"
import type { DeserializedChatMessageResource } from "$/types/documents/chat_message"
import type { DeserializedConsultationResource } from "$/types/documents/consultation"
import type {
	DeserializedChatMessageActivityResource
} from "$/types/documents/chat_message_activity"

import {
	isMessageKindFile,
	isMessageKindStatus,
	isMessageKindText
} from "@/consultation/helpers/chat_message_kinds"

const pageContext = inject("pageContext") as PageContext<"deserialized">
const {
	"pageProps": {
		"chatMessageActivities": {
			"data": chatMessageActivitiesData
		},
		"chatMessages": {
			"data": chatMessagesData
		},
		"consultation": {
			"data": consultationData
		}
	}
} = pageContext as any

const consultation = consultationData as DeserializedConsultationResource
const {
	consultant,
	consultantRole,
	reason,
	scheduledStartAt,
	startedAt
} = consultation as unknown as {
	"consultant": DeserializedUserResource
	"consultantRole": DeserializedRoleDocument
	"reason": string
	"scheduledStartAt": Date
	"startedAt": Date
}

const consultationChatMessageActivities
= chatMessageActivitiesData as DeserializedChatMessageActivityResource[]
const consulters = consultationChatMessageActivities.filter(
	(
		activity: DeserializedChatMessageActivityResource
	) => activity.user?.data.id !== consultant.data.id
)

const chatMessages = chatMessagesData as DeserializedChatMessageResource<"user">[]
</script>
