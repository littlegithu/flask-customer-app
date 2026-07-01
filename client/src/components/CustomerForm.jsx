import { useState } from 'react';

export default function CustomerForm({ onAddCustomer }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg({ text: '', type: '' });
    const result = await onAddCustomer(form);
    if (result.success) {
      setMsg({ text: 'Customer added!', type: 'success' });
      setForm({ firstName: '', lastName: '', email: '', phone: '' });
    } else {
      setMsg({ text: result.error?.error || 'Error adding customer', type: 'error' });
    }
    setSubmitting(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Customer Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
        <input type="text" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
        <input type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
        <input type="tel" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
        {msg.text && (
          <div className={`p-3 rounded text-sm ${msg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {msg.text}
          </div>
        )}
        <button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg disabled:bg-blue-300">
          {submitting ? 'Adding...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
