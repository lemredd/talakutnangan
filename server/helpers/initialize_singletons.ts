import { DataSource } from "typeorm";
import RequestEnvironment from "!/helpers/request_environment";
import CommonMiddlewareList from "!/middlewares/common_middleware_list";

export default function(dataSource: DataSource) {
	RequestEnvironment.intialize(dataSource)
	CommonMiddlewareList.initialize()
}
