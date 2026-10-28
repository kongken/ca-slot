import importedData from './imported-seasonal-rules.json';

export const airlines = [
  { code: 'CA', name: '中国国际航空', short: '国航', note: '中国大陆航线', url: 'https://ffp.airchina.com.cn/app/transport/costTable?serviceCode=light_season_cn&airlineCode=CA' },
  { code: 'ZH', name: '深圳航空', short: '深航', note: '中国大陆航线', url: 'https://ffp.airchina.com.cn/app/transport/costTable?serviceCode=light_season_cn&airlineCode=ZH' },
  { code: 'SC', name: '山东航空', short: '山航', note: '中国大陆航线', url: 'https://ffp.airchina.com.cn/app/transport/costTable?serviceCode=light_season_cn&airlineCode=SC' },
  { code: 'KY', name: '昆明航空', short: '昆航', note: '中国大陆航线', url: 'https://ffp.airchina.com.cn/app/transport/costTable?serviceCode=light_season_cn&airlineCode=KY' },
];

export const dataSource = {
  filename: '国航系2026冬季淡旺季里程折扣统计.xlsx',
  format: 'Excel / XLSX',
  statusLabel: '待导入',
  status: 'blocked',
  description: '用户提供的 2026 冬季淡旺季统计表。页面保留来源和导入管线，避免把未验证数字当作规则发布。',
  url: 'https://cdn.grpc.stream/download/%E5%9B%BD%E8%88%AA%E7%B3%BB2026%E5%86%AC%E5%AD%A3%E6%B7%A1%E6%97%BA%E5%AD%A3%E9%87%8C%E7%A8%8B%E6%8A%98%E6%89%A3%E7%BB%9F%E8%AE%A1.xlsx',
};

export const verifiedRows = importedData.rows || [];
