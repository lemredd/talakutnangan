import { Pipe, Day, DayValues } from "$/types/database"
import type { Time } from "%/types/independent"
import type { EmployeeScheduleQueryParameters } from "$/types/query"
import type { EmployeeScheduleAttributes } from "$/types/documents/employee_schedule"
import type {
	ModelCtor,
	Attributes,
	DestroyOptions,
	FindAndCountOptions
} from "%/types/dependent"

import Log from "$!/singletons/log"
import BaseManager from "%/managers/base"
import Model from "%/models/employee_schedule"
import DatabaseError from "$!/errors/database"
import Consultation from "%/models/consultation"
import AttachedRole from "%/models/attached_role"
import Condition from "%/helpers/condition"
import siftByDay from "%/queries/employee_schedule/sift_by_day"
import siftByUser from "%/queries/employee_schedule/sift_by_user"
import siftByRange from "%/queries/employee_schedule/sift_by_range"
import EmployeeScheduleTransformer from "%/transformers/employee_schedule"
import convertMinutesToTimeObject from "%/helpers/convert_minutes_to_time_object"

interface RawEmployeeScheduleAttributes extends EmployeeScheduleAttributes<"serialized"> {
	userID: number
}

export default class extends BaseManager<
	Model,
	RawEmployeeScheduleAttributes,
	EmployeeScheduleQueryParameters<number>
> {
	get model(): ModelCtor<Model> { return Model }

	get transformer(): EmployeeScheduleTransformer { return new EmployeeScheduleTransformer() }

	get exposableColumns(): string[] {
		const excludedColumns = [ "userID" ]
		return super.exposableColumns.filter(columnName => {
			const isIncluded = !excludedColumns.includes(columnName)
			return isIncluded
		})
	}

	get listPipeline(): Pipe<
		FindAndCountOptions<Model>,
		EmployeeScheduleQueryParameters<number>
	>[] {
		return [
			siftByDay,
			siftByUser,
			siftByRange,
			...super.listPipeline
		]
	}

	async update(id: number, details: RawEmployeeScheduleAttributes & Attributes<Model>)
	: Promise<number> {
		try {
			const foundModel = await this.model.findByPk(id, {
				...this.transaction.transactionObject
			})

			const affectedCount = super.update(id, details)

			const day = foundModel?.dayName as Day
			const originalStartTime = Number(foundModel?.scheduleStart)
			const originalEndTime = Number(foundModel?.scheduleEnd)
			const targetTimes: [ number, Day, Time, Time ][] = []

			// Ignore expansion
			if (!(
				details.scheduleStart < originalStartTime && originalEndTime < details.scheduleEnd
			)) {
				if (originalStartTime < details.scheduleStart) {
					// Start was increased therefore beginning portion should be removed
					const targetStartTime = convertMinutesToTimeObject(originalStartTime)
					const targetEndTime = convertMinutesToTimeObject(details.scheduleStart - 1)
					targetTimes.push([ id, day, targetStartTime, targetEndTime ])
				}

				if (details.scheduleEnd < originalEndTime) {
					// End was decreased therefore end portion should be removed
					const targetStartTime = convertMinutesToTimeObject(details.scheduleEnd + 1)
					const targetEndTime = convertMinutesToTimeObject(originalEndTime)
					targetTimes.push([ id, day, targetStartTime, targetEndTime ])
				}
			}

			if (targetTimes.length > 0) {
				await this.removePossibleConsultations(targetTimes)
			}

			Log.success("manager", "done updating a model")

			return affectedCount
		} catch (error) {
			throw this.makeBaseError(error)
		}
	}

	async archiveBatch(IDs: number[]): Promise<number> {
		try {
			const foundModels = await this.model.findAll({
				"where": { "id": IDs },
				...this.transaction.transactionObject
			})
			const destroyCount = await this.model.destroy(<DestroyOptions<Model>>{
				"where": { "id": IDs },
				...this.transaction.transactionObject
			})


			const targetTimes = foundModels.map(model => {
				const targetStartTime = convertMinutesToTimeObject(model.scheduleStart)
				const targetEndTime = convertMinutesToTimeObject(model.scheduleEnd)

				return [
					model.userID,
					model.dayName,
					targetStartTime,
					targetEndTime
				] as [ number, Day, Time, Time ]
			})

			await this.removePossibleConsultations(targetTimes)

			Log.success("manager", "done archiving models")

			return destroyCount
		} catch (error) {
			throw this.makeBaseError(error)
		}
	}

	private async removePossibleConsultations(targetTimes: [ number, Day, Time, Time ][])
	: Promise<void> {
		const currentTime = new Date()
		if (this.isOnTest) {
			const TEST_HOURS = 8
			currentTime.setHours(TEST_HOURS)
		}

		if (!Consultation.sequelize) {
			throw new DatabaseError("Developer may have forgot to register the models.")
		}

		const futureConsultations = await Consultation.findAll({
			"include": [
				{
					"model": AttachedRole,
					"required": true,
					"where": new Condition().or(
						...targetTimes.map(target => {
							const [ userID ] = target
							return new Condition().equal("userID", userID)
						})
					).build()
				}
			],
			"where": new Condition().greaterThanOrEqual("scheduledStartAt", currentTime).build(),
			...this.transaction.transactionObject
		})

		const consultationsToDelete = futureConsultations.filter(consultation => {
			const { scheduledStartAt, consultantInfo } = consultation
			const day = DayValues[scheduledStartAt.getDay()]
			const hours = scheduledStartAt.getHours()
			const minutes = scheduledStartAt.getMinutes()
			for (const [ userID, targetDay, targetStartTime, targetEndTime ] of targetTimes) {
				if (
					consultantInfo?.userID === userID
					&& targetDay === day
					&& (
						targetStartTime.hours < hours
						// eslint-disable-next-line no-extra-parens
						|| (
							targetStartTime.hours === hours
							&& targetStartTime.minutes <= minutes
						)
					)
					&& (
						hours < targetEndTime.hours
						// eslint-disable-next-line no-extra-parens
						|| (
							targetEndTime.hours === hours
							&& minutes <= targetEndTime.minutes
						)
					)
				) {
					return true
				}
			}

			return false
		}).map(matchedConsultation => new Condition().equal("id", matchedConsultation.id))

		if (consultationsToDelete.length > 0) {
			await Consultation.destroy(<DestroyOptions<Model>>{
				"where": new Condition().or(...consultationsToDelete).build(),
				...this.transaction.transactionObject
			})
		}
	}
}
