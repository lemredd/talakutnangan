import axios from "axios"

import type { Response } from "$@/types/independent"

/**
 * General class to isolate the third-party library used for communicate from the rest of the
 * client-side code.
 */
export default class {
	static getJSON(baseURL: string): Promise<Response> {
		return axios.request({
			url: baseURL
		})
		.then(response => {
			return {
				body: response.data,
				status: response.status
			}
		})
		.catch(response => {
			return {
				body: response.data,
				status: response.status
			}
		})
	}
}
