import React from 'react';
import { usePayablesReceivables } from '../contexts/payables-receivables-context';

const PayablesReceivablesTable: React.FC = () => {
  const {
    payables,
    receivables,
    addPayable,
    editPayable,
    deletePayable,
    addReceivable,
    editReceivable,
    deleteReceivable,
  } = usePayablesReceivables();

  // Example UI: Table for payables and receivables
  return (
    <div className="grid grid-cols-2 gap-8">
      <div>
        <h2 className="font-bold text-lg mb-2">Payables</h2>
        <table className="w-full border">
          <thead>
            <tr>
              <th>Label</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payables.map(p => (
              <tr key={p.id}>
                <td>{p.label}</td>
                <td>{p.amount}</td>
                <td>{p.dueDate}</td>
                <td>
                  <button onClick={() => deletePayable(p.id)} className="text-red-500">Delete</button>
                  {/* Add edit/view buttons as needed */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h2 className="font-bold text-lg mb-2">Receivables</h2>
        <table className="w-full border">
          <thead>
            <tr>
              <th>Label</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {receivables.map(r => (
              <tr key={r.id}>
                <td>{r.label}</td>
                <td>{r.amount}</td>
                <td>{r.dueDate}</td>
                <td>
                  <button onClick={() => deleteReceivable(r.id)} className="text-red-500">Delete</button>
                  {/* Add edit/view buttons as needed */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayablesReceivablesTable;
