"use client";

import React, { useState, useEffect } from 'react';
import { ReportCard, User, CreateReportCardRequest } from '../types/user';
import { reportCardApi, userApi } from '../services/api';

const ReportCardManagement: React.FC = () => {
  const [reportCards, setReportCards] = useState<ReportCard[]>([]);
  const [filteredReportCards, setFilteredReportCards] = useState<ReportCard[]>([]);
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
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadReportCards();
    loadUsers();
  }, []);

  useEffect(() => {
    filterReportCards();
  }, [reportCards, searchTerm]);

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
    } catch (error) {
      console.error('Error loading users:', error);
      setError('خطا در بارگذاری کاربران');
    }
  };

  const filterReportCards = () => {
    if (!searchTerm.trim()) {
      setFilteredReportCards(reportCards);
      return;
    }

    const filtered = reportCards.filter(reportCard =>
      reportCard.title.includes(searchTerm) ||
      reportCard.user?.firstName.includes(searchTerm) ||
      reportCard.user?.lastName.includes(searchTerm) ||
      reportCard.user?.nationalCode.includes(searchTerm) ||
      `${reportCard.user?.firstName} ${reportCard.user?.lastName}`.includes(searchTerm) ||
      reportCard.description?.includes(searchTerm)
    );
    setFilteredReportCards(filtered);
  };

  const handleUploadReportCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!selectedFile) {
      setError('لطفا فایل را انتخاب کنید');
      return;
    }

    if (newReportCard.userId === 0) {
      setError('لطفا کاربر را انتخاب کنید');
      return;
    }

    setLoading(true);

    try {
      await reportCardApi.createReportCard(newReportCard, selectedFile);
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
      console.error('Error uploading report card:', error);
      setError(error.response?.data?.message || 'خطا در آپلود کارنامه');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReportCard = async (reportCardId: number) => {
    if (!confirm('آیا از حذف این کارنامه اطمینان دارید؟')) {
      return;
    }

    try {
      await reportCardApi.deleteReportCard(reportCardId);
      await loadReportCards();
    } catch (error) {
      console.error('Error deleting report card:', error);
      setError('خطا در حذف کارنامه');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">مدیریت کارنامه‌ها</h1>
        <button
          onClick={() => setShowUploadForm(true)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          آپلود کارنامه جدید
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>خطا:</strong> {error}
        </div>
      )}

      {/* جستجو */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="جستجو بر اساس عنوان، نام دانش‌آموز، کد ملی، توضیحات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-2 border rounded focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={filterReportCards}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            جستجو
          </button>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          {filteredReportCards.length} کارنامه یافت شد
        </div>
      </div>

      {/* فرم آپلود */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">آپلود کارنامه جدید</h2>
            <form onSubmit={handleUploadReportCard}>
              <div className="space-y-3">
                <select
                  value={newReportCard.userId}
                  onChange={(e) => setNewReportCard({...newReportCard, userId: parseInt(e.target.value)})}
                  className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                  required
                >
                  <option value={0}>-- انتخاب دانش‌آموز --</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.firstName} {user.lastName} - {user.nationalCode}
                    </option>
                  ))}
                </select>
                
                <input
                  type="text"
                  placeholder="عنوان کارنامه *"
                  value={newReportCard.title}
                  onChange={(e) => setNewReportCard({...newReportCard, title: e.target.value})}
                  className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                  required
                />
                
                <textarea
                  placeholder="توضیحات (اختیاری)"
                  value={newReportCard.description}
                  onChange={(e) => setNewReportCard({...newReportCard, description: e.target.value})}
                  className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                  rows={3}
                />
                
                <div>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    فرمت‌های مجاز: PDF, JPG, JPEG, PNG (حداکثر 10MB)
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
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
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* لیست کارنامه‌ها */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">لیست کارنامه‌ها</h2>
        </div>
        <div className="p-6">
          {filteredReportCards.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'هیچ کارنامه‌ای با مشخصات جستجو شده یافت نشد' : 'هیچ کارنامه‌ای ثبت نشده است'}
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredReportCards.map((reportCard) => (
                <div key={reportCard.id} className="border p-4 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        {/* پیش‌نمایش فایل */}
                        <div className="flex-shrink-0">
                          {reportCard.filePath?.match(/\.(jpg|jpeg|png)$/i) ? (
                            <div className="relative">
                              <img 
                                src={`http://localhost:3001/${reportCard.filePath}`} 
                                alt="Preview" 
                                className="w-16 h-16 object-cover rounded border-2 border-gray-300"
                              />
                              <a
                                href={`http://localhost:3001/${reportCard.filePath}`}
                                download
                                className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full text-xs"
                                title="دانلود فایل"
                              >
                                ⬇️
                              </a>
                            </div>
                          ) : (
                            <div className="w-16 h-16 bg-red-100 rounded border-2 border-red-300 flex items-center justify-center">
                              <span className="text-xs text-red-600">PDF</span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-800">{reportCard.title}</h3>
                          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-gray-600 mt-2">
                            <div>
                              <span className="font-medium">دانش‌آموز:</span> 
                              {reportCard.user?.firstName} {reportCard.user?.lastName}
                            </div>
                            <div>
                              <span className="font-medium">کد ملی:</span> 
                              {reportCard.user?.nationalCode}
                            </div>
                            <div>
                              <span className="font-medium">تاریخ آپلود:</span> 
                              {new Date(reportCard.uploadedAt).toLocaleDateString('fa-IR')}
                            </div>
                            <div>
                              <span className="font-medium">نوع فایل:</span> 
                              {reportCard.filePath?.split('.').pop()?.toUpperCase()}
                            </div>
                          </div>
                          {reportCard.description && (
                            <p className="text-sm text-gray-600 mt-2">
                              <span className="font-medium">توضیحات:</span> {reportCard.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <a
                        href={`http://localhost:3001/${reportCard.filePath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 text-sm"
                      >
                        👁️ مشاهده
                      </a>
                      <a
                        href={`http://localhost:3001/${reportCard.filePath}`}
                        download
                        className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 text-sm"
                      >
                        ⬇️ دانلود
                      </a>
                      <button
                        onClick={() => handleDeleteReportCard(reportCard.id)}
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

export default ReportCardManagement;