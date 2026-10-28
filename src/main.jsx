import { useMemo, useState } from 'react';
import { ArrowUpRight, Check, ChevronDown, Database, ExternalLink, FileSpreadsheet, Info, Plane, Search, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { airlines, dataSource, verifiedRows } from './data/seasonal-rules.js';
import { Badge, Button, Card, Select, Tabs } from './components/ui.jsx';
import './styles.css';

function App() {
  const [airline, setAirline] = useState('all');
  const [season, setSeason] = useState('all');
  const [query, setQuery] = useState('');

  const filteredRows = useMemo(() => verifiedRows.filter((row) => {
    const matchesAirline = airline === 'all' || row.airlineCode === airline;
    const matchesSeason = season === 'all' || row.season === season;
    const needle = query.trim().toLowerCase();
    const matchesQuery = !needle || [row.origin, row.destination, row.cabin, row.airlineName].some((value) => value.toLowerCase().includes(needle));
    return matchesAirline && matchesSeason && matchesQuery;
  }), [airline, season, query]);

  const selectedName = airline === 'all' ? '全部航司' : airlines.find((item) => item.code === airline)?.short;

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="container topbar-inner">
          <a className="brand" href="/" aria-label="凤凰知音冬季里程助手首页">
            <span className="brand-icon"><Plane size={18} strokeWidth={2.4} /></span>
            <span><strong>里程助手</strong><small>PHOENIXMILES / 2026 WINTER</small></span>
          </a>
          <div className="topbar-actions">
            <Badge tone="green"><span className="dot" />官方来源导航</Badge>
            <a className="text-link" href={dataSource.url} target="_blank" rel="noreferrer">查看来源 <ExternalLink size={14} /></a>
          </div>
        </div>
      </header>

      <main id="main-content" className="container">
        <section className="hero-grid">
          <div className="hero-copy">
            <Badge tone="blue">2026 冬季规则</Badge>
            <h1>把淡旺季规则，<span>查清楚。</span></h1>
            <p>按航司、季节和航线搜索凤凰知音里程折扣。页面预留冬季统计表的导入和核验流程，同时保留每家航司的官方明细入口。</p>
            <div className="hero-stats" aria-label="数据概览">
              <div><strong>{airlines.length}</strong><span>合作航司</span></div>
              <div><strong>{verifiedRows.length || '—'}</strong><span>已验证记录</span></div>
              <div><strong>2026</strong><span>冬季周期</span></div>
            </div>
          </div>
          <Card className="source-card">
            <div className="source-card-icon"><FileSpreadsheet size={21} /></div>
            <div className="source-card-heading"><div><p className="kicker">当前数据源</p><h2>国航系 2026 冬季</h2></div><Badge tone="amber">{dataSource.statusLabel}</Badge></div>
            <p className="source-card-text">{dataSource.description}</p>
            <div className="source-meta"><span><Database size={14} /> {dataSource.format}</span><span><ShieldCheck size={14} /> 可追溯</span></div>
          </Card>
        </section>

        <section className="filter-card" aria-labelledby="filter-title">
          <div className="section-title-row"><div><p className="kicker">筛选器</p><h2 id="filter-title">找到适合你的规则</h2></div><SlidersHorizontal size={20} className="muted-icon" aria-hidden="true" /></div>
          <div className="filter-grid">
            <label className="control"><span>航司</span><Select value={airline} onChange={(event) => setAirline(event.target.value)}><option value="all">全部航司</option>{airlines.map((item) => <option key={item.code} value={item.code}>{item.short} · {item.code}</option>)}</Select></label>
            <Tabs label="季节" value={season} onChange={setSeason} items={[['all', '全部'], ['light', '淡季'], ['peak', '旺季']]} />
            <label className="control search-control"><span>搜索航线或舱位</span><span className="input-wrap"><Search size={16} aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="如：北京、经济舱" /></span></label>
          </div>
          <div className="filter-result" role="status"><span>当前显示：{selectedName} · {season === 'all' ? '全部季节' : season === 'light' ? '淡季' : '旺季'}</span><strong>{filteredRows.length} 条记录</strong></div>
        </section>

        <section className="results-section" aria-labelledby="results-title">
          <div className="section-title-row"><div><p className="kicker">查询结果</p><h2 id="results-title">里程折扣明细</h2></div><span className="result-caption">点击官方入口核对最新规则</span></div>
          {filteredRows.length > 0 ? <ResultTable rows={filteredRows} /> : <EmptyState query={query} />}
        </section>

        <section className="airlines-section" aria-labelledby="airlines-title">
          <div className="section-title-row"><div><p className="kicker">官方入口</p><h2 id="airlines-title">四家合作航司</h2></div></div>
          <div className="airline-grid">{airlines.map((item) => <AirlineCard key={item.code} airline={item} />)}</div>
        </section>

        <aside className="notice" aria-label="数据说明"><Info size={18} /><div><strong>数据说明</strong><p>当前环境无法下载用户提供的 Excel（CDN 返回 HTTP 403），所以没有把未验证的里程数字写入页面。导入脚本已保留，拿到文件后可生成同样结构的可追溯数据。</p></div></aside>
      </main>
      <footer className="footer"><div className="container"><span>凤凰知音 · 冬季里程助手</span><span>规则变更时请以官方页面为准</span></div></footer>
    </div>
  );
}

function ResultTable({ rows }) {
  return <Card className="table-card"><div className="table-scroll"><table><caption className="sr-only">里程折扣查询结果</caption><thead><tr><th>航司</th><th>航线</th><th>舱位</th><th>季节</th><th>折扣里程</th><th>官方来源</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td><strong>{row.airlineName}</strong><small>{row.airlineCode}</small></td><td>{row.origin} <span className="route-arrow">→</span> {row.destination}</td><td>{row.cabin}</td><td><Badge tone={row.season === 'light' ? 'blue' : 'amber'}>{row.season === 'light' ? '淡季' : '旺季'}</Badge></td><td className="mileage">{row.mileage.toLocaleString()} <small>里程</small></td><td><a className="icon-link" href={row.sourceUrl} target="_blank" rel="noreferrer" aria-label={`打开${row.airlineName}官方来源`}><ArrowUpRight size={17} /></a></td></tr>)}</tbody></table></div></Card>;
}

function EmptyState({ query }) {
  return <Card className="empty-state"><div className="empty-icon"><FileSpreadsheet size={23} /></div><h3>{query ? `没有找到“${query}”的记录` : 'Excel 数据尚未导入'}</h3><p>{query ? '试试更短的城市名、航司代码，或清空搜索条件。' : '数据处理脚本已准备好。当前下载地址返回 403，待文件可访问后即可生成明细。'}</p><Button variant="secondary" onClick={() => window.location.reload()}>刷新数据状态 <ChevronDown size={15} /></Button></Card>;
}

function AirlineCard({ airline }) {
  return <Card className="airline-card"><div className="airline-logo">{airline.code}</div><div className="airline-info"><h3>{airline.name}</h3><p>{airline.note}</p></div><a className="icon-link" href={airline.url} target="_blank" rel="noreferrer" aria-label={`打开${airline.name}官方明细`}><ArrowUpRight size={17} /></a><div className="airline-status"><Check size={14} /> 官方入口</div></Card>;
}

export default App;
