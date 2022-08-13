import Validation from "!/bases/validation"
import Controller from "!/bases/controller-likes/controller"

/**
 * Specialized controller class for development routes.
 */
export default abstract class extends Controller {
	get bodyParser(): null { return null }

	get policy(): null { return null }

	get validations(): Validation[] { return [] }
}
