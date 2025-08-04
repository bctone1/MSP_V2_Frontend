import React, { useState } from 'react';

const NewProject = ({
  categories,
  models,
  setView,
  setActiveProject,
  sessionemail,
  setProjects,
  selectProject
}) => {
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectCategory, setProjectCategory] = useState('web');
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [selectedProvider, setSelectedProvider] = useState('OpenAI');

  // 새 프로젝트 생성
  const createProject = async () => {
    if (!projectName) return;
    const newProject = {
      // id: `proj-${Date.now()}`,
      project_name: projectName,
      description: projectDesc,
      category: projectCategory,
      model: selectedModel,
      user_email: sessionemail,
      provider: selectedProvider
      // lastActive: '방금',
      // progress: 0,
      // status: 'active'
    };
    console.log(newProject);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/createproject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectInfo: newProject }),
    });
    const data = await response.json();
    if (response.ok) {
      alert("생성되었습니다.");
      console.log(data);
      // window.location.href="/home/user";
      setProjects(prevProjects => [...prevProjects, data]);
      setActiveProject(data); // <- 바로 data
      setSelectedModel(data.ai_model); // <- 바로 data
      setView('project-detail');

    } else {
      alert("프로젝트 생성 실패");
      console.error("프로젝트 생성 실패:", response.statusText);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 p-6 overflow-y-auto">
      <div className="max-w-2xl w-full bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">새 프로젝트</h2>
          <button
            onClick={() => setView('projects')}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">프로젝트 이름</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="프로젝트 이름을 입력하세요"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">프로젝트 설명 (선택사항)</label>
            <textarea
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              placeholder="프로젝트에 대한 간단한 설명을 입력하세요"
              className="w-full px-4 py-2 border rounded-lg h-24 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">카테고리</label>
            <div className="grid grid-cols-4 gap-3">
              {categories.map(category => (
                <div
                  key={category.id}
                  onClick={() => setProjectCategory(category.id)}
                  className={`p-3 border rounded-lg cursor-pointer text-center ${projectCategory === category.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'hover:bg-gray-50'
                    }`}
                >
                  <div className="text-sm">{category.name}</div>
                  <span className="text-xs text-gray-500">{category.example}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">AI 모델 선택</label>
            <div className="grid grid-cols-2 gap-3">
              {models.map(model => (
                <div
                  key={model.id}
                  onClick={() => {
                    setSelectedModel(model.model_name);
                    setSelectedProvider(model.provider_name);
                  }}
                  className={`p-3 border rounded-lg cursor-pointer ${selectedModel === model.model_name
                    ? 'border-blue-500 bg-blue-50'
                    : 'hover:bg-gray-50'
                    }`}
                >
                  <div className="font-medium">{model.model_name}</div>
                  <div className="text-xs text-gray-500">{model.provider_name}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setView('projects')}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              취소
            </button>
            <button
              onClick={createProject}
              disabled={!projectName.trim()}
              className={`px-4 py-2 rounded-lg ${!projectName.trim()
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
            >
              프로젝트 생성
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProject;