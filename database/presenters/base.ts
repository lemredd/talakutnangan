import makePresenter from "yayson"

const { Presenter } = makePresenter({ adapter: "sequelize" })

export default class extends Presenter {}
