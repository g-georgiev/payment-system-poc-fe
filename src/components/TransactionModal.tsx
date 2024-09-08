import React, { useEffect, useState } from 'react';
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

interface TransactionModalProps {
    merchant: {
        id: number;
        name: string;
    };
    onClose: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ merchant, onClose }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await api.get(`/transaction/merchant/${merchant.id}`);
            setTransactions(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-3/4 shadow-lg rounded-md bg-white">
                <h3 className="text-lg font-bold mb-4">Transactions for {merchant.name}</h3>
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
                <div className="flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionModal;