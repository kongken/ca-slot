import { useMemo, useState } from 'react';
import { ArrowUpRight, Check, ChevronDown, Database, ExternalLink, FileSpreadsheet, Info, Plane, Search, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { airlines, availableAirlines, dataSource, importedSummary, verifiedRows } from './data/seasonal-rules.js';
import { Badge, Button, Card, Select, Tabs } from './components/ui.jsx';
import './styles.css';

const text = (value) => String(value ?? '');

function App() {
  const [airline, setAirline] = useState('all');
  const [market, setMarket] = useState('all');
  const [query, setQuery] = useState('');
  const filteredRows = useMemo(() => verifiedRows.filter((row) => {
    const haystack = [row.airlineName, row.origin, row.destination, row.cabin, row.period, row.tripType, row.sheet].map(text).join(' ').toLowerCase();
    return (airline === 'all' || row.airlineCode === airline) && (market === 'all' || row.market === market) && (!query.trim() || haystack.includes(query.trim().toLowerCase()));
  }), [airline, market, query]);
  const selectedName = airline === 'all' ? '全部航司' : availableAirlines.find((item) => item.code === airline)?.name || '所选航司';

  return <div className="app-shell">
    <header className="topbar"><div className="container topbar-inner"><a className="brand" href="/" aria-label="凤凰知音冬季里程助手首页"><span className="brand-icon"><Plane size={18} strokeWidth={2.4} /></span><span><strong>里程助手</strong><small>PHOENIXMILES / 2026 WINTER</small></span></a><div className="topbar-actions"><Badge tone="green"><span className="dot" />官方来源导航</Badge><a className="text-link" href={dataSource.url} target="_blank" rel="noreferrer">查看数据源 <ExternalLink size={14} /></a></div></div></header>
    <main id="main-content" className="container">
      <section className="hero-grid"><div className="hero-copy"><Badge tone="blue">2026 冬季规则</Badge><h1>把淡旺季规则，<span>查清楚。</span></h1><p>按航司、航区、航线和舱位搜索凤凰知音里程折扣。数据已从用户提供的冬季统计表导入，并保留工作表和源行号。</p><div className="hero-stats" aria-label="数据概览"><div><strong>{importedSummary.airlines?.length || airlines.length}</strong><span>数据航司</span></div><div><strong>{importedSummary.validRows.toLocaleString()}</strong><span>有效记录</span></div><div><strong>{importedSummary.invalidRows}</strong><span>无效记录</span></div></div></div><Card className="source-card"><div className="source-card-icon"><FileSpreadsheet size={21} /></div><div className="source-card-heading"><div><p className="kicker">当前数据源</p><h2>国航系 2026 冬季</h2></div><Badge tone={dataSource.status === 'ready' ? 'green' : 'amber'}>{dataSource.statusLabel}</Badge></div><p className="source-card-text">{dataSource.description}</p><div className="source-meta"><span><Database size={14} /> {importedSummary.totalRows.toLocaleString()} 行原始数据</span><span><ShieldCheck size={14} /> 可追溯</span></div></Card></section>

      <section className="filter-card" aria-labelledby="filter-title"><div className="section-title-row"><div><p className="kicker">筛选器</p><h2 id="filter-title">找到适合你的规则</h2></div><SlidersHorizontal size={20} className="muted-icon" aria-hidden="true" /></div><div className="filter-grid"><label className="control"><span>航司</span><Select value={airline} onChange={(event) => setAirline(event.target.value)}><option value="all">全部航司</option>{availableAirlines.map((item) => <option key={item.code || item.name} value={item.code}>{item.name} · {item.code}</option>)}</Select></label><Tabs label="航区" value={market} onChange={setMarket} items={ [['all', '全部'], ['domestic', '国内'], ['international', '国际']] } /><label className="control search-control"><span>搜索航线、舱位或时间</span><span className="input-wrap"><Search size={16} aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="如：北京、经济舱、2027/2" /></span></label></div><div className="filter-result" role="status"><span>当前显示：{selectedName} · {market === 'all' ? '全部航区' : market === 'domestic' ? '国内' : '国际'}</span><strong>{filteredRows.length.toLocaleString()} 条记录</strong></div></section>

      <section className="results-section" aria-labelledby="results-title"><div className="section-title-row"><div><p className="kicker">查询结果</p><h2 id="results-title">里程折扣明细</h2></div><span className="result-caption">折扣为原始表格数值，点击来源可追溯</span></div>{filteredRows.length > 0 ? <ResultTable rows={filteredRows} /> : <EmptyState query={query} />}</section>
      <section className="airlines-section" aria-labelledby="airlines-title"><div className="section-title-row"><div><p className="kicker">官方入口</p><h2 id="airlines-title">四家合作航司</h2></div></div><div className="airline-grid">{airlines.map((item) => <AirlineCard key={item.code} airline={item} />)}</div></section>
      <aside className="notice" aria-label="数据说明"><Info size={18} /><div><strong>数据说明</strong><p>已导入国内和国际两个工作表。每条记录保留来源工作表与源行号；当前 {importedSummary.invalidRows} 条记录未通过必填字段或数值校验。</p></div></aside>
    </main><footer className="footer"><div className="container"><span>凤凰知音 · 冬季里程助手</span><span>规则变更时请以官方页面为准</span></div></footer>
  </div>;
}

function ResultTable({ rows }) {
  return <Card className="table-card"><div className="table-scroll"><table><caption className="sr-only">里程折扣查询结果</caption><thead><tr><th>航司</th><th>航线</th><th>行程 / 舱位</th><th>有效时间</th><th>折扣</th><th>来源</th></tr></thead><tbody>{rows.slice(0, 500).map((row) => <tr key={row.id}><td data-label="航司"><strong>{text(row.airlineName) || '未知航司'}</strong><small>{text(row.airlineCode) || '—'} · {text(row.market) === 'domestic' ? '国内' : '国际'}</small></td><td data-label="航线">{text(row.origin) || '—'} <span className="route-arrow">→</span> {text(row.destination) || '—'}</td><td data-label="行程 / 舱位">{text(row.tripType) || '—'}<small>{text(row.cabin) || '—'}</small></td><td data-label="有效时间">{text(row.period) || '—'}</td><td data-label="折扣" className="mileage">{Number.isFinite(row.discount) ? row.discount.toLocaleString() : '—'}<small>折扣</small></td><td data-label="来源"><span className="source-cell">{text(row.sheet)} · {text(row.sourceRow)}</span></td></tr>)}</tbody></table></div>{rows.length > 500 && <p className="table-footnote">结果较多，仅展示前 500 条，请继续缩小搜索范围。</p>}</Card>;
}
function EmptyState({ query }) { return <Card className="empty-state"><div className="empty-icon"><FileSpreadsheet size={23} /></div><h3>{query ? `没有找到“${query}”的记录` : '没有符合条件的记录'}</h3><p>{query ? '试试更短的城市名、航司代码或时间段。' : '调整航司或航区筛选条件后重试。'}</p><Button variant="secondary" onClick={() => window.location.reload()}>重置查询 <ChevronDown size={15} /></Button></Card>; }
function AirlineCard({ airline }) { return <Card className="airline-card"><div className="airline-logo">{airline.code}</div><div className="airline-info"><h3>{airline.name}</h3><p>{airline.note}</p></div><a className="icon-link" href={airline.url} target="_blank" rel="noreferrer" aria-label={`打开${airline.name}官方明细`}><ArrowUpRight size={17} /></a><div className="airline-status"><Check size={14} /> 官方入口</div></Card>; }
export default App;
