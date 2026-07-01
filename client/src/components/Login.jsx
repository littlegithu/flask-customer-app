import { useState } from 'react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: '', type: '' });
    const result = await onLogin(email, password);
    if (result.success) {
      setMsg({ text: 'Login successful!', type: 'success' });
      setEmail('');
      setPassword('');
    } else {
      setMsg({ text: result.error?.error || 'Login failed', type: 'error' });
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Enter email address" className="w-full px-4 py-2 border rounded-lg" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter password" className="w-full px-4 py-2 border rounded-lg" />
        {msg.text && (
          <div className={`p-3 rounded text-sm ${msg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {msg.text}
          </div>
        )}
        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg disabled:bg-blue-300">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
