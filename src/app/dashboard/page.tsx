"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const UserDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [reportCards, setReportCards] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const userObj = JSON.parse(userData);
    setUser(userObj);
    loadReportCards(userObj.id);
  }, [router]);

  const loadReportCards = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:3001/report-cards/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setReportCards(data);
    } catch (error) {
      console.error('Error loading report cards:', error);
    }
  };

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
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">پنل کاربری</h1>
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

      <div className="max-w-4xl mx-auto py-6 px-4">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">اطلاعات شخصی</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-medium">نام:</label>
              <p>{user.firstName}</p>
            </div>
            <div>
              <label className="font-medium">نام خانوادگی:</label>
              <p>{user.lastName}</p>
            </div>
            <div>
              <label className="font-medium">کد ملی:</label>
              <p>{user.nationalCode}</p>
            </div>
            <div>
              <label className="font-medium">نام پدر:</label>
              <p>{user.fatherName}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">کارنامه‌های من</h2>
          {reportCards.length === 0 ? (
            <p className="text-gray-500">هیچ کارنامه‌ای یافت نشد.</p>
          ) : (
            <div className="space-y-4">
              {reportCards.map((reportCard) => (
                <div key={reportCard.id} className="border rounded-lg p-4">
                  <h3 className="font-bold text-lg">{reportCard.title}</h3>
                  <p className="text-gray-600">{reportCard.description}</p>
                  <p className="text-sm text-gray-500">
                    تاریخ آپلود: {new Date(reportCard.uploadedAt).toLocaleDateString('fa-IR')}
                  </p>
                  <a
                    href={`http://localhost:3001/${reportCard.filePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    دانلود کارنامه
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;