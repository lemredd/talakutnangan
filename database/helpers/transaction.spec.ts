import TransactionManager from "./transaction_manager"

describe("Database: TransactionManager Builder", () => {
	it("can make empty object if not yet initialized", async () => {
		const manager = new TransactionManager()

		const transactionObject = manager.transactionObject
		await manager.destroySuccessfully()

		expect(transactionObject).not.toHaveProperty("transaction")
	})

	it("can make object if initialized", async () => {
		const manager = new TransactionManager()

		await manager.initialize()
		const transactionObject = manager.transactionObject
		await manager.destroySuccessfully()

		expect(transactionObject).toHaveProperty("transaction")
	})

	it("can make empty object if destroyed", async () => {
		const manager = new TransactionManager()

		await manager.initialize()
		const initialTransactionObject = manager.transactionObject
		await manager.destroySuccessfully()
		const finalTransactionObject = manager.transactionObject

		expect(initialTransactionObject).toHaveProperty("transaction")
		expect(finalTransactionObject).not.toHaveProperty("transaction")
	})

})
