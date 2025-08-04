// AdminDashboard.jsx
import React from 'react';
import {
  Users,
  Cloud,
  Code,
  BarChart,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Bot
} from 'lucide-react';

const AdminDashboard = ({ usageData, providerData, userData, projects }) => {
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* 요약 카드 */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium text-gray-500">총 API 호출</h2>
              <Zap size={18} className="text-yellow-500" />
            </div>
            <p className="text-2xl font-bold">{usageData.summary.totalCalls.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">지난 달 대비 12% 증가</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium text-gray-500">총 토큰 사용량</h2>
              <Code size={18} className="text-purple-500" />
            </div>
            <p className="text-2xl font-bold">{usageData.summary.totalTokens.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">예상치의 75%</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium text-gray-500">총 비용</h2>
              <BarChart size={18} className="text-blue-500" />
            </div>
            <p className="text-2xl font-bold">${usageData.summary.totalCost.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">월 예산 $100의 28.8%</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium text-gray-500">활성 사용자</h2>
              <Users size={18} className="text-green-500" />
            </div>
            {/* <p className="text-2xl font-bold">{userData.filter(u => u.status === 'active').length}</p> */}
            <p className="text-2xl font-bold">7</p>
            <p className="text-xs text-gray-500 mt-1">총 {userData.length}명 중</p>
          </div>


        </div>

        {/* 상태 개요 및 최근 활동 */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* 시스템 상태 */}
          {/* <div className="bg-white rounded-lg shadow-sm border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium">시스템 상태</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  <span className="text-sm">서버 상태</span>
                </div>
                <span className="text-sm text-green-500">정상</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  <span className="text-sm">데이터베이스</span>
                </div>
                <span className="text-sm text-green-500">정상</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} className="text-yellow-500" />
                  <span className="text-sm">API 제한</span>
                </div>
                <span className="text-sm text-yellow-500">75%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle size={16} className="text-red-500" />
                  <span className="text-sm">Deep Seek API</span>
                </div>
                <span className="text-sm text-red-500">중단됨</span>
              </div>
            </div>
          </div> */}

          {/* 활성 프로바이더 */}
          <div className="bg-white rounded-lg shadow-sm border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium">활성 프로바이더</h2>
              <Cloud size={18} className="text-gray-400" />
            </div>

            <div className="space-y-3">
              {providerData.map(provider => (
                <div key={provider.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">

                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${provider.name === 'OpenAI' ? 'bg-black text-white' :
                      provider.name === 'Google' ? 'bg-blue-100 text-blue-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                      {/* {provider.id.charAt(0).toUpperCase()} */}
                      {provider.id && typeof provider.id === "string" ? provider.id.charAt(0).toUpperCase() : ""}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{provider.name}</p>
                      {/* <p className="text-xs text-gray-500">{provider.models.length} 모델</p> */}
                    </div>
                  </div>
                  <div className={`px-2 py-0.5 rounded-full text-xs ${provider.status === 'Active'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600'
                    }`}>
                    {provider.status === 'Active' ? '활성' : '비활성'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 최근 활동 */}
          <div className="bg-white rounded-lg shadow-sm border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium">최근 프로젝트</h2>
              <Clock size={18} className="text-gray-400" />
            </div>

            <div className="space-y-4">
              {projects.slice(0, 3).map(project => (
                <div key={project.project_id}
                  className="border rounded-lg p-2 hover:border-blue-300 cursor-pointer"
                // onClick={() => selectProject(project.project_id)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm">{project.project_name}</h3>
                  </div>

                  <div className="flex items-center mt-1 text-xs text-gray-500 space-x-3 p-2 border rounded-lg shadow-sm bg-white">
                    <div className="flex items-center space-x-1">
                      <span className="font-semibold text-gray-600">모델 :</span>
                      <Bot size={14} className="mr-2 text-blue-500" />
                      <span className="font-medium">{project.ai_model}</span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <span className="font-semibold text-gray-600">카테고리 :</span>
                      <span className="text-gray-700">{project.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center mt-3 text-xs text-gray-500 space-x-3 p-2 border rounded-lg shadow-sm bg-white">
                    {project.user_email}
                  </div>

                </div>
              ))}
            </div>


          </div>
        </div>

        {/* 프로바이더별 사용량 */}
        <div className="bg-white rounded-lg shadow-sm border p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium">프로바이더별 사용량</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left text-sm font-medium text-gray-500">프로바이더</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">API 호출</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">토큰</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">비용</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">비율</th>
                </tr>
              </thead>
              <tbody>
                {usageData.providerUsage.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 text-sm">{item.provider}</td>
                    <td className="py-3 text-sm">{item.calls.toLocaleString()}</td>
                    <td className="py-3 text-sm">{item.tokens.toLocaleString()}</td>
                    <td className="py-3 text-sm">${item.cost.toFixed(2)}</td>
                    <td className="py-3 text-sm">
                      {Math.round((item.cost / usageData.summary.totalCost) * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;