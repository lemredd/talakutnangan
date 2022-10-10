import type { SegregatedIDs } from "%/types/independent"
import subtract from "$/array/subtract"

export default function(originalIDs: number[], modifiedIDs: number[]): SegregatedIDs {
	const deletedIDs = subtract(originalIDs, modifiedIDs)
	const newIDs = subtract(modifiedIDs, originalIDs)

	return {
		deletedIDs,
		newIDs
	}
}
