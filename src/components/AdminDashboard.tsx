//components/admindashboard.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardStats, User, ReportCard } from '../types/dashboard';
import { userApi, reportCardApi } from '../services/api';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalReportCards: 0,
    recentUsers: [],
    recentReportCards: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = sessionStorage.getItem('token');
      const userData = sessionStorage.getItem('user');
      
      console.log('🔑 Dashboard - Token from sessionStorage:', token ? `YES (length: ${token.length})` : 'NO');
      console.log('👤 Dashboard - User data from sessionStorage:', userData ? 'YES' : 'NO');

      if (!token) {
        setError('توکن احراز هویت یافت نشد. لطفاً دوباره وارد شوید.');
        router.push('/login');
        return;
      }

      console.log('📊 Dashboard - Loading users and report cards...');

      const [users, reportCards] = await Promise.all([
        userApi.getUsers(),
        reportCardApi.getReportCards()
      ]);

      console.log('📊 Dashboard - Users loaded:', users.length);
      console.log('📊 Dashboard - Report cards loaded:', reportCards.length);

      setStats({
        totalUsers: users.length,
        totalReportCards: reportCards.length,
        recentUsers: users.slice(0, 5),
        recentReportCards: reportCards.slice(0, 5),
      });

      console.log('✅ Dashboard - Data loaded successfully');

    } catch (error: any) {
      console.error('❌ Dashboard - Error loading data:', error);
      setError(error.message || 'خطا در بارگذاری داده‌ها');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    loadDashboardData();
  };

  const handleLogout = () => {
    console.log('🚪 Logging out...');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">داشبورد مدیریت</h1>
        <div className="flex justify-center items-center h-40">
          <div className="text-lg text-gray-600">در حال بارگذاری...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">داشبورد مدیریت</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>خطا:</strong> {error}
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleRetry}
            className="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600"
          >
            تلاش مجدد
          </button>
          <button
            onClick={handleLogout}
            className="bg-gray-500 text-black px-4 py-2 rounded hover:bg-gray-600"
          >
            ورود مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">داشبورد مدیریت</h1>
      
      {/* آمار */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">تعداد کاربران</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">تعداد کارنامه‌ها</h3>
          <p className="text-3xl font-bold text-green-600">{stats.totalReportCards}</p>
        </div>
      </div>

      {/* کاربران اخیر */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">کاربران اخیر</h2>
        </div>
        <div className="p-6">
          {stats.recentUsers.length === 0 ? (
            <p className="text-gray-800">هیچ کاربری یافت نشد.</p>
          ) : (
            <div className="space-y-4">
              {stats.recentUsers.map((user: User) => (
                <div key={user.id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                  <div className="flex items-center space-x-4">
                    {user.profileImage ? (
                      <img 
                        src={`http://localhost:3001${user.profileImage}`} 
                        alt="Profile" 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-xs text-gray-600">بدون عکس</span>
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold">{user.firstName} {user.lastName}</h4>
                      <p className="text-sm text-gray-600">کد ملی: {user.nationalCode}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded text-sm ${
                    user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role === 'ADMIN' ? 'مدیر' : 'کاربر'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* کارنامه‌های اخیر */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">کارنامه‌های اخیر</h2>
        </div>
        <div className="p-6">
          {stats.recentReportCards.length === 0 ? (
            <p className="text-gray-800">هیچ کارنامه‌ای یافت نشد.</p>
          ) : (
            <div className="space-y-4">
              {stats.recentReportCards.map((reportCard: ReportCard) => (
                <div key={reportCard.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold">{reportCard.title}</h4>
                      <p className="text-sm text-gray-800">
                        دانش‌آموز: {reportCard.user?.firstName} {reportCard.user?.lastName}
                      </p>
                      <p className="text-sm text-gray-800">
                        تاریخ: {new Date(reportCard.uploadedAt).toLocaleDateString('fa-IR')}
                      </p>
                      {reportCard.description && (
                        <p className="text-sm text-gray-800 mt-1">
                          {reportCard.description}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <a
                        href={`http://localhost:3001/${reportCard.filePath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-500 text-black px-3 py-1 rounded text-sm hover:bg-blue-600"
                      >
                        مشاهده
                      </a>
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

export default AdminDashboard;