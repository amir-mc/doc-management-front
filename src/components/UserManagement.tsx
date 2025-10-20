"use client";

import React, { useState, useEffect } from 'react';
import { User, CreateUserRequest } from '../types/user';
import { userApi } from '../services/api';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState<CreateUserRequest>({
    nationalCode: '',
    firstName: '',
    lastName: '',
    fatherName: '',
    password: '', // اضافه کردن رمز عبور
    role: 'USER',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm]);

  const loadUsers = async () => {
    try {
      const usersData = await userApi.getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const filterUsers = () => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(user =>
      user.nationalCode.includes(searchTerm) ||
      user.firstName.includes(searchTerm) ||
      user.lastName.includes(searchTerm) ||
      user.fatherName.includes(searchTerm) ||
      `${user.firstName} ${user.lastName}`.includes(searchTerm)
    );
    setFilteredUsers(filtered);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await userApi.createUser(newUser);
      setShowCreateForm(false);
      setNewUser({
        nationalCode: '',
        firstName: '',
        lastName: '',
        fatherName: '',
        password: '',
        role: 'USER',
      });
      await loadUsers();
    } catch (error) {
      console.error('Error creating user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (userId: number, file: File) => {
    try {
      await userApi.uploadProfileImage(userId, file);
      await loadUsers();
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('آیا از حذف این کاربر اطمینان دارید؟')) {
      return;
    }

    try {
      await userApi.deleteUser(userId);
      await loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">مدیریت کاربران</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          ایجاد کاربر جدید
        </button>
      </div>

      {/* جستجو */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="جستجو بر اساس کد ملی، نام، نام خانوادگی، نام پدر..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-2 border rounded focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={filterUsers}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            جستجو
          </button>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          {filteredUsers.length} کاربر یافت شد
        </div>
      </div>

      {/* فرم ایجاد کاربر */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">ایجاد کاربر جدید</h2>
            <form onSubmit={handleCreateUser}>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="کد ملی *"
                  value={newUser.nationalCode}
                  onChange={(e) => setNewUser({...newUser, nationalCode: e.target.value})}
                  className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="نام *"
                  value={newUser.firstName}
                  onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                  className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="نام خانوادگی *"
                  value={newUser.lastName}
                  onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                  className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="نام پدر *"
                  value={newUser.fatherName}
                  onChange={(e) => setNewUser({...newUser, fatherName: e.target.value})}
                  className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                  required
                />
                <input
                  type="password"
                  placeholder="رمز عبور *"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                  required
                />
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value as 'USER' | 'ADMIN'})}
                  className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                >
                  <option value="USER">کاربر عادی</option>
                  <option value="ADMIN">مدیر</option>
                </select>
              </div>
              <div className="flex gap-2 mt-4">
                <button 
                  type="submit" 
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
                  disabled={loading}
                >
                  {loading ? 'در حال ایجاد...' : 'ایجاد کاربر'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowCreateForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* لیست کاربران */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">لیست کاربران</h2>
        </div>
        <div className="p-6">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'هیچ کاربری با مشخصات جستجو شده یافت نشد' : 'هیچ کاربری ثبت نشده است'}
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="border p-4 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* پیش‌نمایش عکس پروفایل */}
                      <div className="relative">
                        {user.profileImage ? (
                          <>
                            <img 
                              src={`http://localhost:3001${user.profileImage}`} 
                              alt="Profile" 
                              className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                            />
                            <a
                              href={`http://localhost:3001${user.profileImage}`}
                              download
                              className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full text-xs"
                              title="دانلود عکس"
                            >
                              ⬇️
                            </a>
                          </>
                        ) : (
                          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center border-2 border-gray-400">
                            <span className="text-xs text-gray-600">بدون عکس</span>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="font-bold text-lg">
                          {user.firstName} {user.lastName}
                        </h3>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">کد ملی:</span> {user.nationalCode}
                          </div>
                          <div>
                            <span className="font-medium">نام پدر:</span> {user.fatherName}
                          </div>
                          <div>
                            <span className="font-medium">نقش:</span> 
                            <span className={`mr-2 px-2 py-1 rounded text-xs ${
                              user.role === 'ADMIN' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role === 'ADMIN' ? 'مدیر' : 'کاربر'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">تاریخ ثبت:</span> 
                            {new Date(user.createdAt).toLocaleDateString('fa-IR')}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <label className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 cursor-pointer text-sm">
                        📷 آپلود عکس
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleImageUpload(user.id, e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 text-sm"
                      >
                        🗑️ حذف
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;