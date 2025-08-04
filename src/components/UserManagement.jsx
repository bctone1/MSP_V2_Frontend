// UserManagement.jsx
import React, { useState } from 'react';
import {
  PlusCircle,
  Search,
  Check,
  X,
  UserPlus,
  Edit,
  Trash2,
  Shield,
  User,
  Download
} from 'lucide-react';

const UserManagement = ({ users: initialUsers }) => {
  const [users, setUsers] = useState(initialUsers);
  // console.log(users);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user',
    group: '',
    phone_number: '',
  });
  const [editingUserId, setEditingUserId] = useState(null);
  const [editData, setEditData] = useState({});

  // 사용자 검색
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 새 사용자 추가
  const addUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.group) {
      alert("빈칸을 모두 채워주세요");
      return;
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/AddNewUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });
    if (response.ok) {
      // const data = await response.json();
      setUsers([...users, newUser]);
      setIsAddingUser(false);
      setNewUser({
        name: '',
        email: '',
        role: 'user',
        group: '',
        phone_number: '',
      });
    } else {
      console.error("Failed to fetch data");
    }
  };

  // 사용자 편집 시작
  const startEditingUser = (user) => {
    setEditingUserId(user.email);
    setEditData({
      name: user.name,
      email: user.email,
      role: user.role,
      group: user.group,
      phone_number: user.phone_number
    });
  };



  // 사용자 삭제
  const deleteUser = async (userEmail) => {
    if (window.confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/DeleteUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail }),
        // body: JSON.stringify(userEmail),
      });
      if (response.ok) {
        // const data = await response.json();
        console.log(`Provider with ID ${userEmail} deleted.`);
        setUsers(users.filter(user => user.email !== userEmail));
      } else {
        console.error("Failed to fetch data");
      }
    }
  };

  // 사용자 편집 저장
  const saveUserEdit = async () => {
    if (!editData.name || !editData.email) return;
    // console.log(editData);
    // console.log(editingUserId);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ChangeUserInfo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editData),
    });
    if (response.ok) {
      setUsers(users.map(user =>
        user.email === editingUserId ? { ...user, ...editData } : user
      ));
      setEditingUserId(null);
      setEditData({});

    } else {
      console.error("Failed to fetch data");
    }
  };

  const [sortBy, setSortBy] = useState("role");

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === "role") {
      return a.role.localeCompare(b.role);
    } else if (sortBy === "group") {
      return a.group?.localeCompare(b.group ?? "");
    }
    return 0;
  });
  

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-medium">사용자 관리</h2>
            <p className="text-sm text-gray-500">총 {users.length}명의 사용자</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddingUser(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
            >
              <UserPlus size={16} />
              <span>사용자 추가</span>
            </button>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="사용자 검색..."
                className="pl-10 pr-4 py-2 border rounded-lg w-full"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="role">역할</option>
              <option value="group">소속 그룹</option>
            </select>
          </div>
        </div>

        {/* 새 사용자 추가 폼 */}
        {isAddingUser && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">새 사용자 추가</h3>
              <button
                onClick={() => setIsAddingUser(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">이름</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="사용자 이름"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">이메일</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="user@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">역할</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="user">일반 사용자</option>
                  <option value="admin">관리자</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">소속그룹</label>
                <input
                  type="text"
                  value={newUser.group}
                  onChange={(e) => setNewUser({ ...newUser, group: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="BCTONE"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">연락처</label>
                <input
                  type="text"
                  value={newUser.phone_number}
                  onChange={(e) => setNewUser({ ...newUser, phone_number: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="01012345678"
                />
              </div>

            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsAddingUser(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={addUser}
                // disabled={!newUser.name || !newUser.email}
                className={`px-4 py-2 rounded-lg ${!newUser.name || !newUser.email || !newUser.group
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
              >
                추가
              </button>
            </div>
          </div>
        )}

        {/* 사용자 목록 */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  사용자
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  역할
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  연락처
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  소속그룹
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  액션
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedUsers.map(user => (
                <tr key={user.email}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUserId === user.email ? (
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="w-full px-3 py-1 border rounded"
                      />
                    ) : (
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUserId === user.email ? (
                      <select
                        value={editData.role}
                        onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                        className="w-full px-3 py-1 border rounded"
                      >
                        <option value="user">일반 사용자</option>
                        <option value="admin">관리자</option>
                      </select>
                    ) : (
                      <div className="flex items-center">
                        {user.role === 'admin' ? (
                          <Shield className="h-4 w-4 text-red-500 mr-1" />
                        ) : (
                          <User className="h-4 w-4 text-blue-500 mr-1" />
                        )}
                        <span className="text-sm text-gray-900">
                          {user.role === 'admin' ? '관리자' : '일반 사용자'}
                        </span>
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUserId === user.email ? (
                      <input
                        type="text"
                        value={editData.phone_number ?? ""}
                        onChange={(e) => setEditData({ ...editData, phone_number: e.target.value })}
                        className="w-full px-3 py-1 border rounded"
                      />
                    ) : (
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900">
                          {user.phone_number}
                        </span>
                      </div>
                    )}
                  </td>


                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUserId === user.email ? (
                      <input
                        type="text"
                        value={editData.group}
                        onChange={(e) => setEditData({ ...editData, group: e.target.value })}
                        className="w-full px-3 py-1 border rounded"
                      />
                    ) : (
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900">
                          {user.group}
                        </span>
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {editingUserId === user.email ? (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setEditingUserId(null)}
                          className="text-red-600 hover:text-red-900"
                        >
                          취소
                        </button>
                        <button
                          onClick={saveUserEdit}
                          className="text-green-600 hover:text-green-900"
                        >
                          저장
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => startEditingUser(user)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="수정"
                        >
                          <Edit className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => deleteUser(user.email)}
                          className="text-red-600 hover:text-red-900"
                          title="삭제"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sortedUsers.length === 0 && (
          <div className="text-center py-6 bg-white rounded-lg shadow-sm border mt-6">
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;