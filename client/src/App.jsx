import { useState, useEffect } from 'react';
import CustomerForm from './components/CustomerForm';
import CustomerList from './components/CustomerList';
import Login from './components/Login';

const SERVER_URL = 'http://localhost:5000';

function App() {
  const [customers, setCustomers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/customers`);
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const checkLoginStatus = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/cookies`);
      if (res.ok) {
        const data = await res.json();
        setIsLoggedIn(data.logged_in === 'true');
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchCustomers();
    checkLoginStatus();
  }, []);

  const addCustomer = async (customerData) => {
    try {
      const res = await fetch(`${SERVER_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData),
      });
      if (res.ok) {
        const newC = await res.json();
        setCustomers([...customers, newC]);
        return { success: true };
      }
      const err = await res.json();
      return { success: false, error: err };
    } catch (err) {
      return { success: false, error: { error: err.message } };
    }
  };

  const deleteCustomer = async (id) => {
    try {
      const res = await fetch(`${SERVER_URL}/customers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCustomers(customers.filter(c => c.id !== id));
      }
    } catch (err) { console.error(err); }
  };

  const handleLogin = async (email, password) => {
    try {
      const res = await fetch(`${SERVER_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        setIsLoggedIn(true);
        return { success: true };
      }
      const err = await res.json();
      return { success: false, error: err };
    } catch (err) {
      return { success: false, error: { error: err.message } };
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${SERVER_URL}/logout`, { method: 'POST' });
      setIsLoggedIn(false);
    } catch (err) { console.error(err); }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Customer Management</h1>
          {isLoggedIn ? (
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">
              Logout
            </button>
          ) : (
            <span className="text-gray-500">Not logged in</span>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {!isLoggedIn ? (
              <Login onLogin={handleLogin} />
            ) : (
              <CustomerForm onAddCustomer={addCustomer} />
            )}
          </div>
          <div>
            <CustomerList customers={customers} onDelete={deleteCustomer} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
