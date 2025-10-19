"use client";

import React, { useState, useEffect } from 'react';
import { ReportCard, User, CreateReportCardRequest } from '../types/user';
import { reportCardApi, userApi } from '../services/api';

const ReportCardManagement: React.FC = () => {
  const [reportCards, setReportCards] = useState<ReportCard[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newReportCard, setNewReportCard] = useState<CreateReportCardRequest>({
    userId: 0,
    title: '',
    description: '',
    uploadedBy: 1,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReportCards();
    loadUsers();
  }, []);

  const loadReportCards = async () => {
    try {
      const reportCardsData = await reportCardApi.getReportCards();
      setReportCards(reportCardsData);
    } catch (error) {
      console.error('Error loading report cards:', error);
      setError('خطا در بارگذاری کارنامه‌ها');
    }
  };

  const loadUsers = async () => {
    try {
      const usersData = await userApi.getUsers();
      setUsers(usersData);
      console.log('Users loaded:', usersData);
    } catch (error) {
      console.error('Error loading users:', error);
      setError('خطا در بارگذاری کاربران');
    }
  };

  const handleUploadReportCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    console.log('Starting upload process...');
    console.log('Selected file:', selectedFile);
    console.log('Report card data:', newReportCard);

    if (!selectedFile) {
      setError('لطفا فایل را انتخاب کنید');
      return;
    }

    if (newReportCard.userId === 0) {
      setError('لطفا کاربر را انتخاب کنید');
      return;
    }

    if (!newReportCard.title.trim()) {
      setError('لطفا عنوان کارنامه را وارد کنید');
      return;
    }

    setLoading(true);

    try {
      console.log('Calling API...');
      const result = await reportCardApi.createReportCard(newReportCard, selectedFile);
      console.log('Upload successful:', result);
      
      setShowUploadForm(false);
      setNewReportCard({
        userId: 0,
        title: '',
        description: '',
        uploadedBy: 1,
      });
      setSelectedFile(null);
      await loadReportCards();
    } catch (error: any) {
      console.error('Upload failed:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.message || 
                          'خطا در آپلود کارنامه';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReportCard = async (reportCardId: number) => {
    try {
      await reportCardApi.deleteReportCard(reportCardId);
      loadReportCards();
    } catch (error) {
      console.error('Error deleting report card:', error);
      setError('خطا در حذف کارنامه');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">مدیریت کارنامه‌ها</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>خطا:</strong> {error}
        </div>
      )}
      
      <button
        onClick={() => setShowUploadForm(true)}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600 disabled:bg-gray-400"
        disabled={loading}
      >
        {loading ? 'در حال آپلود...' : 'آپلود کارنامه جدید'}
      </button>

      {showUploadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">آپلود کارنامه جدید</h2>
            
            <form onSubmit={handleUploadReportCard}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">انتخاب کاربر *</label>
                <select
                  value={newReportCard.userId}
                  onChange={(e) => setNewReportCard({...newReportCard, userId: parseInt(e.target.value)})}
                  className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                  required
                >
                  <option value={0}>-- انتخاب کاربر --</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.firstName} {user.lastName} - {user.nationalCode}
                    </option>
                  ))}
                </select>
              </div>
              
            <select
  value={newReportCard.title}
  onChange={(e) =>
    setNewReportCard({ ...newReportCard, title: e.target.value })
  }
  className="w-full p-2 border rounded mb-2 bg-gray-600 text-white"
  required
>
  <option value="">انتخاب عنوان کارنامه</option>
  <option value="نوبت اول">نوبت اول</option>
  <option value="نوبت دوم">نوبت دوم</option>
  <option value="میانترم">میانترم</option>
  <option value="پایان ترم">پایان ترم</option>
</select>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">توضیحات (اختیاری)</label>
                <textarea
                  placeholder="توضیحات کارنامه"
                  value={newReportCard.description}
                  onChange={(e) => setNewReportCard({...newReportCard, description: e.target.value})}
                  className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                  rows={3}
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">انتخاب فایل *</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setSelectedFile(file);
                    console.log('File selected:', file);
                  }}
                  className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">فرمت‌های مجاز: PDF, JPG, JPEG, PNG (حداکثر 10MB)</p>
              </div>
              
              <div className="flex gap-2 justify-end">
                <button 
                  type="submit" 
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
                  disabled={loading}
                >
                  {loading ? 'در حال آپلود...' : 'آپلود'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowUploadForm(false);
                    setError(null);
                    setSelectedFile(null);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  disabled={loading}
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {reportCards.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            هیچ کارنامه‌ای یافت نشد
          </div>
        ) : (
          reportCards.map((reportCard) => (
            <div key={reportCard.id} className="border p-4 rounded-lg shadow bg-white">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800">{reportCard.title}</h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">دانش‌آموز:</span> {reportCard.user?.firstName} {reportCard.user?.lastName}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">کد ملی:</span> {reportCard.user?.nationalCode}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">تاریخ آپلود:</span> {new Date(reportCard.uploadedAt).toLocaleDateString('fa-IR')}
                    </p>
                    {reportCard.description && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">توضیحات:</span> {reportCard.description}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 mr-4">
                  <a
                    href={`http://localhost:3001/${reportCard.filePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 text-sm"
                  >
                    مشاهده فایل
                  </a>
                  <button
                    onClick={() => handleDeleteReportCard(reportCard.id)}
                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 text-sm"
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReportCardManagement;