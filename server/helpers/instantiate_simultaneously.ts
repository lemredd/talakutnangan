import Router from "!/bases/router"
import ControllerLike from "!/bases/controller-like"

export default async function(classes: (new() => Router|ControllerLike)[])
: Promise<(Router|ControllerLike)[]> {
	const instances: Promise<(Router|ControllerLike)>[] = classes.map(
		ClassName => new Promise<Router|ControllerLike>(resolve => {
			resolve(new ClassName())
		})
	)

	return await Promise.all(instances)
}
