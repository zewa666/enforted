import puppeteer from "puppeteer-extra";
import storePlugin from "puppeteer-extra-plugin-aurelia-store";

puppeteer.use(storePlugin());

const SEL_PLAYERNAME = `[data-aid='input-player-name']`;
const SEL_STARTBTN = `[data-aid="btn-start-game"]`;
const SEL_ROUND = `[data-aid="current-round"]`;

describe("a round", () => {
  it("is finished when the player passes the start tile", async () => {
    const browser = await puppeteer.launch({
      headless: false
    });

    const page = await browser.newPage();
    await (page as any).connectToStore();

    await page.goto("http://localhost:9000");
    await page.waitForSelector(SEL_PLAYERNAME);

    await page.type(SEL_PLAYERNAME, "zewa");
    await page.click(SEL_STARTBTN);

    await page.waitForSelector(SEL_ROUND);

    while (await page.$eval(SEL_ROUND, (el) => el.textContent) !== "Round 2") {
      await (page as any).dispatch("rollDice", 7);
    }

    expect(await page.$eval(SEL_ROUND, (el) => el.textContent)).toBe("Round 2");
    await browser.close();
  });
});
