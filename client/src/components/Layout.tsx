import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

const Layout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token'); // Assuming token is stored here
        navigate('/login');
    };

    const isActive = (path: string) => {
        return location.pathname.startsWith(path)
            ? 'bg-blue-700 text-white'
            : 'text-blue-100 hover:bg-blue-600 hover:text-white';
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-blue-800 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/dashboard" className="flex-shrink-0">
                                <h1 className="text-xl font-bold text-white">ERP System</h1>
                            </Link>
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link
                                    to="/dashboard"
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${isActive('/dashboard')}`}
                                >
                                    대시보드
                                </Link>
                                <Link
                                    to="/year-plans"
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${isActive('/year-plans')}`}
                                >
                                    연간 계획
                                </Link>
                                <Link
                                    to="/month-plans"
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${isActive('/month-plans')}`}
                                >
                                    월간 계획
                                </Link>
                            </div>
                        </div>
                        <div>
                            <button
                                onClick={handleLogout}
                                className="text-blue-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                            >
                                로그아웃
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-white border-t mt-auto">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-gray-500">
                        &copy; 2024 SalesPlan ERP. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
