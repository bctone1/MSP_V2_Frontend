"use client"

// AdminInterface.jsx
import React, { useState, useEffect } from 'react';
import { useSession, signOut } from "next-auth/react";
import { Power } from 'lucide-react';

import AdminNavigation from '@/components/AdminNavigation';
import AdminDashboard from '@/components/AdminDashboard';
import ProviderManagement from '@/components/ProviderManagement';
import ModelManagement from '@/components/ModelManagement';
import UserManagement from '@/components/UserManagement';
import SystemSettings from '@/components/SystemSettings';
import UsageAnalytics from '@/components/UsageAnalytics';

const AdminInterface = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const { data: session } = useSession();
  const [providerData, setproviderData] = useState([]);
  const [OpenaiModels, setOpenaiModels] = useState([]);
  const [ModelsData, setModelsData] = useState([]);
  const [userData, setuserData] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {

    const fetchOpenaiModels = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getOpenaiModels`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        // setOpenaiModels(data.models);
      } else {
        alert("공급자 오류발생");
      }
    };



    const fetchProvider = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/providerList`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        // console.log(data.providers);
        setproviderData(data.providers);
      } else {
        alert("공급자 오류발생");
      }
    };

    const fetchModels = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/modelsList`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        // console.log(data);
        setModelsData(data.models);
      } else {
        alert("공급자 오류발생");
      }
    };

    const fetchUser = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getmembers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        setuserData(data.members);
      } else {
        alert("맴버 오류발생");
      }
    };

    const fetchProjects = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projectsList`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: 'admin' }),
      });
      const data = await response.json();
      if (response.ok) {
        setProjects(data);
        // console.log(data);
      } else {
        alert("프로젝트 오류발생");
      }
    };

    fetchProjects();
    fetchUser();
    fetchProvider();
    fetchModels();
    // fetchOpenaiModels();
  }, []);

  const usageData = {
    summary: {
      totalCalls: 5555,
      totalTokens: 5555,
      totalCost: 555,
    },
    providerUsage: [
      { provider: '5555', calls: 5555, tokens: 5555, cost: 5555 },
      { provider: '5555', calls: 5555, tokens: 5555, cost: 5555 },
      { provider: '5555', calls: 5555, tokens: 5555, cost: 5555 },
      { provider: '5555', calls: 5555, tokens: 5555, cost: 5555 },
    ],
    recentActivity: [
      { time: '14:25', user: '김영희', action: 'API 호출', details: 'OpenAI GPT-4, 토큰: 3250' },
      { time: '13:15', user: '이철수', action: '새 프로젝트 생성', details: '모바일 앱 개발' },
      { time: '12:30', user: '김영희', action: 'API 키 갱신', details: 'Anthropic API' }
    ]
  };

  const systemData = {
    settings: {
      maxProjectsPerUser: 10,
      defaultTokenLimit: 100000,
      sessionTimeout: 60,
      defaultModel: 'gpt-4'
    },
    maintenance: {
      status: 'operational',
      scheduledMaintenance: null,
      version: '1.2.5',
      lastUpdated: '2024-03-10'
    }
  };

  // 현재 화면 렌더링
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <AdminDashboard usageData={usageData} providerData={providerData} userData={userData} projects={projects} />;
      case 'providers':
        return <ProviderManagement providers={providerData} />;
      case 'models':
        return <ModelManagement models={ModelsData} providerData={providerData} setModelsData={setModelsData}/>;
      case 'users':
        return <UserManagement users={userData} />;
      case 'settings':
        return <SystemSettings settings={systemData.settings} maintenance={systemData.maintenance} />;
      case 'analytics':
        return <UsageAnalytics usageData={usageData} />;
      default:
        return <AdminDashboard usageData={usageData} providerData={providerData} userData={userData} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 사이드 네비게이션 */}
      <AdminNavigation
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col overflow-hidden">


        {/* 헤더 */}
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">
              {currentView === 'dashboard' && '관리자 대시보드'}
              {currentView === 'providers' && 'AI 프로바이더 관리'}
              {currentView === 'models' && '모델 설정'}
              {currentView === 'users' && '사용자 관리'}
              {currentView === 'settings' && '시스템 설정'}
              {currentView === 'analytics' && '사용량 분석'}
            </h1>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">관리자: {session?.user?.email || "정보 없음"}</span>
              <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                A
              </div>
              <button onClick={() => signOut({ callbackUrl: "/" })}>
                <Power className="ml-3 text-red-300" />
              </button>
            </div>
          </div>
        </header>

        {/* 콘텐츠 영역 */}
        <main className="flex-1 overflow-y-auto">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
};

export default AdminInterface;