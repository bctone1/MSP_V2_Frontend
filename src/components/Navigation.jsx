import React from 'react';
import {
  LayoutDashboard, FolderOpen, Key,
  Settings, Bot
} from 'lucide-react';

import { useSession, signOut } from "next-auth/react";
import { Power } from 'lucide-react';



const Navigation = ({ navView, changeNavigation }) => {
  const { data: session } = useSession();
  // console.log(session);

  return (
    <div className="w-64 bg-white border-r flex flex-col h-full">
      {/* 로고 및 브랜드 영역 */}
      <div className="p-4 border-b flex items-center gap-2">
        <Bot size={24} className="text-blue-500" />
        <h1 className="font-semibold text-lg">META LLM MSP</h1>
      </div>

      {/* 네비게이션 메뉴 */}
      <div className="p-4 flex-1">
        <nav className="space-y-1">
          <button
            onClick={() => changeNavigation('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left ${navView === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
          >
            <LayoutDashboard size={18} />
            <span>대시보드</span>
          </button>

          <button
            onClick={() => changeNavigation('projects')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left ${navView === 'projects' || navView === 'project-detail' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
          >
            <FolderOpen size={18} />
            <span>프로젝트 관리</span>
          </button>

          <button
            onClick={() => changeNavigation('apikeys')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left ${navView === 'apikeys' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
          >
            <Key size={18} />
            <span>API 키 관리</span>
          </button>

          <button
            onClick={() => changeNavigation('profile')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left ${navView === 'profile' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
          >
            <Settings size={18} />
            <span>내 정보</span>
          </button>
        </nav>
      </div>

      {/* 사용자 정보 */}
      {/* <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
            H
          </div>

          <div>
            {session ? (
              <>
                <div className="font-medium">{session.user.name}</div>
                <div className="text-xs text-gray-500">{session.user.email}</div>
              </>

            ) : (
              <>
                <div className="font-medium">이름</div>
                <div className="text-xs text-gray-500">이메일</div>
              </>
            )}
          </div>

          <button onClick={() => signOut({ callbackUrl: "/" })}>
            <Power className="text-red-300 ml-4" />
          </button>
        </div>

      </div> */}
    </div>
  );
};

export default Navigation;