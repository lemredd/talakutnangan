import type { Axios } from "axios"
import axios from "axios"

import RequestEnvironment from "$!/singletons/request_environment"

import type { Response } from "$@/types/independent"

/**
 * General class to isolate the third-party library used for communicate from the rest of the
 * client-side code.
 */
export default class extends RequestEnvironment {
	private static instance: Axios = axios.create()

	static initialize() {
		if (this.isOnTest) {
			this.instance = axios.create({
				url: "http://localhost:16000/"
			})
		}
	}

	static getJSON(baseURL: string): Promise<Response> {
		return this.instance.request({
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
