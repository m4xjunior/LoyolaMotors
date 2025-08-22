import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Customers = lazy(() => import('@/pages/Customers'));
const CustomerNew = lazy(() => import('@/pages/CustomerNew'));
const Invoices = lazy(() => import('@/pages/Invoices'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/customers" element={<ProtectedRoute><DashboardLayout><Customers /></DashboardLayout></ProtectedRoute>} />
        <Route path="/customers/new" element={<ProtectedRoute><DashboardLayout><CustomerNew /></DashboardLayout></ProtectedRoute>} />
        <Route path="/invoices" element={<ProtectedRoute><DashboardLayout><Invoices /></DashboardLayout></ProtectedRoute>} />
      </Routes>
    </Suspense>
  );
}