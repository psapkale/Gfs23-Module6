import puppeteer from "puppeteer";

const BASE_URL = "https://www.iplt20.com/stats/";

export default async function scrapeIPLData() {
   const browser = await puppeteer.launch({ headless: true });
   const page = await browser.newPage();

   await page.goto(BASE_URL, { waitUntil: "networkidle2" });

   const categories = [
      {
         name: "orange_cap",
         selector: ".top-players__player-name",
         statSelector: ".top-players__player-stats",
      },
      {
         name: "most_fours",
         selector: ".top-players__player-name",
         statSelector: ".top-players__player-stats",
      },
      {
         name: "most_sixes",
         selector: ".top-players__player-name",
         statSelector: ".top-players__player-stats",
      },
      {
         name: "most_centuries",
         selector: ".top-players__player-name",
         statSelector: ".top-players__player-stats",
      },
      {
         name: "most_fifties",
         selector: ".top-players__player-name",
         statSelector: ".top-players__player-stats",
      },
   ];

   let data = [];

   for (let season = 2023; season >= 2019; season--) {
      let seasonData = { season };

      for (const category of categories) {
         await page.goto(`${BASE_URL}${season}/${category.name}`, {
            waitUntil: "networkidle2",
         });

         seasonData[category.name] = await page.evaluate((category) => {
            const players = [];
            document
               .querySelectorAll(category.selector)
               .forEach((el, index) => {
                  if (index < 10) {
                     players.push({
                        player: el.innerText,
                        stat:
                           document.querySelectorAll(category.statSelector)[
                              index
                           ]?.innerText || "0",
                     });
                  }
               });
            return players;
         }, category);
      }

      data.push(seasonData);
   }

   await browser.close();
   return data;
}
