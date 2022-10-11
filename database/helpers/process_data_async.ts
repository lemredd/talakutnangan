type UnitData<T> = T|null
type PossibleCompundData<T> = UnitData<T>|UnitData<T>[]

export default async function<T>(
	data: PossibleCompundData<T>,
	processor: (unitData: UnitData<T>) => Promise<void>
): Promise<void> {
	if (data === null) {
		return await processor(null)
	} else if (Array.isArray(data)) {
		return await data.reduce(
			(previousOperation, datum) => previousOperation.then(() => processor(datum)),
			Promise.resolve()
		)
	}

	return await processor(data)
}
