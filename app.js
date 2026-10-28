const airlines = [
  { code: 'CA', name: '中国国际航空', short: '国航', note: '国航 · 中国大陆航线', url: 'https://ffp.airchina.com.cn/app/transport/costTable?serviceCode=light_season_cn&airlineCode=CA' },
  { code: 'ZH', name: '深圳航空', short: '深航', note: '深航 · 中国大陆航线', url: 'https://ffp.airchina.com.cn/app/transport/costTable?serviceCode=light_season_cn&airlineCode=ZH' },
  { code: 'SC', name: '山东航空', short: '山航', note: '山航 · 中国大陆航线', url: 'https://ffp.airchina.com.cn/app/transport/costTable?serviceCode=light_season_cn&airlineCode=SC' },
  { code: 'KY', name: '昆明航空', short: '昆航', note: '昆航 · 中国大陆航线', url: 'https://ffp.airchina.com.cn/app/transport/costTable?serviceCode=light_season_cn&airlineCode=KY' }
];

const form = document.querySelector('#query-form');
const airlineInput = document.querySelector('#airline');
const hint = document.querySelector('#query-hint');
const list = document.querySelector('#airline-list');
const count = document.querySelector('#result-count');

function currentSeason() {
  return document.querySelector('input[name="season"]:checked').value;
}

function seasonLabel(season) {
  return season === 'light' ? '淡季' : '旺季';
}

function renderCards(selectedCode, season) {
  list.innerHTML = airlines.map((airline) => `
    <article class="airline-card ${airline.code === selectedCode ? 'is-selected' : ''}">
      <div class="airline-code" aria-hidden="true">${airline.code}</div>
      <div>
        <h3>${airline.name}</h3>
        <p>${airline.note} · 官方运输奖励兑换标准</p>
      </div>
      <div class="card-actions">
        <span class="season-chip">${season === 'light' ? '淡季入口' : '官网核对'}</span>
        <a class="card-link" href="${airline.url}" target="_blank" rel="noopener noreferrer" aria-label="打开${airline.name}官方规则入口">打开 <span aria-hidden="true">↗</span></a>
      </div>
    </article>
  `).join('');
  count.textContent = `${airlines.length} 个结果`;
}

function updateQuery() {
  const airline = airlines.find((item) => item.code === airlineInput.value);
  const season = currentSeason();
  hint.textContent = `当前查询：${airline.short} · ${seasonLabel(season)}。打开官方明细页后，请以页面展示的最新规则为准。`;
  renderCards(airline.code, season);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const airline = airlines.find((item) => item.code === airlineInput.value);
  const season = currentSeason();
  updateQuery();
  if (season === 'peak') {
    hint.textContent = `已选择：${airline.short} · 旺季。当前仓库仅验证了官方淡季入口，请在官网中继续选择旺季规则。`;
  } else {
    window.open(airline.url, '_blank', 'noopener,noreferrer');
  }
});

airlineInput.addEventListener('change', updateQuery);
document.querySelectorAll('input[name="season"]').forEach((input) => input.addEventListener('change', updateQuery));
updateQuery();
