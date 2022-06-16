import type { Pipe } from "$/types/database"

/**
 * Function which allows multiple transformations of data at specified constraints and pipes.
 *
 * This function was inspired from Laravel framework.
 * See: https://github.com/laravel/framework/blob/9.x/src/Illuminate/Pipeline/Pipeline.php
 *
 * @param data Data that will be transformed multiple times.
 * @param constraints Details that the pipes should be aware of.
 * @param pipeline Functions which transforms the data at specified constraints if possible.
 */
export default function<T, U>(data: T, constraints: U, pipeline: Pipe<T, U>[]): T {
	return pipeline.reduce((previousData, pipe) => {
		return pipe(previousData, constraints)
	}, data)
}
