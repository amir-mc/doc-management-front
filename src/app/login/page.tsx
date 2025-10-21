//src/app/login/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Login: React.FC = () => {
  const [nationalCode, setNationalCode] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // پاک کردن توکن قبلی هنگام ورود به صفحه login
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    console.log('🔄 Login page - Cleared previous tokens from sessionStorage');
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🚀 Login attempt started with:', { nationalCode, password });
      
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nationalCode, password }),
      });

      console.log('📨 Login API Response Status:', response.status);
      console.log('📨 Login API Response Headers:', Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log('📨 Login API Response Data:', data);

      if (!response.ok) {
        console.error('❌ Login API Error:', data);
        throw new Error(data.message || `خطا در ورود: ${response.status}`);
      }

      // ذخیره توکن و اطلاعات کاربر در sessionStorage
      console.log('💾 Saving token to sessionStorage...');
 sessionStorage.setItem('token', data.access_token);
sessionStorage.setItem('user', JSON.stringify(data.user));
      // بررسی ذخیره‌سازی
      const savedToken = sessionStorage.getItem('token');
      const savedUser = sessionStorage.getItem('user');
      console.log('✅ Token saved to sessionStorage:', savedToken ? `YES (length: ${savedToken.length})` : 'NO');
      console.log('✅ User data saved to sessionStorage:', savedUser ? 'YES' : 'NO');
      console.log('✅ Saved user data:', savedUser);

      console.log('🔄 Redirecting to admin panel...');

      // استفاده از window.location برای هدایت کامل
      window.location.href = '/admin';

    } catch (error: any) {
      console.error('❌ Login process failed:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            ورود به سیستم
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <strong>خطا:</strong> {error}
            </div>
          )}
          <div>
            <label htmlFor="nationalCode" className="block text-sm font-medium text-gray-700 mb-1">
              کد ملی
            </label>
            <input
              id="nationalCode"
              name="nationalCode"
              type="text"
              required
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="کد ملی"
              value={nationalCode}
              onChange={(e) => setNationalCode(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              رمز عبور
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="رمز عبور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
              {loading ? 'در حال ورود...' : 'ورود'}
            </button>
          </div>
        </form>
        
        {/* اطلاعات تست */}
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">اطلاعات تست:</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <div><strong>ادمین:</strong> 1234567890 / admin123</div>
            <div><strong>کاربر عادی:</strong> 0987654321 / user123</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;