import { computed } from "vue";
import Link from "./Link.vue"
type Props = {
	role: string
}
const props = defineProps<Props>()
const role = props.role
