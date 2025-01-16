import { useState } from 'react';
import { useRouter } from 'next/router';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Env username:', process.env.NEXT_PUBLIC_WEB_USERNAME);  // 调试用
    console.log('Input username:', username);  // 调试用
    
    if (username === process.env.NEXT_PUBLIC_WEB_USERNAME && 
        password === process.env.NEXT_PUBLIC_WEB_PASSWORD) {
      localStorage.setItem('isLoggedIn', 'true');
      window.location.reload();  // 使用 reload 而不是 router.push
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-gray-900 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Login</h2>
        
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:border-gray-600"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:border-gray-600"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}; 