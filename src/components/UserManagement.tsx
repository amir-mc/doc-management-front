import React, { useState, useEffect } from 'react';
import { User, CreateUserRequest } from '../types/user';
import { userApi } from '../services/api';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState<CreateUserRequest>({
    nationalCode: '',
    firstName: '',
    lastName: '',
    fatherName: '',
    role: 'USER',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const usersData = await userApi.getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userApi.createUser(newUser);
      setShowCreateForm(false);
      setNewUser({
        nationalCode: '',
        firstName: '',
        lastName: '',
        fatherName: '',
        role: 'USER',
      });
      loadUsers();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleImageUpload = async (userId: number, file: File) => {
    try {
      await userApi.uploadProfileImage(userId, file);
      loadUsers();
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await userApi.deleteUser(userId);
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">مدیریت کاربران</h1>
      
      <button
        onClick={() => setShowCreateForm(true)}
        className="bg-blue-500 text-black px-4 py-2 rounded mb-4"
      >
        ایجاد کاربر جدید
      </button>

      {showCreateForm && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center">
          <div className="bg-black p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">ایجاد کاربر جدید</h2>
            <form onSubmit={handleCreateUser}>
              <input
                type="text"
                placeholder="کد ملی"
                value={newUser.nationalCode}
                onChange={(e) => setNewUser({...newUser, nationalCode: e.target.value})}
                className="w-full p-2 border rounded mb-2"
                required
              />
              <input
                type="text"
                placeholder="نام"
                value={newUser.firstName}
                onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                className="w-full p-2 border rounded mb-2"
                required
              />
              <input
                type="text"
                placeholder="نام خانوادگی"
                value={newUser.lastName}
                onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                className="w-full p-2 border rounded mb-2"
                required
              />
              <input
                type="text"
                placeholder="نام پدر"
                value={newUser.fatherName}
                onChange={(e) => setNewUser({...newUser, fatherName: e.target.value})}
                className="w-full p-2 border rounded mb-4"
                required
              />
              <div className="flex gap-2">
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                  ایجاد
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowCreateForm(false)}
                  className="bg-gray-800 text-white px-4 py-2 rounded"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {users.map((user) => (
          <div key={user.id} className="border p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {user.profileImage ? (
                  <img 
                    src={user.profileImage} 
                    alt="Profile" 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                    <span>بدون عکس</span>
                  </div>
                )}
                <div>
                  <h3 className="font-bold">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p>کد ملی: {user.nationalCode}</p>
                  <p>نام پدر: {user.fatherName}</p>
                  <p>نقش: {user.role === 'ADMIN' ? 'مدیر' : 'کاربر'}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <label className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer">
                  آپلود عکس
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
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;