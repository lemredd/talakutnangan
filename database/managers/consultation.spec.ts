import type { UserIdentifierDocument } from "$/types/documents/user"
import type { ConsultationResource } from "$/types/documents/consultation"

import Model from "%/models/consultation"
import twoDigits from "$/time/two_digits"
import UserFactory from "~/factories/user"
import Factory from "~/factories/consultation"
import ChatMessage from "%/models/chat_message"
import AttachedRoleFactory from "~/factories/attached_role"
import ChatMessageActivity from "%/models/chat_message_activity"
import ChatMessageActivityFactory from "~/factories/chat_message_activity"
import convertTimeToMilliseconds from "$/time/convert_time_to_milliseconds"

import Manager from "./consultation"

describe("Database Manager: Consultation read operations", () => {
	it("can check if model belongs to user", async() => {
		const manager = new Manager()
		const user = await new UserFactory().insertOne()
		const model = await new Factory().insertOne()
		await new ChatMessageActivityFactory()
		.user(() => Promise.resolve(user))
		.consultation(() => Promise.resolve(model))
		.insertOne()

		const doesBelong = await manager.isModelBelongsTo(model.id, user.id, manager.modelChainToUser)

		expect(doesBelong).toBeTruthy()
	})

	it("can start without other started consultation", async() => {
		const manager = new Manager()
		const user = await new UserFactory().insertOne()
		const attachedRole = await new AttachedRoleFactory()
		.user(() => Promise.resolve(user))
		.insertOne()
		const model = await new Factory()
		.consultantInfo(() => Promise.resolve(attachedRole))
		.startedAt(() => null)
		.finishedAt(() => null)
		.insertOne()

		const canStart = await manager.canStart(model.id)

		expect(canStart).toBeTruthy()
	})

	it("can start after other consultation finished", async() => {
		const manager = new Manager()
		const user = await new UserFactory().insertOne()
		const attachedRole = await new AttachedRoleFactory()
		.user(() => Promise.resolve(user))
		.insertOne()
		await new Factory()
		.consultantInfo(() => Promise.resolve(attachedRole))
		.startedAt(() => new Date())
		.finishedAt(() => new Date())
		.insertOne()
		const model = await new Factory()
		.consultantInfo(() => Promise.resolve(attachedRole))
		.startedAt(() => null)
		.finishedAt(() => null)
		.insertOne()

		const canStart = await manager.canStart(model.id)

		expect(canStart).toBeTruthy()
	})

	it("can start because same consultation already starts", async() => {
		const manager = new Manager()
		const user = await new UserFactory().insertOne()
		const attachedRole = await new AttachedRoleFactory()
		.user(() => Promise.resolve(user))
		.insertOne()
		const model = await new Factory()
		.consultantInfo(() => Promise.resolve(attachedRole))
		.startedAt(() => new Date())
		.finishedAt(() => null)
		.insertOne()
		await new Factory()
		.consultantInfo(() => Promise.resolve(attachedRole))
		.startedAt(() => null)
		.insertOne()

		const canStart = await manager.canStart(model.id)

		expect(canStart).toBeTruthy()
	})

	it("cannot start because other consultation already starts", async() => {
		const manager = new Manager()
		const user = await new UserFactory().insertOne()
		const attachedRole = await new AttachedRoleFactory()
		.user(() => Promise.resolve(user))
		.insertOne()
		const model = await new Factory()
		.consultantInfo(() => Promise.resolve(attachedRole))
		.startedAt(() => null)
		.insertOne()
		await new Factory()
		.consultantInfo(() => Promise.resolve(attachedRole))
		.startedAt(() => new Date())
		.finishedAt(() => null)
		.insertOne()

		const canStart = await manager.canStart(model.id)

		expect(canStart).toBeFalsy()
	})

	it.only("can sum time by students", async() => {
		const manager = new Manager()
		const consultant = await new UserFactory().insertOne()
		const consulter = await new UserFactory().insertOne()
		const attachedRole = await new AttachedRoleFactory()
		.user(() => Promise.resolve(consultant))
		.insertOne()
		const consultations = [
			await new Factory()
			.consultantInfo(() => Promise.resolve(attachedRole))
			.startedAt(() => new Date("2022-09-01T08:00:00"))
			.finishedAt(() => new Date("2022-09-01T08:10:00"))
			.insertOne(),
			await new Factory()
			.consultantInfo(() => Promise.resolve(attachedRole))
			.startedAt(() => new Date("2022-09-02T08:00:00"))
			.finishedAt(() => new Date("2022-09-02T08:05:30"))
			.insertOne()
		]
		const consultationIterator = consultations.values()
		await new ChatMessageActivityFactory()
		.user(() => Promise.resolve(consulter))
		.consultation(() => Promise.resolve(consultationIterator.next().value))
		.insertMany(consultations.length)

		const times = await manager.sumTimePerStudents({
			"filter": {
				"dateTimeRange": {
					"begin": new Date("2022-09-01T00:00:00"),
					"end": new Date("2022-09-30T11:59:59")
				},
				"existence": "exists",
				"user": consultant.id
			},
			"page": {
				"limit": 10,
				"offset": 0
			},
			"sort": [ "-name" ]
		})

		expect(times).toStrictEqual({
			"data": [
				{
					"id": String(consulter.id),
					"meta": {
						"consultations": await new Factory().deserialize(
							consultations.map(consultation => {
								// eslint-disable-next-line no-undefined
								consultation.consultantInfo = undefined
								return consultation
							})
						),
						"totalMillisecondsConsumed": convertTimeToMilliseconds("00:15:30")
					},
					"type": "user"
				}
			]
		})
	})

	it("can sum some times by students", async() => {
		const manager = new Manager()
		const user = await new UserFactory().insertOne()
		const attachedRole = await new AttachedRoleFactory()
		.user(() => Promise.resolve(user))
		.insertOne()
		const consultations = [
			await new Factory()
			.consultantInfo(() => Promise.resolve(attachedRole))
			.startedAt(() => new Date("2022-09-03T08:10:00"))
			.finishedAt(() => new Date("2022-09-03T08:11:00"))
			.insertOne(),
			await new Factory()
			.consultantInfo(() => Promise.resolve(attachedRole))
			.startedAt(() => new Date("2022-10-01T08:02:00"))
			.finishedAt(() => new Date("2022-10-01T08:04:00"))
			.insertOne(),
			await new Factory()
			.consultantInfo(() => Promise.resolve(attachedRole))
			.startedAt(() => new Date("2022-09-04T08:00:00"))
			.finishedAt(() => new Date("2022-09-04T08:04:45"))
			.insertOne()
		]
		const consultationIterator = consultations.values()
		await new ChatMessageActivityFactory()
		.user(() => Promise.resolve(user))
		.consultation(() => Promise.resolve(consultationIterator.next().value))
		.insertMany(consultations.length)

		const times = await manager.sumTimePerStudents({
			"filter": {
				"dateTimeRange": {
					"begin": new Date("2022-09-01T00:00:00"),
					"end": new Date("2022-09-30T11:59:59")
				},
				"existence": "exists",
				"user": user.id
			},
			"page": {
				"limit": 10,
				"offset": 0
			},
			"sort": [ "-name" ]
		})

		expect(times).toStrictEqual({
			"data": [
				{
					"id": String(user.id),
					"meta": {
						"totalMillisecondsConsumed": convertTimeToMilliseconds("00:05:45")
					},
					"type": "user"
				}
			]
		})
	})

	it("can sum time by week", async() => {
		const manager = new Manager()
		const user = await new UserFactory().insertOne()
		const attachedRole = await new AttachedRoleFactory()
		.user(() => Promise.resolve(user))
		.insertOne()
		// eslint-disable-next-line no-magic-numbers
		const datesOfFebruary = [ 1, 2, 10, 11, 19, 20, 27, 28 ]
		const consultations = await Promise.all(datesOfFebruary.map(
			date => new Factory()
			.consultantInfo(() => Promise.resolve(attachedRole))
			.startedAt(() => new Date(`2015-02-${twoDigits(date)}T08:00:00`))
			.finishedAt(() => new Date(`2015-02-${twoDigits(date)}T08:10:00`))
			.insertOne()
		))
		const consultationIterator = consultations.values()
		await new ChatMessageActivityFactory()
		.user(() => Promise.resolve(user))
		.consultation(() => Promise.resolve(consultationIterator.next().value))
		.insertMany(consultations.length)

		const times = await manager.sumTimePerWeek({
			"filter": {
				"dateTimeRange": {
					"begin": new Date("2015-02-01T00:00:00"),
					"end": new Date("2015-02-28T23:59:59.999")
				},
				"existence": "exists",
				"user": user.id
			},
			"page": {
				"limit": 10,
				"offset": 0
			},
			"sort": [ "startedAt" ]
		})

		// eslint-disable-next-line no-magic-numbers
		const weekRanges = [ [ 1, 7 ], [ 8, 14 ], [ 15, 21 ], [ 22, 28 ] ]
		expect(times).toStrictEqual({
			"meta": {
				"weeklyTimeSums": weekRanges.map(([ beginDate, endDate ]) => ({
					"beginDateTime": new Date(`2015-02-${twoDigits(beginDate)}T00:00:00`),
					"endDateTime": new Date(`2015-02-${twoDigits(endDate)}T23:59:59.999`),
					"totalMillisecondsConsumed": convertTimeToMilliseconds("00:20:00")
				}))
			}
		})
	})
})

describe("Database Manager: Consultation create operations", () => {
	it("can create resource", async() => {
		const attachedRole = await new AttachedRoleFactory().insertOne()
		const user = await new UserFactory().insertOne()
		const model = await new Factory()
		.consultantInfo(() => Promise.resolve(attachedRole))
		.makeOne()
		const resource: ConsultationResource<"create"> = {
			"attributes": {
				"actionTaken": model.actionTaken,
				"deletedAt": null,
				"finishedAt": null,
				"reason": model.reason,
				"scheduledStartAt": new Date().toISOString(),
				"startedAt": null
			},
			// eslint-disable-next-line no-undefined
			"id": undefined,
			"relationships": {
				// eslint-disable-next-line no-undefined
				"chatMessageActivities": undefined,
				// eslint-disable-next-line no-undefined
				"chatMessages": undefined,
				"consultant": {
					"data": {
						"id": String(attachedRole.userID),
						"type": "user"
					}
				} as UserIdentifierDocument,
				"consultantRole": {
					"data": {
						"id": String(attachedRole.roleID),
						"type": "role"
					}
				},
				"participants": {
					"data": [
						{
							"id": String(user.id),
							"type": "user"
						},
						{
							"id": String(attachedRole.userID),
							"type": "user"
						}
					]
				}
			},
			"type": "consultation"
		}
		const manager = new Manager()

		const createdData = await manager.createUsingResource(resource, user.id)

		expect(await Model.count()).toBe(1)
		expect(await ChatMessage.count()).toBe(1)
		expect(await ChatMessageActivity.count()).toBe(2)
		expect(createdData).toHaveProperty("data.attributes.actionTaken", model.actionTaken)
		expect(createdData).toHaveProperty("data.attributes.reason", model.reason)
		expect(createdData).toHaveProperty("data.relationships.consultant")
		expect(createdData).toHaveProperty("data.relationships.chatMessages")
		expect(createdData).toHaveProperty("data.relationships.consultantRole")
		expect(createdData).toHaveProperty("data.relationships.chatMessageActivities")
	})
})

describe("Database Manager: Miscellaneous chat message operations", () => {
	it("can get sortable columns", () => {
		// Include in test to alert in case there are new columns to decide whether to expose or not
		const manager = new Manager()

		const { sortableColumns } = manager

		expect(sortableColumns).toStrictEqual([
			"-actionTaken",
			"-createdAt",
			"-deletedAt",
			"-finishedAt",
			"-id",
			"-reason",
			"-scheduledStartAt",
			"-startedAt",
			"-updatedAt",
			"actionTaken",
			"createdAt",
			"deletedAt",
			"finishedAt",
			"id",
			"reason",
			"scheduledStartAt",
			"startedAt",
			"updatedAt"
		])
	})
})
