// SystemSettings.jsx
import React, { useState } from 'react';
import { Save, RefreshCw, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const SystemSettings = ({ settings: initialSettings, maintenance: initialMaintenance }) => {
  const [settings, setSettings] = useState(initialSettings);
  const [maintenance, setMaintenance] = useState(initialMaintenance);
  const [hasChanges, setHasChanges] = useState(false);
  const [isRestartConfirmOpen, setIsRestartConfirmOpen] = useState(false);
  
  // 설정 변경 처리
  const handleSettingChange = (key, value) => {
    setSettings({
      ...settings,
      [key]: value
    });
    setHasChanges(true);
  };
  
  // 설정 저장
  const saveSettings = () => {
    // API 호출로 설정 저장 (여기서는 시뮬레이션)
    alert('설정이 저장되었습니다.');
    setHasChanges(false);
  };
  
  // 시스템 재시작
  const restartSystem = () => {
    // 실제로는 API 호출로 재시작
    alert('시스템 재시작 요청이 전송되었습니다.');
    setIsRestartConfirmOpen(false);
  };
  
  // 유지보수 모드 전환
  const toggleMaintenanceMode = () => {
    const newStatus = maintenance.status === 'operational' ? 'maintenance' : 'operational';
    setMaintenance({
      ...maintenance,
      status: newStatus
    });
    alert(`시스템이 ${newStatus === 'operational' ? '운영' : '유지보수'} 모드로 전환되었습니다.`);
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-lg font-medium">시스템 설정</h2>
          <p className="text-sm text-gray-500">META LLM MSP 시스템의 전역 설정을 관리합니다</p>
        </div>
        
        {/* 시스템 상태 */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">시스템 상태</h3>
            <div className={`flex items-center px-3 py-1 rounded-full text-sm ${
              maintenance.status === 'operational' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-amber-100 text-amber-800'
            }`}>
              {maintenance.status === 'operational' 
                ? <CheckCircle className="w-4 h-4 mr-1" /> 
                : <AlertTriangle className="w-4 h-4 mr-1" />
              }
              <span>
                {maintenance.status === 'operational' ? '정상 운영중' : '유지보수 모드'}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-2">버전</p>
              <p className="font-medium">{maintenance.version}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">마지막 업데이트</p>
              <p className="font-medium">{maintenance.lastUpdated}</p>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <button 
              onClick={() => setIsRestartConfirmOpen(true)}
              className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50 flex items-center gap-1"
            >
              <RefreshCw className="w-4 h-4" />
              <span>시스템 재시작</span>
            </button>
            <button 
              onClick={toggleMaintenanceMode}
              className={`px-3 py-1.5 text-sm rounded flex items-center gap-1 ${
                maintenance.status === 'operational'
                  ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                  : 'bg-green-50 text-green-700 hover:bg-green-100'
              }`}
            >
              {maintenance.status === 'operational' 
                ? '유지보수 모드 전환' 
                : '운영 모드 전환'}
            </button>
          </div>
          
          {/* 재시작 확인 모달 */}
          {isRestartConfirmOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md">
                <h4 className="font-medium mb-2">시스템 재시작</h4>
                <p className="text-sm text-gray-600 mb-4">
                  시스템을 재시작하면 현재 진행 중인 작업이 중단될 수 있습니다. 계속하시겠습니까?
                </p>
                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => setIsRestartConfirmOpen(false)}
                    className="px-4 py-2 border rounded hover:bg-gray-50"
                  >
                    취소
                  </button>
                  <button 
                    onClick={restartSystem}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    재시작
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* 일반 설정 */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h3 className="font-medium mb-4">일반 설정</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">사용자별 최대 프로젝트 수</label>
              <input 
                type="number" 
                value={settings.maxProjectsPerUser}
                onChange={(e) => handleSettingChange('maxProjectsPerUser', parseInt(e.target.value))}
                min="1"
                className="w-full px-4 py-2 border rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">
                사용자당 생성할 수 있는 최대 프로젝트 수입니다.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">기본 토큰 한도</label>
              <input 
                type="number" 
                value={settings.defaultTokenLimit}
                onChange={(e) => handleSettingChange('defaultTokenLimit', parseInt(e.target.value))}
                min="1000"
                step="1000"
                className="w-full px-4 py-2 border rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">
                새 사용자 또는 프로젝트에 할당되는 기본 토큰 한도입니다.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">세션 타임아웃 (분)</label>
              <input 
                type="number" 
                value={settings.sessionTimeout}
                onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                min="5"
                className="w-full px-4 py-2 border rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">
                비활성 상태가 지속될 경우 세션이 종료되는 시간입니다.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">기본 모델</label>
              <select 
                value={settings.defaultModel}
                onChange={(e) => handleSettingChange('defaultModel', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="gpt-4">GPT-4 (OpenAI)</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo (OpenAI)</option>
                <option value="claude-3">Claude 3 (Anthropic)</option>
                <option value="deepseek-coder">DeepSeek Coder</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                새 프로젝트 생성 시 기본으로 선택되는 AI 모델입니다.
              </p>
            </div>
          </div>
        </div>
        
        {/* 백업 설정 */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h3 className="font-medium mb-4">백업 설정</h3>
          
          <div className="space-y-4">
            <div>
              <label className="flex items-center mb-2">
                <input type="checkbox" className="mr-2" checked />
                <span className="text-sm font-medium">자동 백업 활성화</span>
              </label>
              <p className="text-xs text-gray-500 ml-6">
                시스템 데이터를 정기적으로 백업합니다.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">백업 주기</label>
              <select className="w-full px-4 py-2 border rounded-lg">
                <option value="daily">매일</option>
                <option value="weekly">매주</option>
                <option value="monthly">매월</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">보관 기간 (일)</label>
              <input 
                type="number" 
                value="30"
                min="1"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            
            <div className="flex justify-end">
              <button className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50">
                지금 백업
              </button>
            </div>
          </div>
        </div>
        
        {/* 저장 버튼 */}
        {hasChanges && (
          <div className="fixed bottom-6 right-6">
            <button 
              onClick={saveSettings}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>설정 저장</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemSettings;