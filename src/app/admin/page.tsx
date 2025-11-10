//src/app/admin/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserManagement from '../../components/UserManagement';
import ReportCardManagement from '../../components/ReportCardManagement';
import AdminDashboard from '../../components/AdminDashboard';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'reportCards'>('dashboard');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log('🔄 Admin page - Checking authentication...');
    
    const userData = sessionStorage.getItem('user');
    const token = sessionStorage.getItem('token');

    console.log('🔍 Admin page - Token from sessionStorage:', token ? `YES (length: ${token.length})` : 'NO');
    console.log('🔍 Admin page - User data from sessionStorage:', userData ? 'YES' : 'NO');

    if (!token || !userData) {
      console.log('❌ Admin page - No token or user data, redirecting to login');
      router.push('/login');
      return;
    }

    try {
      const userObj = JSON.parse(userData);
      console.log('🔍 Admin page - User role:', userObj.role);
      
      if (userObj.role !== 'ADMIN') {
        console.log('❌ Admin page - User is not ADMIN, redirecting to dashboard');
        router.push('/dashboard');
        return;
      }

      console.log('✅ Admin page - Authentication successful');
      setUser(userObj);
    } catch (error) {
      console.error('❌ Admin page - Error parsing user data:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    console.log('🚪 Logging out...');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">در حال بارگذاری...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">خطا در بارگذاری اطلاعات کاربر</div>
      </div>
    );
  }

  console.log('🎯 Admin page - Rendering admin interface');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* نوار بالایی */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">پنل مدیریت</h1>
            </div>
            <div className="flex items-center space-x-4 text-gray-800">
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
      <div className="max-w-7xl mx-auto py-6 px-4 text-gray-800">
        {activeTab === 'dashboard' && <AdminDashboard />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'reportCards' && <ReportCardManagement />}
      </div>
    </div>
  );
};

export default AdminPage;