import isNumber from "lodash.isnumber"
export default function(value: any): value is boolean {
	return isNumber(value)
}
