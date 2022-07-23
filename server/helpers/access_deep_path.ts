import get from "lodash.get"

export default function(object: object, path: string, defaultValue: any|null = null): any|null {
	return get(object, path, defaultValue)
}
