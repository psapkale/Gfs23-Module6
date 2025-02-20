const axios = require("axios");
const cheerio = require("cheerio");
const xlsx = require("xlsx");

const URL = "http://books.toscrape.com/";

async function scrapeBooks() {
   try {
      const { data } = await axios.get(URL);
      const $ = cheerio.load(data);

      let books = [];

      $(".product_pod").each((index, element) => {
         let name = $(element).find("h3 a").attr("title") || "N/A";
         let price = $(element).find(".price_color").text().trim() || "N/A";
         let availability = $(element)
            .find(".instock.availability")
            .text()
            .trim()
            .includes("In stock")
            ? "In Stock"
            : "Out of Stock";
         let rating =
            $(element).find(".star-rating").attr("class").split(" ")[1] ||
            "N/A";

         books.push({
            Name: name,
            Price: price,
            Availability: availability,
            Rating: rating,
         });
      });

      // Save data to Excel file
      const workbook = xlsx.utils.book_new();
      const worksheet = xlsx.utils.json_to_sheet(books);
      xlsx.utils.book_append_sheet(workbook, worksheet, "Books");
      xlsx.writeFile(workbook, "books.xlsx");

      console.log("Scraping completed. Data saved in books.xlsx");
   } catch (error) {
      console.error("Error scraping website:", error);
   }
}

// Run the scraper
scrapeBooks();
