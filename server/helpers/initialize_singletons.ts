import Transport from "!/helpers/email/transport";
import CommonMiddlewareList from "!/middlewares/common_middleware_list";

export default function() {
	Transport.initialize(
		process.env.EMAIL_HOST,
		+process.env.EMAIL_PORT,
		process.env.EMAIL_USER,
		process.env.EMAIL_PASS
	)
	CommonMiddlewareList.initialize()
}
