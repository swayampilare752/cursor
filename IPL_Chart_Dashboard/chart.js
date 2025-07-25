
let jsonData;
let chartInstance;

async function loadJSON() {
  const res = await fetch('ipl_stats.json');
  jsonData = await res.json();
  populateSeasonDropdown();
}

function populateSeasonDropdown() {
  const seasonDropdown = document.getElementById('season-select');
  seasonDropdown.innerHTML = '';
  const seasons = Object.keys(jsonData).sort((a, b) => b - a); // Descending order
  seasons.forEach(season => {
    const opt = document.createElement('option');
    opt.value = season;
    opt.textContent = season;
    seasonDropdown.appendChild(opt);
  });
  seasonDropdown.addEventListener('change', drawCategoryChart);
  document.getElementById('category-select').addEventListener('change', drawCategoryChart);
  document.getElementById('chart-type-select').addEventListener('change', drawCategoryChart);
  // Draw initial chart for latest season and default category
  seasonDropdown.value = seasons[0];
  drawCategoryChart();
}

function drawCategoryChart() {
  const season = document.getElementById('season-select').value;
  const category = document.getElementById('category-select').value;
  const chartType = document.getElementById('chart-type-select').value || 'bar';
  switch (category) {
    case 'OrangeCap':
      drawOrangeCapChart(season, chartType);
      break;
    case 'MostFoursInnings':
      drawMostFoursInningsChart(season, chartType);
      break;
    case 'MostSixesInnings':
      drawMostSixesInningsChart(season, chartType);
      break;
    case 'MostFifties':
      drawMostFiftiesChart(season, chartType);
      break;
    case 'MostCenturies':
      drawMostCenturiesChart(season, chartType);
      break;
    default:
      drawOrangeCapChart(season, chartType);
  }
}

function drawOrangeCapChart(season, chartType) {
  const orangeCapData = jsonData[season]?.OrangeCap;
  if (!orangeCapData) return;
  const topPlayers = orangeCapData.slice(0, 5);
  const labels = topPlayers.map(player => player.Player.replace(/\n.*/, ''));
  const teams = topPlayers.map(player => {
    const match = player.Player.match(/\n(.*)/);
    return match ? match[1] : '';
  });
  const runs = topPlayers.map(player => parseInt(player.Runs) || 0);
  renderFlexibleChart(labels, runs, teams, `Runs Scored (Orange Cap) - ${season}`, `Top 5 Orange Cap Players (${season})`, chartType);
  document.getElementById('chart-explanation').innerHTML =
    `<strong>Top 5 Orange Cap Players in ${season}:</strong><br>` +
    topPlayers.map((p, i) =>
      `${i + 1}. <b>${labels[i]}</b> (${teams[i]}) - <b>${runs[i]}</b> runs`
    ).join('<br>') +
    `<br><br>The Orange Cap is awarded to the highest run-scorer in an IPL season.`;
}

function drawMostFoursInningsChart(season, chartType) {
  const data = jsonData[season]?.OrangeCap;
  if (!data) return;
  const sorted = [...data].sort((a, b) => parseInt(b['4s']) - parseInt(a['4s']));
  const topPlayers = sorted.slice(0, 5);
  const labels = topPlayers.map(player => player.Player.replace(/\n.*/, ''));
  const teams = topPlayers.map(player => {
    const match = player.Player.match(/\n(.*)/);
    return match ? match[1] : '';
  });
  const fours = topPlayers.map(player => parseInt(player['4s']) || 0);
  renderFlexibleChart(labels, fours, teams, `Most Fours (Innings) - ${season}`, `Top 5 Most Fours (Innings) (${season})`, chartType);
  document.getElementById('chart-explanation').innerHTML =
    `<strong>Top 5 Most Fours (Innings) in ${season}:</strong><br>` +
    topPlayers.map((p, i) =>
      `${i + 1}. <b>${labels[i]}</b> (${teams[i]}) - <b>${fours[i]}</b> fours`
    ).join('<br>') +
    `<br><br>These players hit the most boundaries (fours) in an innings during the season.`;
}

function drawMostSixesInningsChart(season, chartType) {
  const data = jsonData[season]?.OrangeCap;
  if (!data) return;
  const sorted = [...data].sort((a, b) => parseInt(b['6s']) - parseInt(a['6s']));
  const topPlayers = sorted.slice(0, 5);
  const labels = topPlayers.map(player => player.Player.replace(/\n.*/, ''));
  const teams = topPlayers.map(player => {
    const match = player.Player.match(/\n(.*)/);
    return match ? match[1] : '';
  });
  const sixes = topPlayers.map(player => parseInt(player['6s']) || 0);
  renderFlexibleChart(labels, sixes, teams, `Most Sixes (Innings) - ${season}`, `Top 5 Most Sixes (Innings) (${season})`, chartType);
  document.getElementById('chart-explanation').innerHTML =
    `<strong>Top 5 Most Sixes (Innings) in ${season}:</strong><br>` +
    topPlayers.map((p, i) =>
      `${i + 1}. <b>${labels[i]}</b> (${teams[i]}) - <b>${sixes[i]}</b> sixes`
    ).join('<br>') +
    `<br><br>These players hit the most sixes in an innings during the season.`;
}

function drawMostFiftiesChart(season, chartType) {
  const data = jsonData[season]?.OrangeCap;
  if (!data) return;
  const sorted = [...data].sort((a, b) => parseInt(b['50']) - parseInt(a['50']));
  const topPlayers = sorted.slice(0, 5);
  const labels = topPlayers.map(player => player.Player.replace(/\n.*/, ''));
  const teams = topPlayers.map(player => {
    const match = player.Player.match(/\n(.*)/);
    return match ? match[1] : '';
  });
  const fifties = topPlayers.map(player => parseInt(player['50']) || 0);
  renderFlexibleChart(labels, fifties, teams, `Most Fifties - ${season}`, `Top 5 Most Fifties (${season})`, chartType);
  document.getElementById('chart-explanation').innerHTML =
    `<strong>Top 5 Most Fifties in ${season}:</strong><br>` +
    topPlayers.map((p, i) =>
      `${i + 1}. <b>${labels[i]}</b> (${teams[i]}) - <b>${fifties[i]}</b> fifties`
    ).join('<br>') +
    `<br><br>These players scored the most half-centuries (50s) in the season.`;
}

function drawMostCenturiesChart(season, chartType) {
  const data = jsonData[season]?.OrangeCap;
  if (!data) return;
  const sorted = [...data].sort((a, b) => parseInt(b['100']) - parseInt(a['100']));
  const topPlayers = sorted.slice(0, 5);
  const labels = topPlayers.map(player => player.Player.replace(/\n.*/, ''));
  const teams = topPlayers.map(player => {
    const match = player.Player.match(/\n(.*)/);
    return match ? match[1] : '';
  });
  const centuries = topPlayers.map(player => parseInt(player['100']) || 0);
  renderFlexibleChart(labels, centuries, teams, `Most Centuries - ${season}`, `Top 5 Most Centuries (${season})`, chartType);
  document.getElementById('chart-explanation').innerHTML =
    `<strong>Top 5 Most Centuries in ${season}:</strong><br>` +
    topPlayers.map((p, i) =>
      `${i + 1}. <b>${labels[i]}</b> (${teams[i]}) - <b>${centuries[i]}</b> centuries`
    ).join('<br>') +
    `<br><br>These players scored the most centuries (100s) in the season.`;
}

function renderFlexibleChart(labels, data, teams, datasetLabel, chartTitle, chartType) {
  const ctx = document.getElementById('ipl-chart').getContext('2d');
  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(ctx, {
    type: chartType,
    data: {
      labels,
      datasets: [{
        label: datasetLabel,
        data: data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 2,
        fill: chartType === 'line' || chartType === 'radar',
        tension: chartType === 'line' ? 0.4 : 0
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: chartType !== 'bar' },
        title: {
          display: true,
          text: chartTitle
        },
        tooltip: {
          callbacks: {
            afterLabel: function(context) {
              return `Team: ${teams[context.dataIndex]}`;
            }
          }
        }
      },
      scales: (chartType === 'bar' || chartType === 'line') ? {
        y: { beginAtZero: true, title: { display: true, text: 'Count' } }
      } : {}
    }
  });
}

loadJSON();
