import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './views/Login';
import MerchantManagement from './views/MerchantManagement';
import Transactions from './views/Transactions';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

const Unauthorized = () => (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
      <p>You do not have permission to access this page.</p>
    </div>
);

const App: React.FC = () => {
  return (
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <div className="container mx-auto p-4">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                  path="/merchants"
                  element={
                    <ProtectedRoute roles={['ADMIN']}>
                      <MerchantManagement />
                    </ProtectedRoute>
                  }
              />
              <Route
                  path="/transactions"
                  element={
                    <ProtectedRoute roles={['MERCHANT']}>
                      <Transactions />
                    </ProtectedRoute>
                  }
              />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
  );
};

export default App;