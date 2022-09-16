import isNumber from "lodash.isnumber"
export default function(value: any): value is number {
	return isNumber(value)
}
