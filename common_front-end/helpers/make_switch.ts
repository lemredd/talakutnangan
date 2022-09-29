import { ref } from "vue"

export default function(initialState: boolean) {
	const state = ref(initialState)
	function toggle() {
		state.value = !state.value
	}
	function on() {
		state.value = true
	}
	function off() {
		state.value = false
	}

	return {
		off,
		on,
		state,
		toggle
	}
}
