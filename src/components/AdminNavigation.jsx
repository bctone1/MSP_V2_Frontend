// AdminNavigation.jsx
import React from 'react';
import {
  LayoutDashboard,
  Cloud,
  Code,
  Users,
  Settings,
  BarChart,
  Bot
} from 'lucide-react';

const AdminNavigation = ({ currentView, setCurrentView }) => {
  const navItems = [
    { id: 'dashboard', label: '대시보드', icon: <LayoutDashboard size={18} /> },
    { id: 'providers', label: 'AI 프로바이더', icon: <Cloud size={18} /> },
    { id: 'models', label: '모델 설정', icon: <Code size={18} /> },
    { id: 'users', label: '사용자 관리', icon: <Users size={18} /> },
    // { id: 'analytics', label: '사용량 분석', icon: <BarChart size={18} /> },
    // { id: 'settings', label: '시스템 설정', icon: <Settings size={18} /> }
  ];

  return (
    <div className="w-64 bg-white border-r flex flex-col">
      {/* 로고 및 브랜드 */}
      <div className="p-4 border-b flex items-center gap-3">
        <Bot size={24} className="text-blue-600" />
        <div>
          <h1 className="font-bold text-lg">META LLM MSP</h1>
          <p className="text-xs text-gray-500">관리자 콘솔</p>
        </div>
      </div>

      {/* 네비게이션 메뉴 */}
      <nav className="p-4 flex-1">
        <ul className="space-y-1">
          {navItems.map(item => (
            <li key={item.id}>
              <button
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left ${currentView === item.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <span className={currentView === item.id ? 'text-blue-600' : 'text-gray-500'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* 버전 정보 */}
      <div className="p-4 border-t">
        <p className="text-xs text-gray-500">META LLM MSP Frontend : {process.env.NEXT_PUBLIC_META_FRONT_VER} </p>
        <p className="text-xs text-gray-500">META LLM MSP Backend : {process.env.NEXT_PUBLIC_META_BACKEND_VER} </p>
        {/* <p className="text-xs text-gray-400">© 2024 META LLM Inc.</p> */}
      </div>
    </div>
  );
};

export default AdminNavigation;