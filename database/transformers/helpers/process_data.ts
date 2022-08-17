type UnitData<T> = T|null
type PossibleCompundData<T> = UnitData<T>|UnitData<T>[]

export default function<T>(
	data: PossibleCompundData<T>,
	processor: (unitData: UnitData<T>) => UnitData<T>
): PossibleCompundData<T> {
	if (data === null) return processor(null)
	else if (Array.isArray(data)) return data.map(processor)

	return processor(data)
}
