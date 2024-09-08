import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import MerchantModal from '../components/MerchantModal';
import TransactionModal from '../components/TransactionModal';


interface Merchant {
    id: number;
    username: string;
    email: string;
    name: string;
    status: 'ACTIVE' | 'INACTIVE';
    totalTransactionSum: number;
}

const MerchantManagement: React.FC = () => {
    const [merchants, setMerchants] = useState<Merchant[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [sortColumn, setSortColumn] = useState('id');
    const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('ASC');
    const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
    const [showMerchantModal, setShowMerchantModal] = useState(false);
    const [showTransactionModal, setShowTransactionModal] = useState(false);

    useEffect(() => {
        fetchMerchants();
    }, [currentPage, pageSize, sortColumn, sortDirection]);

    const fetchMerchants = async () => {
        try {
            const response = await api.get('/merchant', {
                params: { pageNumber: currentPage, pageSize, sortColumn, sortDirection }
            });
            setMerchants(response.data.merchants);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching merchants:', error);
        }
    };

    const handleSort = (column: string) => {
        if (column === sortColumn) {
            setSortDirection(sortDirection === 'ASC' ? 'DESC' : 'ASC');
        } else {
            setSortColumn(column);
            setSortDirection('ASC');
        }
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const handleMerchantClick = (merchant: Merchant) => {
        setSelectedMerchant(merchant);
        setShowTransactionModal(true);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Merchant Management</h1>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
                onClick={() => setShowMerchantModal(true)}
            >
                Add Merchant
            </button>
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                <tr>
                    <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('id')}>ID</th>
                    <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('username')}>Username</th>
                    <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('email')}>Email</th>
                    <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('name')}>Name</th>
                    <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('status')}>Status</th>
                    <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('totalTransactionSum')}>Total Transaction Sum</th>
                </tr>
                </thead>
                <tbody>
                {merchants.map((merchant) => (
                    <tr key={merchant.id} onClick={() => handleMerchantClick(merchant)} className="cursor-pointer hover:bg-gray-100">
                        <td className="border px-4 py-2">{merchant.id}</td>
                        <td className="border px-4 py-2">{merchant.username}</td>
                        <td className="border px-4 py-2">{merchant.email}</td>
                        <td className="border px-4 py-2">{merchant.name}</td>
                        <td className="border px-4 py-2">{merchant.status}</td>
                        <td className="border px-4 py-2">{merchant.totalTransactionSum}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="mt-4 flex justify-between">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                >
                    Previous
                </button>
                <span>Page {currentPage + 1} of {totalPages}</span>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                >
                    Next
                </button>
            </div>
            {showMerchantModal && (
                <MerchantModal
                    onClose={() => setShowMerchantModal(false)}
                    onSave={() => {
                        setShowMerchantModal(false);
                        fetchMerchants();
                    }}
                />
            )}
            {showTransactionModal && selectedMerchant && (
                <TransactionModal
                    merchant={selectedMerchant}
                    onClose={() => setShowTransactionModal(false)}
                />
            )}
        </div>
    );
};

export default MerchantManagement;