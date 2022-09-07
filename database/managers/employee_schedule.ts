import { Pipe, DayValues } from "$/types/database"
import type { EmployeeScheduleQueryParameters } from "$/types/query"
import type { EmployeeScheduleAttributes } from "$/types/documents/employee_schedule"
import type { ModelCtor, FindAndCountOptions, DestroyOptions } from "%/types/dependent"

import Log from "$!/singletons/log"
import BaseManager from "%/managers/base"
import Model from "%/models/employee_schedule"
import DatabaseError from "$!/errors/database"
import Consultation from "%/models/consultation"
import Condition from "%/managers/helpers/condition"
import siftByDay from "%/queries/employee_schedule/sift_by_day"
import siftByUser from "%/queries/employee_schedule/sift_by_user"
import siftByRange from "%/queries/employee_schedule/sift_by_range"
import EmployeeScheduleTransformer from "%/transformers/employee_schedule"
import convertMinutesToTimeObject from "%/managers/helpers/convert_minutes_to_time_object"

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

			const currentTime = new Date()
			if (this.isOnTest) {
				const TEST_HOURS = 8
				currentTime.setHours(TEST_HOURS)
			}

			if (!Consultation.sequelize) {
				throw new DatabaseError("Developer may have forgot to register the models.")
			}

			const futureConsultations = await Consultation.findAll({
				"where": new Condition().greaterThanOrEqual("scheduledStartAt", currentTime).build(),
				...this.transaction.transactionObject
			})
			const consultationsToDelete = futureConsultations.filter(consultation => {
				const { scheduledStartAt } = consultation
				const day = DayValues[scheduledStartAt.getDay()]
				const hours = scheduledStartAt.getHours()
				const minutes = scheduledStartAt.getMinutes()
				for (const model of foundModels) {
					const targetStartTime = convertMinutesToTimeObject(model.scheduleStart)
					const targetEndTime = convertMinutesToTimeObject(model.scheduleEnd)

					if (
						model.dayName === day
						&& (
							targetStartTime.hours < hours
							// eslint-disable-next-line no-extra-parens
							|| (
								targetStartTime.hours === hours
								&& targetStartTime.minutes <= minutes
							)
						)
						&& (
							targetEndTime.hours > hours
							// eslint-disable-next-line no-extra-parens
							|| (
								targetEndTime.hours === hours
								&& targetEndTime.minutes >= minutes
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

			Log.success("manager", "done archiving models")

			return destroyCount
		} catch (error) {
			throw this.makeBaseError(error)
		}
	}
}
