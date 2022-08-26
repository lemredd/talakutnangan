import type { Request } from "!/types/dependent"
import type {
	ValidationConstraints,
	UniqueConsultationScheduleConstraints
} from "!/types/validation"

import "~/set-ups/database.set_up"
import Factory from "~/factories/consultation"
import ChatMessageFactory from "~/factories/chat_message"
import makeInitialState from "!/validators/make_initial_state"
import uniqueConsultationSchedule from "./unique_consultation_schedule"
import ChatMessageActivityFactory from "~/factories/chat_message_activity"

describe("Validator: unique consultation schedule", () => {
	it("can accept valid input", async() => {
		const CURRENT_DATETIME = new Date()
		CURRENT_DATETIME.setMilliseconds(0)
		const model = await new Factory()
		.scheduledStartAt(() => CURRENT_DATETIME)
		.makeOne()
		const value = Promise.resolve(makeInitialState(model.scheduledStartAt))
		const constraints = {
			"field": "hello",
			"request": {} as Request,
			"source": {
				"confirm": false
			},
			"uniqueConsultationSchedule": {
				"conflictConfirmationPointer": "confirm"
			}
		} as unknown as ValidationConstraints<Request>
		& Partial<UniqueConsultationScheduleConstraints>

		const sanitizeValue = (await uniqueConsultationSchedule(value, constraints)).value

		expect(sanitizeValue).toEqual(model.scheduledStartAt)
	})

	it("cannot accept invalid value", async() => {
		const CURRENT_DATETIME = new Date()
		CURRENT_DATETIME.setMilliseconds(0)
		const previousConsultation = await new Factory()
		.scheduledStartAt(() => CURRENT_DATETIME)
		.insertOne()
		const activity = await new ChatMessageActivityFactory()
		.consultation(() => Promise.resolve(previousConsultation))
		.insertOne()
		await new ChatMessageFactory()
		.chatMessageActivity(() => Promise.resolve(activity))
		.insertOne()
		const model = await new Factory()
		.scheduledStartAt(() => CURRENT_DATETIME)
		.makeOne()
		const value = Promise.resolve(makeInitialState(model.scheduledStartAt))
		const constraints = {
			"field": "hello",
			"request": {} as Request,
			"source": {
				"confirm": false
			},
			"uniqueConsultationSchedule": {
				"conflictConfirmationPointer": "confirm"
			}
		} as unknown as ValidationConstraints<Request>
		& Partial<UniqueConsultationScheduleConstraints>

		const error = uniqueConsultationSchedule(value, constraints)

		expect(error).rejects.toHaveProperty("field", "hello")
		expect(error).rejects.toHaveProperty("messageMaker")
	})
})
