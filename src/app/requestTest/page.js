'use client';

import React, { useState, useEffect } from 'react';

export default function RequestTest() {
    const [modelsData, setModelsData] = useState([]);
    const [postBodyLog, setPostBodyLog] = useState('');

    // 페이지 최초 렌더링 시 자동 요청
    useEffect(() => {
        const fetchModels = async () => {
            const bodyData = { source: "page", text: "페이지 렌더링시 요청입니다.." };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/RequestTest1`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bodyData),
            });

            const data = await response.json();

            if (response.ok) {
                setModelsData(data || []);
                setPostBodyLog(JSON.stringify(bodyData));
            } else {
                console.log("공급자 오류발생");
            }
        };
        fetchModels();
    }, []);







    // 버튼 클릭 시 요청
    const handleClick = async () => {
        const requestBody = { source: "button", text: "버튼 클릭시 요청입니다..", timestamp: new Date().toISOString() };

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/RequestTest1`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (response.ok) {
            setModelsData(data || []);
            setPostBodyLog(JSON.stringify(requestBody));
        } else {
            console.log("버튼 클릭 오류발생");
        }
    };

    return (
        <div className="flex gap-8 p-6">
            {/* 왼쪽 영역: 요청 및 로그 */}
            <div className="flex flex-col gap-4 w-1/2 bg-gray-50 p-4 rounded-lg shadow">
                <div>
                    <strong>요청된 body:</strong>
                    <div className="text-red-500 break-words">{postBodyLog}</div>
                </div>

                <button
                    onClick={handleClick}
                    className="w-[120px] h-[50px] bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition"
                >
                    요청
                </button>
            </div>

            {/* 오른쪽 영역: 서버 응답 데이터 */}
            <div className="w-1/2 bg-gray-100 p-4 rounded-lg shadow overflow-auto max-h-[500px]">
                <strong>서버 응답 데이터:</strong>
                <pre className="text-sm text-black mt-2">{JSON.stringify(modelsData, null, 2)}</pre>
            </div>
        </div>
    );
}
