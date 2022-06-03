import { Sequelize } from "sequelize-typescript";
import Transport from "!/helpers/email/transport";
import RequestEnvironment from "!/helpers/request_environment";
import CommonMiddlewareList from "!/middlewares/common_middleware_list";

export default function(dataSource: Sequelize) {
	RequestEnvironment.intialize(dataSource)
	Transport.initialize(
		process.env.EMAIL_HOST,
		+process.env.EMAIL_PORT,
		process.env.EMAIL_USER,
		process.env.EMAIL_PASS
	)
	CommonMiddlewareList.initialize()
}
