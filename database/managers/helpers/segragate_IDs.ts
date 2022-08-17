import difference from "lodash.difference"

import type { SegregatedIDs } from "%/types/independent"

export default function(originalIDs: number[], modifiedIDs: number[]): SegregatedIDs {
	const deletedIDs = difference(originalIDs, modifiedIDs)
	const newIDs = difference(modifiedIDs, originalIDs)

	return {
		deletedIDs,
		newIDs
	}
}
