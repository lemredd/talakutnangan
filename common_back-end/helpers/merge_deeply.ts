import merge from "lodash.merge"

export default function(object: object, ...otherObjects: object[]): object {
	return merge(object, ...otherObjects)
}
