import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Secure, Efficient Deal Management Platform</h1>
                    <p className="text-xl md:text-2xl mb-8 opacity-90">Streamline your M&A processes, due diligence, and document management with our advanced virtual deal room solution.</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link to="/signup" className="bg-white text-indigo-600 px-6 py-3 rounded-md font-medium text-lg hover:bg-opacity-90 transition-all">Get Started</Link>
                        <Link to="#" className="border border-white text-white px-6 py-3 rounded-md font-medium text-lg hover:bg-white hover:bg-opacity-10 transition-all hover:text-black">Request Demo</Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Choose Our Virtual Deal Room</h2>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">Bank-Level Security</h3>
                            <p className="text-gray-600">Advanced encryption, multi-factor authentication, and granular access controls keep your sensitive documents secure.</p>
                        </div>
                        
                        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">Efficient Collaboration</h3>
                            <p className="text-gray-600">Real-time collaboration tools, document versioning, and commenting streamline communication between all parties.</p>
                        </div>
                        
                        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">Detailed Analytics</h3>
                            <p className="text-gray-600">Gain insights into user engagement, document interactions, and due diligence progress with comprehensive analytics.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">How Our Virtual Deal Room Works</h2>
                    
                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">1</div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">Setup</h3>
                            <p className="text-gray-600">Create your secure deal room in minutes with our intuitive interface.</p>
                        </div>
                        
                        <div className="text-center">
                            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">2</div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">Upload</h3>
                            <p className="text-gray-600">Easily upload and organize all your deal documents and materials.</p>
                        </div>
                        
                        <div className="text-center">
                            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">3</div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">Collaborate</h3>
                            <p className="text-gray-600">Invite team members and stakeholders to collaborate securely.</p>
                        </div>
                        
                        <div className="text-center">
                            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">4</div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">Close</h3>
                            <p className="text-gray-600">Track progress and successfully close deals with confidence.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-indigo-600 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to Streamline Your Deal Process?</h2>
                    <p className="text-xl mb-8 opacity-90">Join thousands of companies that trust our virtual deal room for their most important transactions.</p>
                    <Link to="/signup" className="bg-white text-indigo-600 px-8 py-3 rounded-md font-medium text-lg hover:bg-opacity-90 transition-all inline-block">Get Started</Link>
                </div>
            </section>
        </div>
    )
}