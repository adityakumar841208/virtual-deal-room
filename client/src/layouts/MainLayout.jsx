import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/dashboard/navbar';
import Footer from '../components/dashboard/footer';

export default function MainLayout() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Header Section */}
            <header className="sticky top-0 z-50 w-full">
                <Navbar />
            </header>

            {/* Main Content */}
            <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-8 mt-16">
                {/* Page-specific content will be rendered here */}
                <Outlet />
            </main>

            {/* Footer Section */}
            <footer className="w-full bg-white shadow-inner">
                <Footer />
            </footer>
        </div>
    );
}