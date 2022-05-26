import { EntityManager } from "typeorm";
import RequestEnvironment from "!/helpers/request_environment";
import CommonMiddlewareList from "!/middlewares/common_middleware_list";

export default function(manager: EntityManager) {
	RequestEnvironment.intialize(manager)
	CommonMiddlewareList.initialize()
}
