const puppeteer = require('puppeteer');
const xlsx = require('xlsx');
const fs = require('fs');

const seasons = [2021, 2022, 2023, 2024, 2025];
const categories = [
  "Orange Cap",
  "Most Fours (Innings)",
  "Most Sixes (Innings)",
  "Most Centuries",
  "Most Fifties"
];

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: puppeteer.executablePath(),
  });

  const page = await browser.newPage();
  const workbook = xlsx.utils.book_new();

  for (const year of seasons) {
    const url = `https://www.iplt20.com/stats/${year}`;
    console.log(`→ Loading ${year} stats (${url})`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });

    for (const cat of categories) {
      console.log(`  • Selecting "${cat}"`);
      await page.waitForSelector('.cSBListItems.batters');
      await page.evaluate(c => {
        const els = [...document.querySelectorAll('.cSBListItems.batters')];
        const btn = els.find(e => e.textContent.trim() === c);
        if (btn) btn.click();
      }, cat);

      await new Promise(r => setTimeout(r, 2000));
      await page.waitForSelector('.np-mostrunsTable tbody tr');

      const players = await page.evaluate(() => {
        const rows = [...document.querySelectorAll('.np-mostrunsTable tbody tr')];
        return rows.slice(0, 10).map(tr => {
          const td = [...tr.querySelectorAll('td')];
          return {
            POS: td[0]?.innerText.trim(),
            Player: td[1]?.innerText.trim(),
            Runs: td[2]?.innerText.trim(),
            Mat: td[3]?.innerText.trim(),
            Inns: td[4]?.innerText.trim(),
            NO: td[5]?.innerText.trim(),
            HS: td[6]?.innerText.trim(),
            Avg: td[7]?.innerText.trim(),
            BF: td[8]?.innerText.trim(),
            SR: td[9]?.innerText.trim(),
            '100': td[10]?.innerText.trim(),
            '50': td[11]?.innerText.trim(),
            '4s': td[12]?.innerText.trim(),
            '6s': td[13]?.innerText.trim()
          };
        });
      });

      const sheetName = `${year}_${cat.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20)}`;
      const ws = xlsx.utils.json_to_sheet(players);
      xlsx.utils.book_append_sheet(workbook, ws, sheetName);
      console.log(`    ✓ Scraped top 10 for "${cat}"`);
    }
  }

  const excelPath = 'IPL_Top10_Stats_2021-25.xlsx';
  xlsx.writeFile(workbook, excelPath);
  console.log('🎯 Saved Excel:', excelPath);

  const readWorkbook = xlsx.readFile(excelPath);
  const result = {};
  for (const sheetName of readWorkbook.SheetNames) {
    const sheet = readWorkbook.Sheets[sheetName];
    result[sheetName] = xlsx.utils.sheet_to_json(sheet);
  }

  fs.writeFileSync('ipl_stats.json', JSON.stringify(result, null, 2));
  console.log('📁 Saved JSON: ipl_stats.json');

  await browser.close();
})();
