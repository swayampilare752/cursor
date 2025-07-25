const puppeteer = require('puppeteer');
const xlsx = require('xlsx');

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const workbook = xlsx.utils.book_new();
  const years = [2021, 2022, 2023, 2024, 2025];

  for (const year of years) {
    const url = `https://www.iplt20.com/stats/${year}`;
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: "networkidle2", timeout: 0 });

    console.log(`Waiting for table to load for ${year}...`);
    await page.waitForSelector(".np-mostrunsTable");

    const top10 = await page.evaluate(() => {
      const rows = document.querySelectorAll(".np-mostrunsTable tbody tr");
      const data = [];

      for (let i = 0; i < Math.min(11, rows.length); i++) {
        const cells = rows[i].querySelectorAll("td");
        if (cells.length >= 14) {
          data.push({
            POS: cells[0].innerText.trim(),
            Player: cells[1].innerText.trim(),
            Runs: cells[2].innerText.trim(),
            Mat: cells[3].innerText.trim(),
            Inns: cells[4].innerText.trim(),
            NO: cells[5].innerText.trim(),
            HS: cells[6].innerText.trim(),
            Avg: cells[7].innerText.trim(),
            BF: cells[8].innerText.trim(),
            SR: cells[9].innerText.trim(),
            "100": cells[10].innerText.trim(),
            "50": cells[11].innerText.trim(),
            "4s": cells[12].innerText.trim(),
            "6s": cells[13].innerText.trim()
          });
        }
      }

      return data;
    });

    console.log(`✅ Scraped top ${top10.length} players for ${year}`);
    const worksheet = xlsx.utils.json_to_sheet(top10);
    xlsx.utils.book_append_sheet(workbook, worksheet, `${year}`);
  }

  xlsx.writeFile(workbook, "orange_cap_top10_by_year.xlsx");
  console.log("🎉 Excel file created with 5 sheets (2021–2025)");

  await browser.close();
})();
