"use client";

import React, { useState } from 'react';
import UserManagement from '../components/UserManagement';
import ReportCardManagement from '../components/ReportCardManagement';

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'reportCards'>('users');

  return (
    <div>
      <div className="bg-gray-100 p-4">
        <div className="container mx-auto">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded ${
                activeTab === 'users' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700'
              }`}
            >
              مدیریت کاربران
            </button>
            <button
              onClick={() => setActiveTab('reportCards')}
              className={`px-4 py-2 rounded ${
                activeTab === 'reportCards' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700'
              }`}
            >
              مدیریت کارنامه‌ها
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto">
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'reportCards' && <ReportCardManagement />}
      </div>
    </div>
  );
};

export default Home;