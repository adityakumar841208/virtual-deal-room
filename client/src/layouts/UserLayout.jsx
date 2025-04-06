import React from 'react';
import Sidebar from '../components/user/sidebar';
import { Outlet } from 'react-router-dom';
import Navbar2 from '../components/user/navbar2';

export default function DashboardLayout() {
    return (
        <>
            <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 overflow-auto">
                    {/* Main content */}
                    <Navbar2 />
                    <div>
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    );
}