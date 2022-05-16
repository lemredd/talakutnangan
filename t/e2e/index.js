import { Selector } from "testcafe";
import { resolve } from "path";

fixture("Sample test").page(`file://${resolve(__dirname, "../..", "public/index.html")}`);

test("First 3 clicks", async t => {
	const clickedItemButtonID = "#clicked_times";
	await t
		.click(clickedItemButtonID)
		.click(clickedItemButtonID)
		.click(clickedItemButtonID);

	const clickedItemButton = Selector(clickedItemButtonID);
	const buttonLabel = await clickedItemButton.innerText;

	const expectedCount = 3;
	await t.expect(buttonLabel).contains(expectedCount);
});
