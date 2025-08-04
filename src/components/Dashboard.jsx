import React, { useState, useEffect } from 'react';
import { FolderOpen, Activity, MessageSquare, ChevronDown, FileText, Code, Bot, Cloud, Key } from 'lucide-react';

const Dashboard = ({
  projects,
  apiKeys,
  sessionLogs,
  recentActivities,
  selectProject,
  changeNavigation,
  providerData,
  sessionData,
  models
}) => {
  const [newapiKeys, setApiKeys] = useState([]);
  const [filterApiKey, setFilterApiKey] = useState([]);

  useEffect(() => {
    // console.log(sessionData);
    // console.log(apiKeys);
    setApiKeys(apiKeys);
    if (sessionData?.user) {
      setFilterApiKey(apiKeys.filter(apiKey => apiKey.user_id === sessionData.user.id));
    }
  }, [apiKeys, sessionData]);

  return (
    <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6"></h1>

        {/* 요약 정보 */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium">활성 프로젝트</h2>
              <FolderOpen size={20} className="text-blue-500" />
            </div>
            <div className="text-3xl font-bold">
              {projects.filter(p => p.status === 'active').length}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              총 {projects.length}개 중
            </div>
          </div> */}

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium">API 사용량</h2>
              <Activity size={20} className="text-blue-500" />
            </div>
            <div className="text-3xl font-bold">
              {filterApiKey.reduce((sum, api) => sum + api.usage_count, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              토큰 / {filterApiKey.reduce((sum, api) => sum + api.usage_limit, 0) || '제한없음'}
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium">저장된 대화</h2>
              <MessageSquare size={20} className="text-blue-500" />
            </div>
            <div className="text-3xl font-bold">
              {sessionLogs.length}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              최근 30일
            </div>
          </div>



        </div>

        {/* 최근 활동 및 프로젝트 */}
        <div className="grid grid-cols-3 gap-6">

          {/* 활성 프로바이더 */}
          <div className="bg-white rounded-lg shadow-sm border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium">사용가능 모델</h2>
              <Cloud size={18} className="text-gray-400" />
            </div>

            <div className="space-y-3">
              {providerData.map(provider => (
                <div key={provider.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${provider.name === "OpenAI"
                          ? "bg-black text-white"
                          : provider.name === "Google"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-600"
                          }`}
                      >
                        {provider.id && typeof provider.id === "string" ? provider.id.charAt(0).toUpperCase() : ""}
                      </div>
                      <div>
                        <p className="text-lg font-medium">{provider.name}</p>
                      </div>
                    </div>
                    <a className="text-blue-500 text-sm rounded-lg" target="_blank" href={provider.website}>방문</a>

                    <div
                      className={`px-2 py-0.5 rounded-full text-xs ${provider.status === "Active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                        }`}
                    >
                      {provider.status === "Active" ? "활성" : "비활성"}
                    </div>
                  </div>

                  {/* provider.name과 일치하는 model만 출력 */}
                  {models
                    .filter(model => model.provider_name === provider.name && provider.status === "Active")
                    .map(model => (
                      <div key={model.id}>
                        <p className="text-sm font-medium"><span className="pl-12">-</span>{model.model_name}</p>
                      </div>
                    ))}
                </div>
              ))}

            </div>
          </div>
          {/* 최근 활동 */}
          <div className="bg-white rounded-lg shadow-sm border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium">보유 키 현황</h2>
              <Key size={18} className="text-gray-400" />
            </div>


            <div className="space-y-4">
              {filterApiKey.map(apiKey => (
                <div key={apiKey.id} className="flex items-start">
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg w-full">
                    <p className="text-sm text-gray-500">{apiKey.provider_name}</p>
                    <code className="flex-1 font-mono text-sm truncate">{apiKey.api_key}</code>
                    <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100">
                      복사
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {recentActivities.length === 0 && (
              <div className="text-center text-gray-500 py-6">
                최근 활동이 없습니다
              </div>
            )}
          </div>

          {/* 프로젝트 현황 */}
          <div className="bg-white rounded-lg shadow-sm border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium">프로젝트 현황</h2>
              <button
                onClick={() => changeNavigation('projects')}
                className="text-sm text-blue-500 flex items-center gap-1"
              >
                모두 보기 <ChevronDown size={16} className="transform rotate-270" />
              </button>
            </div>

            <div className="space-y-4">
              {projects.slice(0, 3).map(project => (
                <div key={project.project_id}
                  className="border rounded-lg p-4 hover:border-blue-300 cursor-pointer"
                  onClick={() => selectProject(project.project_id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{project.project_name}</h3>
                    {/* <span className={`px-2 py-0.5 rounded text-xs ${
                      project.status === 'active' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {project.status === 'active' ? '진행중' : '완료'}
                    </span> */}
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{project.description}</p>

                  {/* <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div> */}

                  <div className="flex items-center mt-3 text-xs text-gray-500 space-x-3 p-2 border rounded-lg shadow-sm bg-white">
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

                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;