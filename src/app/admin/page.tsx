"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserManagement from '../../components/UserManagement';
import ReportCardManagement from '../../components/ReportCardManagement';
import AdminDashboard from '../../components/AdminDashboard';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'reportCards'>('dashboard');
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const userObj = JSON.parse(userData);
    if (userObj.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    setUser(userObj);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) {
    return <div>در حال بارگذاری...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* نوار بالایی */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">پنل مدیریت</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span>خوش آمدید، {user.firstName} {user.lastName}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                خروج
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* تب‌ها */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-4 font-medium ${
                activeTab === 'dashboard'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              داشبورد
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-4 font-medium ${
                activeTab === 'users'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              مدیریت کاربران
            </button>
            <button
              onClick={() => setActiveTab('reportCards')}
              className={`px-6 py-4 font-medium ${
                activeTab === 'reportCards'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              مدیریت کارنامه‌ها
            </button>
          </div>
        </div>
      </div>

      {/* محتوا */}
      <div className="max-w-7xl mx-auto py-6 px-4">
        {activeTab === 'dashboard' && <AdminDashboard />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'reportCards' && <ReportCardManagement />}
      </div>
    </div>
  );
};

export default AdminPage;