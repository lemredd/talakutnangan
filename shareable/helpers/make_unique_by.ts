import makeUniqueBy from "lodash.uniqby"

export default function(value: any[], identity: any) {
	return makeUniqueBy(value, identity)
}
