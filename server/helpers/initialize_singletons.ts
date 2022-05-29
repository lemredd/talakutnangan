import { Sequelize } from "sequelize-typescript";
import RequestEnvironment from "!/helpers/request_environment";
import CommonMiddlewareList from "!/middlewares/common_middleware_list";

export default function(dataSource: Sequelize) {
	RequestEnvironment.intialize(dataSource)
	CommonMiddlewareList.initialize()
}
