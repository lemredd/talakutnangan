/* eslint-disable max-len */
import FetchMock from "jest-fetch-mock"

beforeAll(() => {
	FetchMock.enableMocks()
})

// See https://www.npmjs.com/package/jest-fetch-mock#reset-mocks-between-tests-with-fetchresetmocks
beforeEach(() => {
	// @ts-ignore
	fetch.resetMocks()
})
