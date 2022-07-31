import set from "lodash.set"

export default function(object: object, path: string, defaultValue: any|null = null): object {
	return set(object, path, defaultValue)
}
