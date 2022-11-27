import type { ExistentiallySegregatedIDs } from "%/types/independent"
import subtract from "$/array/subtract"

export default function(
	originalIDs: number[],
	previousIDs: number[],
	modifiedIDs: number[]
): ExistentiallySegregatedIDs {
	const deletedIDs = subtract(originalIDs, modifiedIDs)
	const partiallyNewIDs = subtract(modifiedIDs, originalIDs)
	const newIDs = subtract(partiallyNewIDs, previousIDs)
	const restoredIDs = subtract(partiallyNewIDs, newIDs)

	return {
		deletedIDs,
		newIDs,
		restoredIDs
	}
}
