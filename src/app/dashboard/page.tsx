"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { reportCardApi } from '@/services/api';


// تعریف تایپ‌ها
interface UserReportCard {
  id: number;
  title: string;
  filePath: string;
  description?: string;
  uploadedAt: string;
}

interface User {
  id: number;
  nationalCode: string;
  firstName: string;
  lastName: string;
  fatherName: string;
  profileImage?: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

// کامپوننت ImageModal
const ImageModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
}> = ({ isOpen, onClose, imageUrl, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-4xl max-h-full">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white text-2xl hover:text-gray-300 transition duration-200"
        >
          ✕ بستن
        </button>
        
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="p-4 bg-gray-800 text-white">
            <h3 className="text-lg font-bold">{title}</h3>
          </div>
          
          <div className="flex justify-center items-center bg-black">
            <img 
              src={imageUrl} 
              alt={title}
              className="max-w-full max-h-96 object-contain"
            />
          </div>
          
          <div className="p-4 bg-gray-100 flex justify-between">
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
            >
              بستن
            </button>
            <a
              href={imageUrl}
              download={title}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
            >
              دانلود عکس
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// کامپوننت کارت اطلاعات
const InfoCard: React.FC<{ title: string; value: string }> = ({ title, value }) => (
  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
    <div className="text-sm font-medium text-gray-500 mb-1">{title}</div>
    <div className="text-lg font-bold text-gray-800">{value}</div>
  </div>
);

// کامپوننت کارت آمار
const StatCard: React.FC<{ 
  title: string; 
  value: string | number; 
  icon: string; 
  color: 'blue' | 'green' | 'purple' | 'orange';
}> = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold text-gray-800">{value}</div>
          <div className="text-sm text-gray-600 mt-1">{title}</div>
        </div>
        <div className={`w-12 h-12 ${colorClasses[color]} rounded-full flex items-center justify-center text-white text-xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// کامپوننت آیتم کارنامه
const ReportCardItem: React.FC<{ 
  reportCard: UserReportCard; 
  index: number;
  onPreview: () => void;
  onDownload: () => void;
  onImagePreview: (url: string, title: string) => void;
}> = ({ reportCard, index, onPreview, onDownload, onImagePreview }) => {
  const isImage = reportCard.filePath.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/);
  const isPDF = reportCard.filePath.toLowerCase().endsWith('.pdf');
  const fileExtension = reportCard.filePath.split('.').pop()?.toUpperCase() || 'FILE';

  const getFileIcon = () => {
    if (isImage) return '🖼️';
    if (isPDF) return '📕';
    return '📄';
  };

  const getFileType = () => {
    if (isImage) return 'عکس';
    if (isPDF) return 'PDF';
    return 'فایل';
  };

  return (
    <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* آیکون فایل */}
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
            {getFileIcon()}
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {reportCard.title}
            </h3>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1 bg-blue-50 px-2 py-1 rounded">
                <span>📅</span>
                <span>{new Date(reportCard.uploadedAt).toLocaleDateString('fa-IR')}</span>
              </div>
              
              <div className="flex items-center space-x-1 bg-green-50 px-2 py-1 rounded">
                <span>📁</span>
                <span>{getFileType()} ({fileExtension})</span>
              </div>

              {reportCard.description && (
                <div className="flex items-center space-x-1 bg-purple-50 px-2 py-1 rounded">
                  <span>📝</span>
                  <span>{reportCard.description}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <button
            onClick={onPreview}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 flex items-center space-x-2 min-w-32 justify-center"
          >
            <span>👁️</span>
            <span>مشاهده</span>
          </button>
          
          <button
            onClick={onDownload}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200 flex items-center space-x-2 min-w-32 justify-center"
          >
            <span>⬇️</span>
            <span>دانلود</span>
          </button>

          {isImage && (
            <button
              onClick={() => onImagePreview(`http://localhost:3001/${reportCard.filePath}`, reportCard.title)}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition duration-200 flex items-center space-x-2 min-w-32 justify-center"
            >
              <span>🖼️</span>
              <span>نمایش عکس</span>
            </button>
          )}
        </div>
      </div>

      {/* پیش‌نمایش عکس (اگر فایل عکس باشد) */}
      {isImage && (
        <div className="mt-4">
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h4 className="text-sm font-medium text-gray-700 mb-2">پیش‌نمایش:</h4>
            <div className="flex justify-center">
              <img 
                src={`http://localhost:3001/${reportCard.filePath}`} 
                alt={reportCard.title}
                className="max-w-full h-48 object-contain rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow hover:scale-105 duration-200"
                onClick={() => onImagePreview(`http://localhost:3001/${reportCard.filePath}`, reportCard.title)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// کامپوننت اصلی UserDashboard
const UserDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [reportCards, setReportCards] = useState<UserReportCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'reportCards'>('profile');
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);
   const [authChecked, setAuthChecked] = useState(false); // اضافه کردن state جدید
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      console.log('🔍 Checking authentication...');
      
      const userData = sessionStorage.getItem('user');
      const token = sessionStorage.getItem('token');

      console.log('🔍 Token exists:', !!token);
      console.log('🔍 User data exists:', !!userData);

      if (!token || !userData) {
        console.log('❌ No token or user data, redirecting to login');
        router.push('/login');
        return;
      }

      try {
        const userObj = JSON.parse(userData);
        console.log('🔍 User role:', userObj.role);
        
        if (userObj.role === 'ADMIN') {
          console.log('🔍 User is ADMIN, redirecting to admin panel');
          router.push('/admin');
          return;
        }
        
        console.log('✅ User is regular user, setting state...');
        setUser(userObj);
        await loadUserReportCards(userObj.id);
      } catch (error) {
        console.error('❌ Error parsing user data:', error);
        setError('خطا در بارگذاری اطلاعات کاربر');
      } finally {
        setAuthChecked(true);
        setLoading(false);
      }
    };

    checkAuthAndLoadData();
  }, [router]);

  const loadUserReportCards = async (userId: number) => {
    try {
      console.log('📊 Loading report cards for user:', userId);
      
      const reportCardsData = await reportCardApi.getReportCardsByUser(userId);
      console.log('📊 Report cards loaded:', reportCardsData.length);
      
      setReportCards(reportCardsData);
      setError(null);
    } catch (error: any) {
      console.error('❌ Error loading report cards:', error);
      // فقط خطای کارنامه را تنظیم کن، نه خطای کلی
      if (!error.message?.includes('کاربر')) {
        setError('خطا در بارگذاری کارنامه‌ها');
      }
    }
  };

  const handleLogout = () => {
    console.log('🚪 Logging out...');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    router.push('/login');
  };

  const downloadFile = (filePath: string, title: string) => {
    const link = document.createElement('a');
    link.href = `http://localhost:3001/${filePath}`;
    link.download = title;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const previewFile = (filePath: string) => {
    window.open(`http://localhost:3001/${filePath}`, '_blank');
  };

  const openImageModal = (imageUrl: string, title: string) => {
    setSelectedImage({ url: imageUrl, title });
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  if (!authChecked || loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <div className="text-lg text-gray-600">در حال بارگذاری...</div>
        <div className="text-sm text-gray-500 mt-2">لطفاً کمی صبر کنید</div>
      </div>
    </div>
  );
}

if (!user) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="text-4xl mb-4">❌</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">خطا در بارگذاری اطلاعات</h2>
        <p className="text-gray-600 mb-4">مشکلی در بارگذاری اطلاعات کاربر پیش آمده است.</p>
        <button
          onClick={() => router.push('/login')}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          بازگشت به صفحه ورود
        </button>
      </div>
    </div>
  );
}

  // محاسبه آمار
  const totalReportCards = reportCards.length;
  const recentReportCards = reportCards.filter(rc => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return new Date(rc.uploadedAt) > oneMonthAgo;
  }).length;
  const firstReportCardDate = reportCards.length > 0 ? 
    new Date(reportCards[reportCards.length - 1].uploadedAt).toLocaleDateString('fa-IR') : 
    '---';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* هدر */}
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold mr-3">
                  🎓
                </div>
                <h1 className="text-xl font-bold text-gray-800">پنل کاربری دانش‌آموز</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-700">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500">کد ملی: {user.nationalCode}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200 flex items-center space-x-2"
              >
                <span>🚪</span>
                <span>خروج</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* تب‌ها */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-4 font-medium text-lg border-b-2 transition duration-200 ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              👤 اطلاعات شخصی
            </button>
            <button
              onClick={() => setActiveTab('reportCards')}
              className={`px-6 py-4 font-medium text-lg border-b-2 transition duration-200 ${
                activeTab === 'reportCards'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              📚 کارنامه‌های من ({totalReportCards})
            </button>
          </div>
        </div>
      </div>

      {/* محتوا */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
            <div>
              <strong>خطا:</strong> {error}
            </div>
            <button 
              onClick={() => setError(null)}
              className="text-red-700 hover:text-red-900 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* کارت اطلاعات شخصی */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="ml-2">👤</span>
                اطلاعات شخصی
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <div className="w-28 h-28 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-xl">
                      {user.profileImage ? (
                        <img 
                          src={`http://localhost:3001${user.profileImage}`} 
                          alt="Profile" 
                          className="w-26 h-26 rounded-full object-cover border-4 border-white shadow-md"
                        />
                      ) : (
                        <span className="text-white text-3xl font-bold">
                          {user.firstName[0]}{user.lastName[0]}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-gray-600 bg-blue-50 px-3 py-1 rounded-full text-sm inline-block">
                        دانش‌آموز
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoCard title="کد ملی" value={user.nationalCode} />
                    <InfoCard title="نام پدر" value={user.fatherName} />
                     
                    <InfoCard title="وضعیت حساب" value="فعال ✅" />
                  </div>
                </div>
              </div>
            </div>

            {/* آمار سریع */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard 
                title="تعداد کارنامه‌ها" 
                value={totalReportCards} 
                icon="📊"
                color="blue"
              />
              <StatCard 
                title="کارنامه‌های اخیر" 
                value={recentReportCards} 
                icon="🆕"
                color="green"
              />
              <StatCard 
                title="اولین کارنامه" 
                value={firstReportCardDate} 
                icon="📅"
                color="purple"
              />
            </div>
          </div>
        )}

        {activeTab === 'reportCards' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <span className="ml-2">📚</span>
                  کارنامه‌های من
                </h2>
                <div className="text-sm text-gray-500">
                  {totalReportCards} کارنامه
                </div>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <div className="text-4xl mb-4">⏳</div>
                    <div className="text-lg text-gray-600">در حال بارگذاری کارنامه‌ها...</div>
                  </div>
                </div>
              ) : reportCards.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">هیچ کارنامه‌ای یافت نشد</h3>
                  <p className="text-gray-500">هنوز هیچ کارنامه‌ای برای شما ثبت نشده است.</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {reportCards.map((reportCard, index) => (
                    <ReportCardItem 
                      key={reportCard.id}
                      reportCard={reportCard}
                      index={index}
                      onPreview={() => previewFile(reportCard.filePath)}
                      onDownload={() => downloadFile(reportCard.filePath, reportCard.title)}
                      onImagePreview={openImageModal}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal نمایش عکس */}
      {selectedImage && (
        <ImageModal
          isOpen={!!selectedImage}
          onClose={closeImageModal}
          imageUrl={selectedImage.url}
          title={selectedImage.title}
        />
      )}
    </div>
  );
};

export default UserDashboard;