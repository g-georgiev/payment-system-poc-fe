import React, { useState } from 'react';
import api from '../utils/api';

interface MerchantModalProps {
    onClose: () => void;
    onSave: () => void;
    merchant?: {
        id: number;
        username: string;
        email: string;
        name: string;
        description: string;
        status: 'ACTIVE' | 'INACTIVE';
    };
}

const MerchantModal: React.FC<MerchantModalProps> = ({ onClose, onSave, merchant }) => {
    const [formData, setFormData] = useState({
        username: merchant?.username || '',
        password: '',
        name: merchant?.name || '',
        email: merchant?.email || '',
        description: merchant?.description || '',
        status: merchant?.status || 'ACTIVE',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (merchant) {
                await api.patch(`/merchant/${merchant.id}`, formData);
            } else {
                await api.post('/merchant', formData);
            }
            onSave();
        } catch (error) {
            console.error('Error saving merchant:', error);
        }
    };


    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <h3 className="text-lg font-bold mb-4">{merchant ? 'Edit Merchant' : 'Add Merchant'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1">Username</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                    </div>
                    {!merchant && (
                        <div>
                            <label className="block mb-1">Password</label>
                            <input
                                type="password"
                                className="w-full px-3 py-2 border rounded"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                    )}
                    <div>
                        <label className="block mb-1">Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full px-3 py-2 border rounded"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Description</label>
                        <textarea
                            className="w-full px-3 py-2 border rounded"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Status</label>
                        <select
                            className="w-full px-3 py-2 border rounded"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
                        >
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MerchantModal;