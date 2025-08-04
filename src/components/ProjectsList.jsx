import React, { useState } from 'react';
import { PlusCircle, Search, Bot, Clock } from 'lucide-react';



const ProjectsList = ({
  projects,
  setProjects,
  selectProject,
  setView
}) => {




  const [searchTerm, setSearchTerm] = useState(""); // 검색어
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const projectsPerPage = 6; // 한 페이지에 표시할 프로젝트 개수

  const filteredProjects = projects.filter((project) =>
    project['project_name'].toLowerCase().includes(searchTerm.toLowerCase())
  );


  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  // const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


  const [selectedProjects, setSelectedProjects] = useState([]);

  const handleCheckboxChange = (projectId) => {
    setSelectedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };
  const handleDeleteSelected = async () => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      console.log(projects);
      console.log("삭제할 프로젝트 ID들:", selectedProjects);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/DeleteProject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ project_ids: selectedProjects }),
      });
      if (response.ok) {
        setProjects(projects.filter(pre => !selectedProjects.includes(pre.project_id)));
      } else {
        console.error("Failed to fetch data");
      }
    }
  };


  const [sortBy, setSortBy] = useState("recent"); // 기본 정렬: 최근 생성

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "recent") {
      return b.project_id - a.project_id; // id 큰 순 → 최근 생성
    } else if (sortBy === "oldest") {
      return a.project_id - b.project_id; // id 작은 순 → 오래된 생성
    } else if (sortBy === "model") {
      return a.ai_model.localeCompare(b.ai_model); // 모델 이름순
    } else if (sortBy === "category") {
      return a.category.localeCompare(b.category); // 카테고리 이름순
    }
    return 0;
  });



  const currentProjects = sortedProjects.slice(indexOfFirstProject, indexOfLastProject);





  return (
    <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-end mb-6">
          <h1 className="text-2xl font-semibold"></h1>

          <button
            onClick={() => setView('new-project')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <PlusCircle size={16} />
            <span>새 프로젝트</span>
          </button>

          {selectedProjects.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 ml-3"
            >
              선택 항목 삭제
            </button>
          )}

        </div>

        <div className="flex gap-4 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="프로젝트 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg w-full"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="recent">최근순</option>
            <option value="oldest">오래된순</option>
            <option value="model">모델</option>
            <option value="category">카테고리</option>
          </select>

        </div>


        {/* 프로젝트 목록 */}
        <div className="grid grid-cols-2 gap-6">
          {currentProjects.map(project => (
            <div key={project.project_id} className="bg-white rounded-lg border p-4 flex justify-between">


              <div
                onClick={() => selectProject(project.project_id)}
                className="bg-white rounded-lg border p-4 hover:border-blue-300 hover:shadow-sm cursor-pointer w-[90%]"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">{project.project_name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {project.description ? project.description : "Description"}
                    </p>
                  </div>
                </div>

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

              <div
                onClick={() => handleCheckboxChange(project.project_id)}
                className={`w-[7%] h-[100%] border-2 rounded cursor-pointer flex items-center justify-center transition-colors 
                ${selectedProjects.includes(project.project_id) ? "bg-blue-100 border-blue-400" : "bg-white border-gray-300"}`}
              >
                {/* 내부 내용 */}
              </div>


            </div>

          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center text-gray-500 py-6 bg-white rounded-lg border">
            생성된 프로젝트가 없습니다. 새 프로젝트를 시작해보세요.
          </div>
        )}



        {/* 페이지네이션 */}
        <div className="mt-6 flex justify-center items-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded-lg ${page === currentPage
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
                }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsList;