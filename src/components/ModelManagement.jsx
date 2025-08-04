// ModelManagement.jsx
import React, { useState } from 'react';
import {
  Bot,
  Trash2,
  Edit,
  Sliders,
  Save,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  PlusCircle,
} from 'lucide-react';

const ModelManagement = ({ models, providerData,setModelsData }) => {
  // console.log(models);
  // 프로바이더별 모델 정보를 추출
  const extractModels = (models) => {
    let modelsList = [];

    models.forEach(model => {
      modelsList.push({
        id: model.id,
        provider_name: model.provider_name,
        name: model.model_name,

        // settings: {
        //   temperature: 0.7,
        //   maxTokens: 4000,
        //   topP: 1,
        //   frequencyPenalty: 0,
        //   presencePenalty: 0,
        //   isDefault: model.model_name === 'GPT-4' && model.provider_name === 'OpenAI'
        // }

      });

    });
    return modelsList;
  };

  const [Currentmodels, setCurrentmodels] = useState(extractModels(models));
  // console.log(Currentmodels);

  const [isAddingModel, setIsAddingModel] = useState(false);
  const [editingModel, setEditingModel] = useState(null);
  const [modelSettings, setModelSettings] = useState({});

  const [newModelData, setNewModelData] = useState({
    id: '',
    provider_name: 'OpenAI',
    name: '',
    // settings: {
    //   temperature: 0.7,
    //   maxTokens: 4000,
    //   topP: 1,
    //   frequencyPenalty: 0,
    //   presencePenalty: 0,
    // }
  });

  const addNewModel = async () => {
    console.log(newModelData);
    if (!newModelData.name || !newModelData.provider_name) {
      alert("빈칸이 있습니다.");
      return;
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/AddNewModel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newModelData),
    });
    if (response.ok) {
      // const data = await response.json();

      setCurrentmodels([...Currentmodels, newModelData]);
      setIsAddingModel(false);
      setNewModelData({
        name: '',
        provider_name: '',
        // parameter: '',
        // settings: {
        //   temperature: 0.7,
        //   maxTokens: 4000,
        //   topP: 1,
        //   frequencyPenalty: 0,
        //   presencePenalty: 0,
        // }
      });
    } else {
      console.error("Failed to fetch data");
    }
  };

  // 모델 수정 시작
  const startEditingModel = (model) => {
    setEditingModel(model.name);
    // setModelSettings({ ...model.settings });
    setModelSettings({ ...model });
  };

  
  const saveModelSettings = async (param) => {
    // console.log(param);
    // console.log(modelSettings);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ChangeModel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model_before: param, model_new: modelSettings }),
    });
    if (response.ok) {
      // const data = await response.json();
      setCurrentmodels(prevModels =>
        prevModels.map(model =>
          model.name === param.name ? { ...modelSettings } : model
        )
      );
      setEditingModel(null);
    } else {
      console.error("Failed to fetch data");
    }
  };
  const deleteModel = async (param) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/DeleteModel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(param),
      });
      if (response.ok) {
        // const data = await response.json();
        console.log(`Provider with ID ${param.name} deleted.`);
        setCurrentmodels(Currentmodels.filter(pre => pre.name !== param.name));
        setModelsData(models.filter(pre => pre.model_name !== param.name));
      } else {
        console.error("Failed to fetch data");
      }
    }
  };


  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-6">
          <div className="mb-6">
            <h2 className="text-lg font-medium">모델 설정</h2>
            {/* <p className="text-sm text-gray-500">AI 모델의 기본 설정 및 파라미터를 관리합니다</p> */}
          </div>

          <button
            onClick={() => setIsAddingModel(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <PlusCircle size={16} />
            <span>모델 추가</span>
          </button>
        </div>

        {/* 새 프로바이더 추가 폼 */}
        {isAddingModel && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">모델 추가</h2>
              
            </div>

            <div className="grid gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">프로바이더</label>

                <select className="w-full px-4 py-2 border rounded-lg mb-5"
                  onChange={(e) => setNewModelData({ ...newModelData, provider_name: e.target.value })}

                >
                  {providerData.map(provider => (
                    <option key={provider.name} value={provider.name}>{provider.name}</option>
                  ))}
                </select>

                <label className="block text-sm font-medium mb-2">모델 이름</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg mb-5"
                  placeholder="모델 이름 입력"
                  onChange={(e) => setNewModelData({ ...newModelData, name: e.target.value })}
                />

                {/* <label className="block text-sm font-medium mb-2">파라미터</label> */}
                {/* <textarea
                  // type="text"
                  // className="w-full px-4 py-2 border rounded-lg"
                  // placeholder="기본 파라미터를 작성해주세요"
                  // onChange={(e) => setNewModelData({ ...newModelData, parameter: e.target.value })}
                /> */}


                
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsAddingModel(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={addNewModel}
                // disabled={!newModelData.name || !newModelData.provider_name || !newModelData.parameter}
                className={`px-4 py-2 rounded-lg ${!newModelData.name || !newModelData.provider_name ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
              >
                추가
              </button>
            </div>
          </div>
        )}

        {/* 모델 목록 테이블 */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-6">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  모델
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  프로바이더
                </th>

                {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  파라미터
                </th> */}
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  액션
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {Currentmodels.map(model => (
                <tr key={model.name}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingModel === model.name ? (
                      <input
                        type="text"
                        className="mt-1 p-1 border rounded text-sm"
                        value={modelSettings.name}
                        onChange={(e) => setModelSettings({ ...modelSettings, name: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center">
                        <Bot className="w-5 h-5 text-gray-400 mr-3" />
                        <div className="text-sm font-medium text-gray-900">{model.name}</div>
                      </div>
                    )}
                  </td>


                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingModel === model.name ? (

                      <select className="mt-1 p-1 border rounded text-sm"
                        onChange={(e) => setModelSettings({ ...modelSettings, provider_name: e.target.value })}
                        value={model.provider_name}
                      >
                        {providerData.map(provider => (
                          <option key={provider.name} value={provider.name}>{provider.name}</option>
                        ))}
                      </select>


                    ) : (
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800`}>
                        {model.provider_name}
                      </div>
                    )}
                  </td>



                  {/* <td className="px-6 py-4 whitespace-nowrap">
                    {editingModel === model.name ? (
                      <div className="flex items-center space-x-4">
                        <div>
                          <label className="block text-xs text-gray-500">Temperature</label>
                          <input
                            type="number"
                            min="0"
                            max="2"
                            step="0.1"
                            className="mt-1 p-1 border rounded w-16 text-sm"
                            value={modelSettings.settings.temperature}
                            onChange={(e) => {
                              setModelSettings((prev) => ({
                                ...prev,
                                settings: {
                                  ...prev.settings,
                                  temperature: parseFloat(e.target.value),
                                },
                              }));
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500">Max Tokens</label>
                          <input
                            type="number"
                            className="mt-1 p-1 border rounded w-20 text-sm"
                            value={modelSettings.settings.maxTokens}
                            onChange={(e) => {
                              setModelSettings((prev) => ({
                                ...prev,
                                settings: {
                                  ...prev.settings,
                                  maxTokens: parseFloat(e.target.value),
                                },
                              }));
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-900">
                        Temperature: {model.settings.temperature}, Max Tokens: {model.settings.maxTokens}
                      </div>
                    )}
                  </td> */}


                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {editingModel === model.name ? (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setEditingModel(null)}
                          className="text-red-600 hover:text-red-800"
                        >
                          취소
                        </button>
                        <button
                          onClick={() => saveModelSettings(model)}
                          className="text-green-600 hover:text-green-800"
                        >
                          저장
                          {/* <Save className="w-4 h-4" /> */}
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => startEditingModel(model)}
                          className="text-indigo-600 hover:text-indigo-900">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => deleteModel(model)}
                        ><Trash2 className="h-4 w-4" /></button>
                      </div>
                    )}
                  </td>


                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div >
  );
};

export default ModelManagement;