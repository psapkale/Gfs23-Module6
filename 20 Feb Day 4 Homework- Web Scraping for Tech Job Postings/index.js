const axios = require("axios");
const cheerio = require("cheerio");
const xlsx = require("xlsx");
const fs = require("fs");

const url =
   "https://www.timesjobs.com/candidate/job-search.html?searchType=Home_Search&from=submit&asKey=OFF&txtKeywords=&cboPresFuncArea=35";

async function scrapeJobs() {
   try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
      const jobs = [];

      $(".job-bx").each((index, element) => {
         const jobTitle = $(element).find("h2 a").text().trim();
         const companyName = $(element).find(".comp-name").text().trim();
         const location = $(element).find(".loc").text().trim();
         const jobType = $(element).find(".job-type").text().trim() || "N/A"; // Sometimes missing
         const postedDate = $(element).find(".sim-posted").text().trim();
         const jobDescription = $(element)
            .find(".list-job-dtl li")
            .first()
            .text()
            .trim();

         jobs.push({
            jobTitle,
            companyName,
            location,
            jobType,
            postedDate,
            jobDescription,
         });
      });

      saveToExcel(jobs);
   } catch (error) {
      console.error("Error scraping data:", error.message);
   }
}

function saveToExcel(jobs) {
   const workBook = xlsx.utils.book_new();
   const workSheet = xlsx.utils.json_to_sheet(jobs);
   xlsx.utils.book_append_sheet(workBook, workSheet, "Jobs");

   const filePath = "Tech_Jobs.xlsx";
   xlsx.writeFile(workBook, filePath);
   console.log(`Data saved to ${filePath}`);
}

scrapeJobs();
