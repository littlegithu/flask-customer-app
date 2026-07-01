export default function CustomerList({ customers, onDelete }) {
  if (customers.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Customers</h2>
        <p className="text-gray-500 text-center py-8">No customers found</p>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Customers ({customers.length})</h2>
      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {customers.map(c => (
          <div key={c.id} className="border rounded-lg p-4 hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{c.first_name} {c.last_name}</h3>
                <p className="text-gray-600 text-sm">{c.email}</p>
                <p className="text-gray-600 text-sm">{c.phone}</p>
              </div>
              <button onClick={() => onDelete(c.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
