import React, { useState, useRef, useEffect } from 'react';
import {
  Bot, User, Send, FileText,
  Upload, Settings, Cloud,
  Folder, Github, History,
  ChevronDown, Database, Trash2, File, MailPlus, ChevronRight, ChevronLeft
} from 'lucide-react';

const ProjectChat = ({
  activeProject,
  models,
  sessionLogs,
  selectedModel,
  setSelectedModel,
  setView,
  conversations,
  setSessionLogs,
  setconversations
}) => {
  // console.log(models);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [fileSource, setFileSource] = useState('local');
  const [files, setFiles] = useState([]);

  const [currentSessionLogs, setcurrentSessionLogs] = useState(sessionLogs);
  const now = new Date();
  const currentTime = "msp_id" +
    now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, "0") +
    now.getDate().toString().padStart(2, "0") +
    now.getHours().toString().padStart(2, "0") +
    now.getMinutes().toString().padStart(2, "0") +
    now.getSeconds().toString().padStart(2, "0");
  const currentSession = useRef(currentTime);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const initialized = useRef(false);


  const textareaRef = useRef(null);
  // const [input, setInput] = useState("");

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // 높이 초기화
      if (textarea.scrollHeight > textarea.clientHeight) {
        textarea.style.height = "200px";
        messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight + 50;
      }
    }
  };

  useEffect(() => {
    const fetchGetInfoBase = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getInfoBase`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            activeProject
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // console.log(data);
          const newFiles = data.map(f => ({
            name: f.file_name,
            source: 'local',
            id: f.id
          }));
          setFiles([...files, ...newFiles]);

        } else {
          alert("오류발생1");
        }

      } catch (error) {
        console.error('요청 중 오류 발생:', error);
        alert("오류발생2");
      }
    };
    // console.log(activeProject);
    if (!initialized.current) {
      initialized.current = true;
      fetchGetInfoBase();
      setMessages([{
        id: 1,
        role: 'system',
        content: `${activeProject.project_name} 프로젝트를 시작합니다. ${activeProject.description ? `설명: ${activeProject.description}` : ''} 어떤 도움이 필요하신가요?`
      }]);
      // newChat();
    }
  }, []);






  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight + 50;
    }
  }, [messages]);



  // 메시지 전송
  const sendMessage = async () => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto"; // 높이 초기화
    // console.log(currentSession.current);

    if (!input.trim()) return;
    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      content: input
    };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/RequestMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messageInput: input, project_id: activeProject.project_id, user_email: activeProject.user_email, session: currentSession.current, selected_model: selectedModel }),
    });
    const data = await response.json();
    // console.log(data);

    if (response.ok) {
      // console.log(data);
      setconversations(pre => [...pre, data.response]);
      if (data.project_id) {
        const newSessionLogs = {
          id: data.session_id,
          project_id: data.project_id.project_id,
          session_title: data.title,
          register_at: data.register_at,
          messages: 0,
          user_email: activeProject.user_email,
          case: data.case
        };
        setcurrentSessionLogs([newSessionLogs, ...currentSessionLogs]);
        setSessionLogs(pre => [...pre, newSessionLogs]);
      }
      const aiResponse = {
        id: messages.length + 2,
        role: 'assistant',
        content: data.response,
        model: selectedModel,
        // case : data.case
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);

    } else {
      alert("오류발생1");
    }
  };


  const showConversations = (param) => {
    console.log(conversations);
    // console.log(param.id);
    if (currentSession.current === param.id) {
      alert("이미 같은 세션입니다.");
      return;
    }
    setMessages([]);
    const filteredConversations = conversations.filter(convo => convo.session_id === param.id);
    filteredConversations.forEach((object, index) => {
      setMessages(prevMessages => {
        const newId = prevMessages.length + 1;
        const updatedMessage = {
          id: newId,
          role: object.message_role,
          content: object.conversation,
          model: selectedModel,
          case: object.case
          // case : "message"
        };
        return [...prevMessages, updatedMessage];
      });
    });
    currentSession.current = param.id;
  }

  const newChat = async () => {
    const now = new Date();
    const currentTime = "msp_id" +
      now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, "0") +
      now.getDate().toString().padStart(2, "0") +
      now.getHours().toString().padStart(2, "0") +
      now.getMinutes().toString().padStart(2, "0") +
      now.getSeconds().toString().padStart(2, "0");

    currentSession.current = currentTime;

    setMessages([{
      id: 1,
      role: 'system',
      content: `${activeProject.project_name} 프로젝트를 시작합니다. ${activeProject.description ? `설명: ${activeProject.description}` : ''} 어떤 도움이 필요하신가요?`
    }]);

    // const formattedDate = now.toLocaleString();

    // const newSessionLogs = {
    //   // id: currentSession.current,
    //   id: currentTime,
    //   project_id: activeProject.project_id,
    //   session_title: 'New Chat!',
    //   register_at: formattedDate,
    //   messages: 0,
    //   user_email: activeProject.user_email,
    // };


    // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/newSession`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(newSessionLogs),
    // });
    // const data = await response.json();
    // if (response.ok) {
    // setcurrentSessionLogs([newSessionLogs, ...currentSessionLogs]);
    // setSessionLogs(pre => [...pre, newSessionLogs]);
    // } else {
    //   alert("오류발생2");
    // }
  }





  // 파일 업로드
  const handleFileUpload = () => {
    if (fileSource === 'local') {
      fileInputRef.current?.click();
      setShowOptions(false); // 옵션 목록 표시
    } else {
      // 외부 스토리지 연동 시뮬레이션
      alert(`${fileSource} 연동을 시작합니다.`);
      // 외부에서 가져온 파일 시뮬레이션
      setTimeout(() => {
        const externalFiles = [
          { name: `${fileSource}_문서1.pdf`, source: fileSource },
          { name: `${fileSource}_문서2.docx`, source: fileSource }
        ];
        setFiles([...files, ...externalFiles]);
        alert(`${fileSource}에서 2개의 파일을 가져왔습니다.`);
      }, 1000);
    }
  };

  const handleFileSelect = async (e) => {
    // const selectedFiles = Array.from(e.target.files);
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("file", selectedFile);
    // formData.append("files[]", selectedFiles);
    formData.append("project_id", activeProject.project_id);
    formData.append("user_email", activeProject.user_email);
    formData.append("session_id", currentSession.current);

    // selectedFiles.forEach(file => {
    //   formData.append("files[]", file);
    // });

    // const formDataObject = {};
    // formData.forEach((value, key) => {
    //   formDataObject[key] = value;
    // });
    // console.log(formDataObject);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/UploadFile`, {
      method: "POST",
      body: formData
    });
    const data = await response.json();
    if (response.ok) {
      console.log(data);
    } else {
      alert("파일 업로드 오류발생");
    }



    if (selectedFile) {
      const newFiles = [{
        name: selectedFile.name,
        source: 'local',
      }];

      setFiles([...files, ...newFiles]);

      const fileMessage = {
        id: messages.length + 1,
        role: 'user',
        content: `파일 업로드: ${selectedFile.name}`,
        files: newFiles
      };

      setMessages([...messages, fileMessage]);

      // AI 응답 시뮬레이션
      setIsLoading(true);
      alert(data.message);
      setTimeout(() => {
        const response = {
          id: messages.length + 2,
          role: 'assistant',
          content: data.message,
          model: selectedModel
        };

        setMessages(prev => [...prev, response]);
        setIsLoading(false);
        // messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 1000);
    }
  };

  // 파일 소스에 따른 아이콘 반환
  const getFileSourceIcon = (source) => {
    switch (source) {
      case 'drive': return <Cloud size={14} />;
      case 'github': return <Github size={14} />;
      case 'dropbox': return <Database size={14} />;
      default: return <FileText size={14} />;
    }
  };

  const handleDeleteFile = async (file) => {
    // console.log(files);
    console.log(file);
    console.log(activeProject);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/DeleteFile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ activeProject, file }),
    });
    const data = await response.json();
    if (response.ok) {
      // console.log(data);
      setFiles(files.filter(pre => pre.name !== file.name));

    } else {
      alert("지식베이스 삭제 오류발생");
    }
  }

  const handleDeleteSession = async (session_id) => {
    console.log(session_id);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/DeleteSession`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ session_id: session_id })
    });
    const data = await response.json();
    if (response.ok) {
      // console.log(data);
      setcurrentSessionLogs(currentSessionLogs.filter(pre => pre.id !== session_id));
      setSessionLogs(sessionLogs.filter(pre => pre.id !== session_id));


      // setFiles(files.filter(pre => pre.name !== file.name));

    } else {
      alert("세션 삭제 오류발생");
    }

  }

  const [showOptions, setShowOptions] = useState(false);

  const handleShowUpload = () => {
    if (showOptions) {
      setShowOptions(false);
    } else {
      setShowOptions(true);
    }

  };

  const [collapsed, setCollapsed] = useState(false);

  // 마크다운 테이블을 HTML로 변환하는 함수 추가
  const convertMarkdownTableToHtml = (content) => {
    if (!content.includes('|')) return content;

    // 텍스트와 테이블 분리
    const parts = content.split('\n');
    let tableStart = -1;
    let tableEnd = -1;

    // 테이블의 시작과 끝 위치 찾기
    for (let i = 0; i < parts.length; i++) {
      if (parts[i].includes('|')) {
        if (tableStart === -1) tableStart = i;
        tableEnd = i;
      } else if (tableStart !== -1 && !parts[i].trim().startsWith('|-')) {
        // 테이블 다음에 빈 줄이 아닌 일반 텍스트가 나오면 종료
        break;
      }
    }

    // 테이블 부분만 추출
    const tableLines = parts.slice(tableStart, tableEnd + 1).filter(line =>
      line.includes('|') && !line.trim().startsWith('|-')
    );

    let html = '<table class="min-w-full divide-y divide-gray-200 my-4">\n';

    // 헤더 처리
    if (tableLines[0]) {
      html += '<thead class="bg-gray-50">\n<tr>\n';
      const headers = tableLines[0]
        .split('|')
        .filter(cell => cell.trim())
        .map(header => header.trim());

      headers.forEach(header => {
        html += `<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">${header}</th>\n`;
      });
      html += '</tr>\n</thead>\n';
    }

    // 본문 처리
    html += '<tbody class="bg-white divide-y divide-gray-200">\n';
    for (let i = 1; i < tableLines.length; i++) {
      const row = tableLines[i];
      if (row.trim() && !row.trim().startsWith('|-')) {
        html += '<tr class="even:bg-gray-50">\n';
        const cells = row
          .split('|')
          .filter(cell => cell.trim())
          .map(cell => cell.trim());

        cells.forEach(cell => {
          html += `<td class="px-6 py-4 whitespace-nowrap text-sm">${cell}</td>\n`;
        });
        html += '</tr>\n';
      }
    }
    html += '</tbody>\n</table>';

    // 테이블 전후의 텍스트 결합
    const beforeText = parts.slice(0, tableStart).filter(line => line.trim()).join('\n');
    const afterText = parts.slice(tableEnd + 1).filter(line => line.trim()).join('\n');

    return [
      beforeText,
      html,
      afterText
    ].filter(part => part).join('\n\n');
  };

  // 코드 블록 변환 함수 추가
  const convertCodeBlockToHtml = (content) => {
    console.log("코드블록");
    if (!content.includes('```')) return content;

    const parts = content.split('\n');
    let result = [];
    let isInCodeBlock = false;
    let currentCodeBlock = [];
    let language = '';

    for (let i = 0; i < parts.length; i++) {
      const line = parts[i];

      if (line.startsWith('```')) {
        if (!isInCodeBlock) {
          // 코드 블록 시작
          isInCodeBlock = true;
          language = line.slice(3).trim(); // 언어 추출
          continue;
        } else {
          // 코드 블록 종료
          isInCodeBlock = false;
          const code = currentCodeBlock.join('\n');
          const languageClass = language ? ` language-${language}` : '';
          result.push(`<pre class="bg-gray-800 rounded-lg p-4 my-4 overflow-x-auto"><code class="text-sm text-white${languageClass}">${escapeHtml(code)}</code></pre>`);
          currentCodeBlock = [];
          continue;
        }
      }

      if (isInCodeBlock) {
        currentCodeBlock.push(line);
      } else {
        result.push(line);
      }
    }

    return result.join('\n');
  };

  // HTML 특수문자 이스케이프 함수
  const escapeHtml = (unsafe) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  
  const markdownToHtml = (markdown) => {
    // console.log(markdown);
    if (!markdown) return '';

    let html = markdown;

    // 코드 블록 (```code```)
    html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-800 rounded-lg p-4 my-4 overflow-x-auto"><code class="text-sm text-white">$1</code></pre>');

    // 인라인 코드 (`code`)
    // html = html.replace(/`([^`\n]+)`/g, '<code>$1</code>');

    // 제목 (# ~ ######)
    html = html.replace(/^###### (.*)$/gm, '<h6>$1</h6>');
    html = html.replace(/^##### (.*)$/gm, '<h5>$1</h5>');
    html = html.replace(/^#### (.*)$/gm, '<h4>$1</h4>');
    html = html.replace(/^### (.*)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*)$/gm, '<h1>$1</h1>');

    // 굵게 (**bold** or __bold__)
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');

    // // 기울임 (*italic* or _italic_)
    // html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // html = html.replace(/_(.*?)_/g, '<em>$1</em>');

    // // 링크 [text](url)
    // html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

    // // 이미지 ![alt](url)
    // html = html.replace(/!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g, '<img src="$2" alt="$1" />');

    // // 목록 (순서 없음)
    // html = html.replace(/^\s*[-*] (.*)$/gm, '<li>$1</li>');
    // html = html.replace(/(<li>.*<\/li>)/gms, '<ul>$1</ul>');

    // // 목록 (순서 있음)
    // html = html.replace(/^\s*\d+\. (.*)$/gm, '<li>$1</li>');
    // html = html.replace(/(<li>.*<\/li>)/gms, '<ol>$1</ol>');

    // // 수평선 (---, ***, ___)
    // html = html.replace(/^[-*_]{3,}$/gm, '<hr/>');

    // // 마크다운 테이블 변환 (기초적 지원)
    // if (html.includes('|')) {
    //   html = convertMarkdownTableToHtml(html);
    // }

    // 줄바꿈
    html = html.replace(/\n/g, '<br>');

    return html;
  };

  return (
    <div className="flex-1 flex overflow-x-auto">

      {/* 왼쪽: 지식 베이스 및 대화 이력 패널 축소*/}
      {collapsed ? (
        <div className="w-10 bg-white border-r flex flex-col pt-3">
          <button
            onClick={() => setCollapsed(false)}
            className="w-full flex items-center justify-center gap-1 py-1.5 px-3 text-sm rounded-lg hover:bg-gray-50 mb-2"
          >
            <ChevronRight size={16} className="text-gray-500" />
          </button>

          <button
            onClick={handleFileUpload}
            className="w-full flex items-center justify-center gap-1 py-1.5 px-3 text-sm border border-dashed rounded-lg hover:bg-gray-50 mb-2"
          >
            <Upload size={14} />
          </button>

          <button
            onClick={() => newChat()}
            className="w-full flex items-center justify-center gap-1 py-1.5 px-3 text-sm border border-dashed rounded-lg hover:bg-gray-50 mb-2"
          >
            <MailPlus size={14} />
          </button>

        </div>
      ) : (
        < div className="w-64 bg-white border-r flex flex-col ">
          {/* 프로젝트 정보 */}
          <div className="p-3 border-b">
            <div className="flex items-center justify-between">
              <div className="font-medium truncate">{activeProject.project_name}</div>

              <div>
                <button
                  onClick={() => setView('projects')}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="프로젝트 목록"
                >
                  <Folder size={16} className="text-gray-500" />
                </button>

                <button
                  onClick={() => setCollapsed(true)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <ChevronLeft size={16} className="text-gray-500" />
                </button>
              </div>

            </div>
            {activeProject.description && (
              <p className="text-xs text-gray-500 mt-1 truncate">{activeProject.description}</p>
            )}
          </div>

          {/* 지식 베이스 */}
          <div className="p-3 border-b">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">지식 베이스</h3>
              <div className="flex">
                <button
                  onClick={() => setFileSource('local')}
                  className={`p-1 rounded ${fileSource === 'local' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                  title="로컬 파일"
                >
                  <FileText size={14} />
                </button>
                {/* <button
                onClick={() => setFileSource('drive')}
                className={`p-1 rounded ${fileSource === 'drive' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                title="Google Drive"
              >
                <Cloud size={14} />
              </button>
              <button
                onClick={() => setFileSource('github')}
                className={`p-1 rounded ${fileSource === 'github' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                title="GitHub"
              >
                <Github size={14} />
              </button> */}
              </div>
            </div>
            <button
              onClick={handleFileUpload}
              className="w-full flex items-center justify-center gap-1 py-1.5 px-3 text-sm border border-dashed rounded-lg hover:bg-gray-50 mb-2"
            >
              <Upload size={14} />
              <span>{fileSource === 'local' ? '파일 업로드' : `${fileSource} 연동`}</span>

            </button>
            {files.length > 0 ? (
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {files.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center p-1.5 text-xs "
                  >
                    {getFileSourceIcon(file.source)}
                    <span className="ml-1.5 truncate">{file.name}</span>
                    {/* <span className="ml-1.5 truncate">{file.name.split("\\").pop()}</span> */}
                    <Trash2 size={14} className="ml-5 text-red-500 float-right cursor-pointer" onClick={() => handleDeleteFile(file)} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-400 text-center py-2">
                파일이 없습니다
              </div>
            )}
          </div>

          <div className="p-3 border-b">
            <button
              onClick={() => newChat()}
            >
              새 채팅
            </button>
          </div>

          {/* 대화 이력 */}
          <div className="p-3 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">대화 기록</h3>
            </div>
            {currentSessionLogs
              .filter(c => c.project_id === activeProject?.project_id)
              .length > 0 ? (
              <div className="space-y-1">
                {currentSessionLogs
                  .filter(c => c.project_id === activeProject?.project_id)
                  .map(conv => (
                    <div
                      key={conv.id}
                      className="flex justify-between items-center"
                    >
                      <div className="p-2 text-xs flex flex-col rounded cursor-pointer hover:bg-gray-100 w-[80%]" onClick={() => showConversations(conv)}>
                        <div className="font-medium truncate">{conv.session_title}</div>

                        {Date.parse(conv.register_at) ? (
                          <div className="text-gray-500 mt-1 text-[10px]">
                            {new Date(conv.register_at).toLocaleString('ko-KR', {
                              year: 'numeric',
                              month: 'numeric',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: 'numeric',
                              second: 'numeric',
                              hour12: true,
                            })}
                          </div>
                        ) : (
                          <div className="text-gray-500 mt-1 text-[10px]">{conv.register_at}</div>
                        )}


                      </div>
                      <Trash2 size={14} className="text-red-500 ml-2 cursor-pointer" onClick={() => handleDeleteSession(conv.id)} />
                    </div>

                  ))
                }
              </div>
            ) : (
              <div className="text-xs text-gray-400 text-center py-2">
                저장된 대화가 없습니다
              </div>
            )}
          </div>

          {/* 모델 선택 */}
          <div className="p-3 border-t">
            <div className="relative">
              <button
                className="w-full flex items-center justify-between p-2 border rounded hover:bg-gray-50"
                onClick={() => setShowModelSelector(!showModelSelector)}
              >
                <div className="flex items-center gap-2">
                  <Bot size={14} className="text-blue-500" />
                  <span className="text-sm">{models.find(m => m.id === selectedModel)?.name || selectedModel}</span>
                </div>
                <ChevronDown size={16} />
              </button>

              {showModelSelector && (
                <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border rounded-lg shadow-lg z-10">
                  <div className="p-2">
                    {models.map(model => (
                      <div
                        key={model.id}
                        onClick={() => {
                          setSelectedModel(model.model_name);
                          setShowModelSelector(false);
                        }}
                        className={`flex items-center gap-2 p-2 rounded cursor-pointer ${selectedModel === model.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                          }`}
                      >
                        <Bot size={14} className={selectedModel === model.id ? "text-blue-500" : "text-gray-500"} />
                        <div>
                          <div className="text-sm font-medium">{model.model_name}</div>
                          <div className="text-xs text-gray-500">{model.provider_name}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )
      }



      {/* 오른쪽: 채팅 인터페이스 */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* 채팅 헤더 */}
        <div className="p-3 bg-white border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot size={18} className="text-blue-500" />
            <span>AI 어시스턴트</span>
          </div>
          <button className="p-1.5 hover:bg-gray-100 rounded">
            <Settings size={16} className="text-gray-500" />
          </button>
        </div>

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto p-4" ref={messagesEndRef}>
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[75%] rounded-lg p-3 ${message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : message.role === 'system'
                    ? 'bg-amber-50 border border-amber-200'
                    : 'bg-white border'
                  }`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    {message.role === 'user' ? (
                      <User size={14} />
                    ) : (
                      <Bot size={14} />
                    )}
                    <div className="text-sm">
                      {message.role === 'user' ? '사용자' : message.role === 'system' ? '시스템' : 'AI 어시스턴트'}
                    </div>
                    {message.model && message.role !== 'user' && (
                      <div className="ml-auto text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                        {/* {models.find(m => m.id === message.model)?.name || message.model} */}
                        {message.role}
                      </div>
                    )}
                  </div>

                  {message.role !== 'user' ? (

                    message?.content?.startsWith?.('https://') ? (
                      <img src={message.content} alt="Generated" className="rounded-md max-w-full" />

                    ) : message?.content && message.case === "image" && (message.content.includes('.png') || message.content.includes('.jpg') || message.content.includes('.jpeg') || message.content.includes('.gif')) ? (
                      <div className="relative">
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL}/file/upload/${message.content.replace(/\\/g, '/')}`}
                          alt="Uploaded"
                          className="rounded-md max-w-full hover:opacity-90 transition-opacity cursor-pointer"
                          onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL}/file/upload/${message.content.replace(/\\/g, '/')}`, '_blank')}
                          onError={(e) => {
                            const imgUrl = e.target.src;
                            console.error('Image load error - URL:', imgUrl);
                            console.error('Original message content:', message.content);
                            console.error('Modified URL:', `/file/upload/${message.content.replace(/\\/g, '/')}`);

                            // 이미지 로드 실패 시 에러 메시지 표시
                            e.target.style.display = 'none';
                            const errorDiv = document.createElement('div');
                            errorDiv.className = 'text-red-500 text-sm mt-2';
                            errorDiv.innerHTML = `
                              <div class="bg-red-50 border border-red-200 rounded p-3">
                                <p>이미지를 불러올 수 없습니다.</p>
                                <p class="text-xs mt-1">원본 경로: ${message.content}</p>
                                <p class="text-xs mt-1">요청 경로: /file/upload/${message.content.replace(/\\/g, '/')}</p>
                              </div>
                            `;
                            e.target.parentNode.appendChild(errorDiv);
                          }}
                        />
                      </div>
                    // ) : message?.content?.includes('```') ? (
                    //   <div
                    //     className="text-sm whitespace-pre-wrap"
                    //     dangerouslySetInnerHTML={{
                    //       __html: convertCodeBlockToHtml(message.content)
                    //     }}
                    //   />
                    ) : message?.content?.includes('|') ? (
                      <div
                        className="text-sm whitespace-pre-wrap overflow-x-auto"
                        dangerouslySetInnerHTML={{
                          __html: convertMarkdownTableToHtml(message.content)
                        }}
                      />
                    ) : (
                      <div
                        className="text-sm whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{
                          __html: markdownToHtml(message.content)
                        }}
                      />
                    )
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  )}

                  {message.files && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {message.files.map((file, idx) => (
                        <div key={idx} className="text-xs bg-blue-600 bg-opacity-20 text-white rounded px-1.5 py-0.5 flex items-center gap-1">
                          {getFileSourceIcon(file.source)}
                          <span>{file.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* <div ref={messagesEndRef} /> */}
          </div>
        </div>

        {/* 입력 영역 */}
        <div className="p-3 bg-white border-t">
          <div className="max-w-3xl mx-auto flex items-center gap-2 relative">
            <button
              // onClick={handleFileUpload}
              onClick={handleShowUpload}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              <Upload size={18} />
            </button>

            {showOptions && (
              <div className="absolute bottom-full mb-2 bg-white border rounded-lg shadow-lg mt-2 p-3 w-60">
                <div
                  onClick={handleFileUpload}
                  className="p-2 cursor-pointer hover:bg-gray-200 flex items-center gap-2"
                >
                  <File size={16} />
                  <span>내 컴퓨터에서 추가</span>
                </div>
                <div
                  className="p-2 cursor-pointer hover:bg-gray-200 flex items-center gap-2"
                >
                  <Cloud size={16} />
                  <span>Google Drive에서 추가</span>
                </div>
                <div
                  className="p-2 cursor-pointer hover:bg-gray-200 flex items-center gap-2"
                >
                  <Github size={16} />
                  <span>GitHub에서 추가</span>
                </div>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              // multiple
              onChange={handleFileSelect}
            />


            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onInput={handleInput}
              placeholder="메시지를 입력하세요..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-auto"
              rows={1}
              onKeyDown={(e) => {
                if ((e.key === 'Enter') && (e.shiftKey || e.ctrlKey)) {
                  // 줄바꿈: 기본 동작 유지
                  return;
                } else if (e.key === 'Enter') {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />


            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className={`p-2 rounded-lg ${isLoading || !input.trim()
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div >
  );
};

export default ProjectChat;