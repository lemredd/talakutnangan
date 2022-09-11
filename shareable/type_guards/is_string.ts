import isString from "lodash.isstring"

export default function(value: any): value is string {
	return isString(value)
}
