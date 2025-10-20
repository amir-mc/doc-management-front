"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardStats, User, ReportCard } from '../types/dashboard';

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
      
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      console.log('Token from localStorage:', token);
      console.log('User data from localStorage:', userData);

      if (!token) {
        setError('توکن احراز هویت یافت نشد. لطفاً دوباره وارد شوید.');
        router.push('/login');
        return;
      }

      // بررسی معتبر بودن توکن
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        
        if (isExpired) {
          setError('توکن منقضی شده است. لطفاً دوباره وارد شوید.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/login');
          return;
        }
      } catch (e) {
        console.error('Error parsing token:', e);
        setError('توکن نامعتبر است. لطفاً دوباره وارد شوید.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      console.log('Making API requests with headers:', headers);

      const [usersRes, reportCardsRes] = await Promise.all([
        fetch('http://localhost:3001/users', { headers }),
        fetch('http://localhost:3001/report-cards', { headers }),
      ]);

      console.log('Users API response status:', usersRes.status);
      console.log('ReportCards API response status:', reportCardsRes.status);

      // بررسی وضعیت پاسخ
      if (usersRes.status === 401) {
        setError('دسترسی غیرمجاز. لطفاً دوباره وارد شوید.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }

      if (!usersRes.ok) {
        throw new Error(`خطا در دریافت کاربران: ${usersRes.status}`);
      }

      if (!reportCardsRes.ok) {
        throw new Error(`خطا در دریافت کارنامه‌ها: ${reportCardsRes.status}`);
      }

      const users = await usersRes.json();
      const reportCards = await reportCardsRes.json();

      console.log('Users data:', users);
      console.log('ReportCards data:', reportCards);

      // اطمینان از اینکه داده‌ها آرایه هستند
      const usersArray: User[] = Array.isArray(users) ? users : [];
      const reportCardsArray: ReportCard[] = Array.isArray(reportCards) ? reportCards : [];

      setStats({
        totalUsers: usersArray.length,
        totalReportCards: reportCardsArray.length,
        recentUsers: usersArray.slice(0, 5),
        recentReportCards: reportCardsArray.slice(0, 5),
      });
    } catch (error: any) {
      console.error('Error loading dashboard data:', error);
      setError(error.message || 'خطا در بارگذاری داده‌ها');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    loadDashboardData();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            تلاش مجدد
          </button>
          <button
            onClick={handleLogout}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
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
            <p className="text-gray-500">هیچ کاربری یافت نشد.</p>
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
            <p className="text-gray-500">هیچ کارنامه‌ای یافت نشد.</p>
          ) : (
            <div className="space-y-4">
              {stats.recentReportCards.map((reportCard: ReportCard) => (
                <div key={reportCard.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold">{reportCard.title}</h4>
                      <p className="text-sm text-gray-600">
                        دانش‌آموز: {reportCard.user?.firstName} {reportCard.user?.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        تاریخ: {new Date(reportCard.uploadedAt).toLocaleDateString('fa-IR')}
                      </p>
                      {reportCard.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {reportCard.description}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <a
                        href={`http://localhost:3001/${reportCard.filePath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
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