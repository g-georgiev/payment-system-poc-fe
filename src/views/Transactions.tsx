import React, { useState, useEffect } from 'react';
import api from '../utils/api';

interface Transaction {
    uuid: string;
    transactionType: string;
    status: 'APPROVED' | 'REVERSED' | 'REFUNDED' | 'ERROR';
    creationDate: string;
    customerEmail: string;
    customerPhone: string;
    amount: number;
}

const Transactions: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [newTransaction, setNewTransaction] = useState({
        transactionType: 'AUTHORIZE',
        referenceId: '',
        customerEmail: '',
        customerPhone: '',
        amount: 0,
        merchantId: JSON.parse(localStorage.getItem("merchant") as string).data.id
    });

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await api.get('/transaction/merchant/current');
            setTransactions(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    const handleCreateTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/transaction', newTransaction);
            fetchTransactions();
            setNewTransaction({
                transactionType: 'AUTHORIZE',
                referenceId: '',
                customerEmail: '',
                customerPhone: '',
                amount: 0,
                merchantId: JSON.parse(localStorage.getItem("merchant") as string).data.id
            });
        } catch (error) {
            console.error('Error creating transaction:', error);
        }
    };


    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Transactions</h1>
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-2">Create New Transaction</h2>
                <form onSubmit={handleCreateTransaction} className="space-y-4">
                    <div>
                        <label className="block mb-1">Transaction Type</label>
                        <select
                            className="w-full px-3 py-2 border rounded"
                            value={newTransaction.transactionType}
                            onChange={(e) => setNewTransaction({ ...newTransaction, transactionType: e.target.value })}
                        >
                            <option value="AUTHORIZE">Authorize</option>
                            <option value="CHARGE">Charge</option>
                            <option value="REFUND">Refund</option>
                            <option value="REVERSAL">Reversal</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-1">Reference transaction uuid</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded"
                            value={newTransaction.referenceId}
                            onChange={(e) => setNewTransaction({ ...newTransaction, referenceId: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Customer Email</label>
                        <input
                            type="email"
                            className="w-full px-3 py-2 border rounded"
                            value={newTransaction.customerEmail}
                            onChange={(e) => setNewTransaction({ ...newTransaction, customerEmail: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Customer Phone</label>
                        <input
                            type="tel"
                            className="w-full px-3 py-2 border rounded"
                            value={newTransaction.customerPhone}
                            onChange={(e) => setNewTransaction({ ...newTransaction, customerPhone: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Amount</label>
                        <input
                            type="number"
                            className="w-full px-3 py-2 border rounded"
                            value={newTransaction.amount}
                            onChange={(e) => setNewTransaction({ ...newTransaction, amount: parseFloat(e.target.value) })}
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Create Transaction
                    </button>
                </form>
            </div>
            <h2 className="text-xl font-bold mb-2">Transaction History</h2>
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                <tr>
                    <th className="px-4 py-2">UUID</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Customer Email</th>
                    <th className="px-4 py-2">Customer Phone</th>
                    <th className="px-4 py-2">Amount</th>
                </tr>
                </thead>
                <tbody>
                {transactions.map((transaction) => (
                    <tr key={transaction.uuid}>
                        <td className="border px-4 py-2">{transaction.uuid}</td>
                        <td className="border px-4 py-2">{transaction.transactionType}</td>
                        <td className="border px-4 py-2">{transaction.status}</td>
                        <td className="border px-4 py-2">{new Date(transaction.creationDate).toLocaleString()}</td>
                        <td className="border px-4 py-2">{transaction.customerEmail}</td>
                        <td className="border px-4 py-2">{transaction.customerPhone}</td>
                        <td className="border px-4 py-2">{transaction.amount}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Transactions;