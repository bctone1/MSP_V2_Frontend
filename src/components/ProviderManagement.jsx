// ProviderManagement.jsx
import React, { useState } from 'react';
import {
  PlusCircle,
  Bot,
  Zap,
  BarChart,
  Key,
  RefreshCw,
  CheckCircle,
  XCircle
} from 'lucide-react';

const ProviderManagement = ({ providers: initialProviders }) => {
  const [providers, setProviders] = useState(initialProviders);
  const [isAddingProvider, setIsAddingProvider] = useState(false);
  const [newProviderData, setNewProviderData] = useState({
    id: '',
    name: '',
    status: 'Active',
    website: '',
    description: '',

    // apiKey: '',
    // models: [],
    // defaultParams: { temperature: 0.7, max_tokens: 4000 }
  });

  // 프로바이더 활성화/비활성화 토글
  const toggleProviderStatus = async (provider) => {
    console.log(provider.id);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/changeProviderStatus`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(provider.id),
      body: JSON.stringify({
        provider_id: provider.id
      })
    });
    if (response.ok) {
      console.log(`Provider with ID ${provider.name} status changed.`);
      setProviders(items => items.map(item =>
        item.name === provider.name
          ? { ...item, status: item.status === 'Active' ? 'Inactive' : 'Active' }
          : item
      ));
    } else {
      console.error("Failed to fetch data");
    }
  };

  const deleteProvider = async (param) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/DeleteProvider`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(param),
      });
      if (response.ok) {
        // const data = await response.json();
        console.log(`Provider with ID ${param.name} deleted.`);
        setProviders(providers.filter(provider => provider.name !== param.name));
      } else {
        console.error("Failed to fetch data");
      }

    }
  };

  // 새 프로바이더 추가
  const addNewProvider = async () => {
    if (!newProviderData.name || !newProviderData.website || !newProviderData.description) {
      alert("빈칸이 있습니다.");
      return;
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/AddNewProvider`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProviderData),
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data);

      setProviders([...providers, newProviderData]);
      setIsAddingProvider(false);
      setNewProviderData({
        id: '',
        name: '',
        status: 'Active',
        website: '',
        description: '',
      });

    } else {
      console.error("Failed to fetch data");
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-medium">AI 프로바이더 관리</h2>
            <p className="text-sm text-gray-500">LLM 프로바이더를 연결하고 관리합니다</p>
          </div>

          <button
            onClick={() => setIsAddingProvider(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <PlusCircle size={16} />
            <span>새 프로바이더 추가</span>
          </button>
        </div>

        {/* 새 프로바이더 추가 폼 */}
        {isAddingProvider && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">새 AI 프로바이더 연결</h2>
              
            </div>

            <div className="grid gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">프로바이더 이름</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg mb-5"
                  placeholder="프로바이더 이름 입력"
                  onChange={(e) => setNewProviderData({ ...newProviderData, name: e.target.value })}
                />
                <label className="block text-sm font-medium mb-2">사이트</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg mb-5"
                  placeholder="웹사이트를 작성해주세요"
                  onChange={(e) => setNewProviderData({ ...newProviderData, website: e.target.value })}
                />

                <label className="block text-sm font-medium mb-2">설명</label>
                <textarea
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="간단한 설명을 작성해주세요"
                  onChange={(e) => setNewProviderData({ ...newProviderData, description: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsAddingProvider(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={addNewProvider}
                // disabled={!newProviderData.name}
                className={`px-4 py-2 rounded-lg ${!newProviderData.name || !newProviderData.website || !newProviderData.description ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
              >
                추가
              </button>
            </div>
          </div>
        )}

        {/* 프로바이더 카드 목록 */}
        <div className="space-y-6">
          {providers.map(provider => {

            return (
              <div key={provider.name} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-yellow-500 text-black`}>
                      <Bot size={24} />
                    </div>
                    <div>
                      <h2 className="text-lg font-medium">{provider.name}</h2>

                    </div>
                  </div>
                </div>



                {/* 사용량 및 정보 */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <p className="text-sm text-gray-500">{provider.description}</p>
                  <a className="text-sm text-blue-500" href={provider.website} target="_blank">{provider.website}</a>
                </div>

                {/* 설정 및 액션 */}
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                  <button
                    onClick={() => toggleProviderStatus(provider)}
                    className={`px-3 py-1.5 text-sm rounded ${provider.status === 'Active'
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                  >
                    {provider.status === 'Active' ? '비활성화' : '활성화'}
                  </button>

                  <button className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50"
                    onClick={() => deleteProvider(provider)}
                  >
                    삭제
                  </button>

                </div>
              </div>
            )
          })}
        </div>

        {providers.length === 0 && (
          <div className="text-center text-gray-500 py-6 bg-white rounded-lg shadow-sm border">
            연결된 AI 프로바이더가 없습니다. 새 프로바이더를 연결해보세요.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderManagement;