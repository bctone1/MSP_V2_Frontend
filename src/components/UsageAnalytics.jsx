// UsageAnalytics.jsx
import React, { useState } from 'react';
import { Calendar, Download, BarChart3, PieChart, LineChart, ArrowDown, ArrowUp } from 'lucide-react';

const UsageAnalytics = ({ usageData }) => {
  const [dateRange, setDateRange] = useState('1주일');
  const [selectedMetric, setSelectedMetric] = useState('calls');
  
  // 지표별 색상 및 레이블
  const metricConfig = {
    calls: { color: 'blue', label: 'API 호출 수' },
    tokens: { color: 'purple', label: '토큰 사용량' },
    cost: { color: 'green', label: '비용' }
  };
  
  // 사용자별 사용량 데이터 (샘플)
  const userUsageData = [
    { userId: 'user1', name: '김영희', calls: 420, tokens: 85000, cost: 5.32 },
    { userId: 'user2', name: '이철수', calls: 320, tokens: 65000, cost: 4.21 },
    { userId: 'user3', name: '박지민', calls: 210, tokens: 48000, cost: 2.89 }
  ];
  
  // 일별 사용량 데이터 (샘플)
  const dailyUsageData = [
    { date: '03-10', calls: 180, tokens: 35000, cost: 2.10 },
    { date: '03-11', calls: 210, tokens: 42000, cost: 2.52 },
    { date: '03-12', calls: 190, tokens: 38000, cost: 2.28 },
    { date: '03-13', calls: 220, tokens: 44000, cost: 2.64 },
    { date: '03-14', calls: 250, tokens: 50000, cost: 3.00 },
    { date: '03-15', calls: 230, tokens: 46000, cost: 2.76 }
  ];

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-medium">사용량 분석</h2>
            <p className="text-sm text-gray-500">API 호출, 토큰 사용량, 비용 등을 분석합니다</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button 
                onClick={() => setDateRange('오늘')}
                className={`px-3 py-1.5 text-sm ${dateRange === '오늘' ? 'bg-blue-500 text-white' : 'hover:bg-gray-50'}`}
              >
                오늘
              </button>
              <button 
                onClick={() => setDateRange('1주일')}
                className={`px-3 py-1.5 text-sm ${dateRange === '1주일' ? 'bg-blue-500 text-white' : 'hover:bg-gray-50'}`}
              >
                1주일
              </button>
              <button 
                onClick={() => setDateRange('1개월')}
                className={`px-3 py-1.5 text-sm ${dateRange === '1개월' ? 'bg-blue-500 text-white' : 'hover:bg-gray-50'}`}
              >
                1개월
              </button>
              <button 
                onClick={() => setDateRange('3개월')}
                className={`px-3 py-1.5 text-sm ${dateRange === '3개월' ? 'bg-blue-500 text-white' : 'hover:bg-gray-50'}`}
              >
                3개월
              </button>
            </div>
            
            <button className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50">
              <Calendar className="w-4 h-4" />
              <span>날짜 선택</span>
            </button>
            
            <button className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              <span>CSV 다운로드</span>
            </button>
          </div>
        </div>
        
        {/* 요약 카드 */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">API 호출 수</h3>
              <BarChart3 className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-bold">{usageData.summary.totalCalls.toLocaleString()}</p>
              <p className="text-xs text-green-500 flex items-center">
                <ArrowUp className="w-3 h-3 mr-0.5" />
                12%
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-1">전체 기간 대비</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">토큰 사용량</h3>
              <LineChart className="w-4 h-4 text-purple-500" />
            </div>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-bold">{usageData.summary.totalTokens.toLocaleString()}</p>
              <p className="text-xs text-red-500 flex items-center">
                <ArrowDown className="w-3 h-3 mr-0.5" />
                5%
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-1">전체 기간 대비</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">총 비용</h3>
              <PieChart className="w-4 h-4 text-green-500" />
            </div>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-bold">${usageData.summary.totalCost.toFixed(2)}</p>
              <p className="text-xs text-green-500 flex items-center">
                <ArrowUp className="w-3 h-3 mr-0.5" />
                3%
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-1">전체 기간 대비</p>
          </div>
        </div>
        
        {/* 그래프 영역 */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-medium">일별 사용량 추이</h3>
            
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button 
                onClick={() => setSelectedMetric('calls')}
                className={`px-3 py-1.5 text-sm ${selectedMetric === 'calls' ? 'bg-blue-500 text-white' : 'hover:bg-gray-50'}`}
              >
                API 호출
              </button>
              <button 
                onClick={() => setSelectedMetric('tokens')}
                className={`px-3 py-1.5 text-sm ${selectedMetric === 'tokens' ? 'bg-blue-500 text-white' : 'hover:bg-gray-50'}`}
              >
                토큰
              </button>
              <button 
                onClick={() => setSelectedMetric('cost')}
                className={`px-3 py-1.5 text-sm ${selectedMetric === 'cost' ? 'bg-blue-500 text-white' : 'hover:bg-gray-50'}`}
              >
                비용
              </button>
            </div>
          </div>
          
          {/* 여기에 실제 그래프가 들어갑니다. 실제 구현에서는 Chart.js 등을 사용하여 구현합니다. */}
          <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center border">
            <p className="text-gray-500">이 영역에 {metricConfig[selectedMetric].label} 그래프가 표시됩니다.</p>
          </div>
        </div>
        
        {/* 데이터 테이블 */}
        <div className="grid grid-cols-2 gap-6">
          {/* 프로바이더별 사용량 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="font-medium mb-4">프로바이더별 사용량</h3>
            
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left text-xs font-medium text-gray-500">프로바이더</th>
                  <th className="py-2 text-right text-xs font-medium text-gray-500">API 호출</th>
                  <th className="py-2 text-right text-xs font-medium text-gray-500">토큰</th>
                  <th className="py-2 text-right text-xs font-medium text-gray-500">비용</th>
                </tr>
              </thead>
              <tbody>
                {usageData.providerUsage.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 text-sm">{item.provider}</td>
                    <td className="py-2 text-sm text-right">{item.calls.toLocaleString()}</td>
                    <td className="py-2 text-sm text-right">{item.tokens.toLocaleString()}</td>
                    <td className="py-2 text-sm text-right">${item.cost.toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-medium">
                  <td className="py-2 text-sm">합계</td>
                  <td className="py-2 text-sm text-right">{usageData.summary.totalCalls.toLocaleString()}</td>
                  <td className="py-2 text-sm text-right">{usageData.summary.totalTokens.toLocaleString()}</td>
                  <td className="py-2 text-sm text-right">${usageData.summary.totalCost.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* 사용자별 사용량 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="font-medium mb-4">사용자별 사용량</h3>
            
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left text-xs font-medium text-gray-500">사용자</th>
                  <th className="py-2 text-right text-xs font-medium text-gray-500">API 호출</th>
                  <th className="py-2 text-right text-xs font-medium text-gray-500">토큰</th>
                  <th className="py-2 text-right text-xs font-medium text-gray-500">비용</th>
                </tr>
              </thead>
              <tbody>
                {userUsageData.map((user, index) => (
                  <tr key={user.userId} className="border-b">
                    <td className="py-2 text-sm">{user.name}</td>
                    <td className="py-2 text-sm text-right">{user.calls.toLocaleString()}</td>
                    <td className="py-2 text-sm text-right">{user.tokens.toLocaleString()}</td>
                    <td className="py-2 text-sm text-right">${user.cost.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="mt-4 text-right">
              <button className="text-sm text-blue-500 hover:text-blue-700">
                모든 사용자 보기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageAnalytics;