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
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [merchantToDelete, setMerchantToDelete] = useState<number | null>(null);

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

    const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(event.target.value));
        setCurrentPage(0);
    };

    const handleEditMerchant = (merchant: Merchant) => {
        setSelectedMerchant(merchant);
        setIsEditing(true);
        setShowMerchantModal(true);
    };

    const handleDeleteConfirm = (merchantId: number) => {
        setMerchantToDelete(merchantId);
        setShowDeleteConfirm(true);
    };

    const handleDeleteMerchant = async () => {
        if (merchantToDelete) {
            try {
                await api.delete(`/merchant/${merchantToDelete}`);
                fetchMerchants();
                setShowDeleteConfirm(false);
                setMerchantToDelete(null);
            } catch (error) {
                console.error('Error deleting merchant:', error);
            }
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Merchant Management</h1>
            <div className="flex justify-between mb-4">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                        setSelectedMerchant(null);
                        setIsEditing(false);
                        setShowMerchantModal(true);
                    }}
                >
                    Add Merchant
                </button>
                <div>
                    <label htmlFor="pageSize" className="mr-2">Page Size:</label>
                    <select
                        id="pageSize"
                        value={pageSize}
                        onChange={handlePageSizeChange}
                        className="border rounded p-2"
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>
                </div>
            </div>
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                <tr>
                    <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('id')}>ID</th>
                    <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('username')}>Username</th>
                    <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('email')}>Email</th>
                    <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('name')}>Name</th>
                    <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('status')}>Status</th>
                    <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('totalTransactionSum')}>Total Transaction Sum</th>
                    <th className="px-4 py-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {merchants.map((merchant) => (
                    <tr key={merchant.id} className="hover:bg-gray-100">
                        <td className="border px-4 py-2">{merchant.id}</td>
                        <td className="border px-4 py-2">{merchant.username}</td>
                        <td className="border px-4 py-2">{merchant.email}</td>
                        <td className="border px-4 py-2">{merchant.name}</td>
                        <td className="border px-4 py-2">{merchant.status}</td>
                        <td className="border px-4 py-2">{merchant.totalTransactionSum}</td>
                        <td className="border px-4 py-2">
                            <button
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2"
                                onClick={() => handleMerchantClick(merchant)}
                            >
                                Transactions
                            </button>
                            <button
                                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                                onClick={() => handleEditMerchant(merchant)}
                            >
                                Edit
                            </button>
                            <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                onClick={() => handleDeleteConfirm(merchant.id)}
                            >
                                Delete
                            </button>
                        </td>
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
                    // @ts-ignorex
                    merchant={isEditing ? selectedMerchant : undefined}
                    onClose={() => {
                        setShowMerchantModal(false);
                        setIsEditing(false);
                        setSelectedMerchant(null);
                    }}
                    onSave={() => {
                        setShowMerchantModal(false);
                        setIsEditing(false);
                        setSelectedMerchant(null);
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
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <h3 className="text-lg font-bold">Confirm Delete</h3>
                        <p className="mt-2">Are you sure you want to delete this merchant? This action cannot be undone.
                        You will not be able to delete if the merchant has existing transactions</p>
                        <div className="mt-3 flex justify-end space-x-2">
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                onClick={handleDeleteMerchant}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MerchantManagement;