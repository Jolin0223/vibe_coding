"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // 核心修改：移除API请求，改为纯前端专属账号密码校验
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 你的专属账号密码（只有这组能登录）
    const YOUR_USERNAME = 'Jolin0223';
    const YOUR_PASSWORD = 'fighting2026';

    // 校验逻辑
    if (username === YOUR_USERNAME && password === YOUR_PASSWORD) {
      // 登录成功：标记状态 + 跳转到后台仪表盘
      localStorage.setItem('adminLoggedIn', 'true');
      router.push('/admin/dashboard');
    } else {
      // 登录失败：提示错误，清空密码
      setError('账号或密码错误，无访问权限！');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
       {/* Background Image Layer */}
       <div className="fixed inset-0 z-0">
        <Image
          src="/background.png"
          alt="Background"
          fill
          className="object-cover object-center brightness-50"
        />
      </div>

      <div className="relative z-10 bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-white/20 w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h1>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white focus:outline-none focus:border-purple-500"
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white focus:outline-none focus:border-purple-500"
              placeholder="Enter password"
            />
          </div>
          
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
