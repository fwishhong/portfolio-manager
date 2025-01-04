import React from 'react';
import { Card } from '@/components/ui/card';
import { AlertCircle, Download } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import dynamic from 'next/dynamic';

// 避免 SSR
const DynamicPieChart = dynamic(() => Promise.resolve(PieChart), { ssr: false });

// 颜色配置
const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#1d4ed8', '#3b82f6', '#60a5fa'];

// 类型定义
interface Stock {
  name: string;
  symbol: string;
  shares: number;
  price: number;
  total: number;
  lastUpdate: string | null;
}

interface StockData {
  hk: Stock[];
  us: Stock[];
}

// 工具函数
const formatCurrency = (value: number, currency = 'HKD') => {
  return new Intl.NumberFormat('zh-HK', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  }).format(value);
};

const formatDate = (date: string | null) => {
  if (!date) return '未更新';
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 初始数据
const INITIAL_STOCKS: StockData = {
  hk: [
    { name: '博雅互动', symbol: '0434.HK', shares: 470000, price: 4.88, total: 2293600, lastUpdate: null },
    { name: '中煤能源', symbol: '1898.HK', shares: 2600, price: 9, total: 23400, lastUpdate: null },
    { name: '中国神华', symbol: '1088.HK', shares: 180000, price: 32.5, total: 5850000, lastUpdate: null },
    { name: '飞鱼科技', symbol: '1022.HK', shares: 7834000, price: 0.203, total: 1590302, lastUpdate: null },
    { name: '国美零售', symbol: '0493.HK', shares: 3696000, price: 0.019, total: 70224, lastUpdate: null },
    { name: '联众', symbol: '0699.HK', shares: 19914000, price: 0.19, total: 3783660, lastUpdate: null },
    { name: '中国石油股份', symbol: '0857.HK', shares: 530000, price: 6.03, total: 3195900, lastUpdate: null },
    { name: '中国南航', symbol: '1055.HK', shares: 377250, price: 4.16, total: 1569360, lastUpdate: null }
  ],
  us: [
    { name: 'canaan', symbol: 'CAN', shares: 25000, price: 2.06, total: 51500, lastUpdate: null },
    { name: 'kxin', symbol: 'KXIN', shares: 19407, price: 1.57, total: 30468.99, lastUpdate: null }
  ]
};

export default function PortfolioDashboard() {
  // 状态管理
  const [stocks, setStocks] = React.useState<StockData>(() => {
    if (typeof window !== 'undefined') {
      const savedStocks = localStorage.getItem('portfolio-stocks');
      if (savedStocks) {
        return JSON.parse(savedStocks);
      }
    }
    return INITIAL_STOCKS;
  });

  const [editingStock, setEditingStock] = React.useState<{
    market: 'hk' | 'us' | null;
    index: number | null;
  }>({ market: null, index: null });

  const [error, setError] = React.useState<string | null>(null);

  // 本地存储
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio-stocks', JSON.stringify(stocks));
    }
  }, [stocks]);

  // 计算总值和图表数据
  const totalHKD = React.useMemo(() => 
    stocks.hk.reduce((sum, stock) => sum + stock.total, 0),
    [stocks.hk]
  );

  const totalUSD = React.useMemo(() => 
    stocks.us.reduce((sum, stock) => sum + stock.total, 0),
    [stocks.us]
  );

  const hkPieData = React.useMemo(() => 
    stocks.hk.map(stock => ({
      name: stock.name,
      value: stock.total
    })),
    [stocks.hk]
  );

  const usPieData = React.useMemo(() => 
    stocks.us.map(stock => ({
      name: stock.name,
      value: stock.total
    })),
    [stocks.us]
  );

  // 更新价格
  const handlePriceUpdate = (market: 'hk' | 'us', index: number, newPrice: string) => {
    try {
      const price = parseFloat(newPrice);
      if (isNaN(price) || price < 0) {
        throw new Error('请输入有效的价格');
      }
      
      setStocks(prev => ({
        ...prev,
        [market]: prev[market].map((stock, i) => 
          i === index ? {
            ...stock,
            price,
            total: price * stock.shares,
            lastUpdate: new Date().toISOString()
          } : stock
        )
      }));
      setEditingStock({ market: null, index: null });
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : '更新价格时发生错误');
    }
  };

  // 导出 Excel
  const handleExportToExcel = async () => {
    try {
      const XLSX = await import('xlsx');
      const wb = XLSX.utils.book_new();
      
      const hkData = stocks.hk.map(stock => ({
        '股票名称': stock.name,
        '代码': stock.symbol,
        '股数': stock.shares,
        '价格(HKD)': stock.price,
        '总额(HKD)': stock.total,
        '最后更新': formatDate(stock.lastUpdate)
      }));
      
      const usData = stocks.us.map(stock => ({
        '股票名称': stock.name,
        '代码': stock.symbol,
        '股数': stock.shares,
        '价格(USD)': stock.price,
        '总额(USD)': stock.total,
        '最后更新': formatDate(stock.lastUpdate)
      }));

      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(hkData), "港股持仓");
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(usData), "美股持仓");
      
      XLSX.writeFile(wb, `投资组合_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      setError('导出Excel时发生错误：' + (error instanceof Error ? error.message : '未知错误'));
    }
  };

  // 股票表格组件
  const renderStockTable = (market: 'hk' | 'us', currency: string) => (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">股票名称</th>
            <th className="text-left p-2">代码</th>
            <th className="text-right p-2">股数</th>
            <th className="text-right p-2">价格 ({currency})</th>
            <th className="text-right p-2">总额 ({currency})</th>
            <th className="text-right p-2">最后更新</th>
            <th className="text-center p-2">操作</th>
          </tr>
        </thead>
        <tbody>
          {stocks[market].map((stock, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="p-2">{stock.name}</td>
              <td className="p-2">{stock.symbol}</td>
              <td className="text-right p-2">{stock.shares.toLocaleString()}</td>
              <td className="text-right p-2">
                {editingStock.market === market && editingStock.index === index ? (
                  <input
                    type="number"
                    step={market === 'hk' ? "0.001" : "0.01"}
                    defaultValue={stock.price}
                    className="w-20 text-right border rounded p-1"
                    onBlur={(e) => handlePriceUpdate(market, index, (e.target as HTMLInputElement).value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handlePriceUpdate(market, index, e.target.value);
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <span 
                    className="cursor-pointer hover:text-blue-600"
                    onClick={() => setEditingStock({ market, index })}
                  >
                    {stock.price.toFixed(market === 'hk' ? 3 : 2)}
                  </span>
                )}
              </td>
              <td className="text-right p-2">{formatCurrency(stock.total, currency)}</td>
              <td className="text-right p-2">{formatDate(stock.lastUpdate)}</td>
              <td className="text-center p-2">
                <button
                  onClick={() => setEditingStock({ market, index })}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  更新价格
                </button>
              </td>
            </tr>
          ))}
          <tr className="border-t font-bold bg-gray-50">
            <td colSpan={4} className="text-right p-2">总计:</td>
            <td className="text-right p-2">
              {formatCurrency(market === 'hk' ? totalHKD : totalUSD, currency)}
            </td>
            <td colSpan={2}></td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      {error && (
        <div className="flex items-center text-red-500 bg-red-50 p-3 rounded">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleExportToExcel}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          <Download className="w-4 h-4 mr-2" />
          导出Excel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">港股总值</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <DynamicPieChart>
                  <Pie
                    data={hkPieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                  >
                    {hkPieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value, 'HKD')} />
                  <Legend />
                </DynamicPieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-2xl font-bold text-blue-600 mt-4">{formatCurrency(totalHKD, 'HKD')}</p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">美股总值</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <DynamicPieChart>
                  <Pie
                    data={usPieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                  >
                    {usPieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value, 'USD')} />
                  <Legend />
                </DynamicPieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-2xl font-bold text-green-600 mt-4">{formatCurrency(totalUSD, 'USD')}</p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">港股持仓明细</h3>
          {renderStockTable('hk', 'HKD')}
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">美股持仓明细</h3>
          {renderStockTable('us', 'USD')}
        </div>
      </Card>

      {/* PWA安装提示 */}
      <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <button className="text-sm text-gray-600 hover:text-blue-600">
            添加到主屏幕
          </button>
        </div>
      </div>
    </div>
  );
}