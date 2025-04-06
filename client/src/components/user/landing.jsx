import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { BiPlus, BiSearchAlt, BiFilter, BiSortAlt2, BiCheck, BiX } from 'react-icons/bi';

export default function Landing() {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [showAddDealModal, setShowAddDealModal] = useState(false);
    const [expandedPostId, setExpandedPostId] = useState(null);
    const [bidAmount, setBidAmount] = useState('');
    const [bidMessage, setBidMessage] = useState('');
    const [commentMap, setCommentMap] = useState({});
    const navigate = useNavigate();
    const { state } = useAppContext();

    useEffect(() => {
        // Fetch deals from backend
        const fetchDeals = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:3000/api/post/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch deals');
                }

                const data = await response.json();
                console.log(data);
                setDeals(data.posts || []);
            } catch (error) {
                console.error('Error fetching deals:', error);
                // Use sample data for demonstration if fetch fails
                setDeals(sampleDeals);
            } finally {
                setLoading(false);
            }
        };

        fetchDeals();
    }, []);

    const handleDealAction = async (dealId, action) => {
        try {
            const response = await fetch(`http://localhost:3000/api/post/${dealId}/${action}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`Failed to ${action} deal`);
            }

            // Update local state based on action
            setDeals(prevDeals =>
                prevDeals.map(deal =>
                    deal._id === dealId
                        ? { ...deal, status: action === 'accept' ? 'accepted' : 'rejected' }
                        : deal
                )
            );

        } catch (error) {
            console.error(`Error ${action}ing deal:`, error);
        }
    };

    const filteredDeals = deals.filter(deal => {
        const matchesSearch =
            deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            deal.description.toLowerCase().includes(searchTerm.toLowerCase());

        if (filter === 'all') return matchesSearch;
        return matchesSearch && deal.status === filter;
    });

    // Function to get appropriate status badge styling
    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'accepted':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Add this function to handle comment input changes
    const handleCommentChange = (dealId, comment) => {
        setCommentMap({
            ...commentMap,
            [dealId]: comment
        });
    };

    // Add this function to your Landing component to handle starting a chat
    const startChat = async (recipientId, dealTitle) => {
        try {
            const user = localStorage.getItem('user');
            const parsedUser = JSON.parse(user);

            const body = {
                title: `Chat about ${dealTitle}`,
                participants: [parsedUser.id, recipientId]
            };

            // Call your backend API to create or get existing chat
            const response = await fetch('http://localhost:3000/api/chat/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to start chat');
            }

            const data = await response.json();

            // Navigate to the chat with this user
            navigate(`/messages/${data.chatId}`);
        } catch (error) {
            console.error('Error starting chat:', error);
            alert('Failed to start chat. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            {/* Header */}
            <header className="bg-white shadow-sm py-6 mb-6">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h1 className="text-2xl font-bold text-gray-800">Deal Room</h1>

                        <div className="flex flex-col sm:flex-row gap-3 flex-grow md:justify-end">
                            <div className="relative flex-grow max-w-md">
                                <input
                                    type="text"
                                    placeholder="Search deals..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <BiSearchAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            </div>

                            <div className="flex gap-2">
                                <div className="relative">
                                    <select
                                        value={filter}
                                        onChange={(e) => setFilter(e.target.value)}
                                        className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="published">Published</option>
                                        <option value="draft">Draft</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                    <BiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <BiSortAlt2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                </div>

                                <button
                                    onClick={() => setShowAddDealModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-200"
                                >
                                    <BiPlus size={20} />
                                    <span>New Deal</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <div className="container mx-auto px-4">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <>
                        {filteredDeals.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 17.5a5.5 5.5 0 100-11 5.5 5.5 0 000 11z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-medium text-gray-600 mb-2">No deals found</h2>
                                <p className="text-gray-500 mb-6">Try changing your search or filter criteria</p>
                                <button
                                    onClick={() => setShowAddDealModal(true)}
                                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-200"
                                    aria-label="Create a new deal"
                                >
                                    Create a new deal
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {filteredDeals.map((deal) => {
                                    return (
                                        <div
                                            key={deal._id}
                                            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all p-3"
                                        >
                                            <div className="flex flex-col">
                                                {/* Card header with image */}
                                                <div className="relative">
                                                    <div className="relative h-64 bg-gray-200">
                                                        {deal.image ? (
                                                            <img
                                                                src={deal.image}
                                                                alt={deal.title || "Deal image"}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex items-center justify-center h-full bg-gray-100">
                                                                <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full border ${getStatusBadge(deal.status)}`}>
                                                            {deal.status?.charAt(0).toUpperCase() + deal.status?.slice(1) || 'Unknown'}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Card body */}
                                                <div className="p-5">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h2 className="text-xl font-semibold text-gray-800 line-clamp-2">{deal.title}</h2>
                                                        {deal.isDeal && (
                                                            <span className="text-xl font-bold text-green-600">
                                                                ${(deal.initialPrice || 0).toLocaleString()}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="text-sm text-gray-500 mb-2">
                                                        Posted by {deal.author?.name || 'Unknown'} • {new Date(deal.createdAt).toLocaleDateString()}
                                                    </div>

                                                    <p className="text-gray-600 mb-4 line-clamp-3">
                                                        {deal.description}
                                                    </p>

                                                    {/* Tags */}
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {deal.tags && deal.tags.map((tag, index) => {
                                                            // Handle different tag formats
                                                            let tagText = tag;
                                                            try {
                                                                if (typeof tag === 'string' && tag.startsWith('[')) {
                                                                    const parsed = JSON.parse(tag);
                                                                    tagText = parsed[0] || tag;
                                                                }
                                                            } catch (e) {
                                                                console.error('Error parsing tag:', e);
                                                            }

                                                            return (
                                                                <span
                                                                    key={index}
                                                                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                                                                >
                                                                    {tagText}
                                                                </span>
                                                            );
                                                        })}
                                                    </div>


                                                    {/* Action buttons for collapsed view */}
                                                    <>
                                                        {/* Check if current user is the post author using both context and localStorage */}
                                                        {(() => {
                                                            // Try to get user from context first
                                                            let currentUser = state.user;

                                                            // If context user is not available, try localStorage
                                                            if (!currentUser) {
                                                                try {
                                                                    const localStorageUser = localStorage.getItem('user');
                                                                    if (localStorageUser) {
                                                                        currentUser = JSON.parse(localStorageUser);
                                                                    }
                                                                } catch (error) {
                                                                    console.error("Error reading user from localStorage:", error);
                                                                }
                                                            }

                                                            // Check if user is the author
                                                            const isAuthor = currentUser && deal.author &&
                                                                (currentUser.email === deal.author.email);

                                                            return isAuthor ? (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        navigate(`/edit-post/${deal._id}`);
                                                                    }}
                                                                    className="w-full px-4 py-2 mb-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2"
                                                                    aria-label="Manage your post"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                    </svg>
                                                                    Your Post
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        startChat(deal.author?._id, deal.title);
                                                                    }}
                                                                    className="w-full px-4 py-2 mb-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition duration-200 flex items-center justify-center gap-2"
                                                                    aria-label={`Contact ${deal.author?.name || 'owner'}`}
                                                                    disabled={!deal.author?._id}
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                                    </svg>
                                                                    Contact Owner
                                                                </button>
                                                            );
                                                        })()}
                                                    </>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Add Deal Modal */}
            {showAddDealModal && (
                <AddDealModal onClose={() => setShowAddDealModal(false)} />
            )}
        </div>
    );
}

// Sample data in case API fails
const sampleDeals = [
    {
        _id: '1',
        title: 'Commercial Property Investment Opportunity',
        description: 'Prime location commercial property with existing tenants. High yield investment opportunity in a growing business district.',
        initialPrice: 1250000,
        author: { name: 'John Smith', email: 'john@example.com' },
        status: 'published',
        createdAt: '2025-03-15T09:24:00',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
        tags: ['Commercial', 'Investment', 'High Yield'],
        isDeal: true,
        dealStatus: 'open'
    },
];

// Add Deal Modal Component
const AddDealModal = ({ onClose }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        initialPrice: '',
        tags: '',
        image: null,
        isDeal: false, // Add this field
    });
    const [previewUrl, setPreviewUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const { state } = useAppContext();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                image: file
            });

            // Create preview URL
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate form
        if (!formData.title.trim()) {
            setError('Title is required');
            return;
        }

        if (!formData.description.trim()) {
            setError('Description is required');
            return;
        }

        // Only validate price if it's a deal
        if (formData.isDeal && (!formData.initialPrice || isNaN(parseFloat(formData.initialPrice)))) {
            setError('Valid price is required for deals');
            return;
        }

        setIsSubmitting(true);

        try {
            // Convert tags string to array
            const tagsArray = formData.tags
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0);

            // Create form data for file upload
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('initialPrice', parseFloat(formData.initialPrice || 0));
            formDataToSend.append('tags', JSON.stringify(tagsArray));
            formDataToSend.append('isDeal', formData.isDeal);

            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            const response = await fetch('http://localhost:3000/api/post', {
                method: 'POST',
                body: formDataToSend,
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create post');
            }

            // Close modal and refresh deals list
            onClose();
            window.location.reload(); // Refresh to show the new post

        } catch (error) {
            console.error('Error creating post:', error);
            setError(error.message || 'Failed to create post. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 overflow-hidden">
                <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Create New {formData.isDeal ? 'Deal' : 'Post'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="flex items-center gap-2 text-gray-700 text-sm font-medium mb-2">
                            <input
                                type="checkbox"
                                name="isDeal"
                                checked={formData.isDeal}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            Create as Deal (includes pricing and bidding)
                        </label>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="title">
                            {formData.isDeal ? 'Deal Title*' : 'Post Title*'}
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={`Enter ${formData.isDeal ? 'deal' : 'post'} title`}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="description">
                            Description*
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={`Describe your ${formData.isDeal ? 'deal' : 'post'} in detail`}
                            rows="4"
                        />
                    </div>

                    {formData.isDeal && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="initialPrice">
                                Price ($)*
                            </label>
                            <input
                                type="text"
                                id="initialPrice"
                                name="initialPrice"
                                value={formData.initialPrice}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter price"
                            />
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="tags">
                            Tags (comma separated)
                        </label>
                        <input
                            type="text"
                            id="tags"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. Real Estate, Investment, Commercial"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="image">
                            Image*
                        </label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {previewUrl && (
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Image Preview
                            </label>
                            <div className="relative h-48 border border-gray-200 rounded-md overflow-hidden">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPreviewUrl('');
                                        setFormData({
                                            ...formData,
                                            image: null
                                        });
                                    }}
                                    className="absolute top-2 right-2 bg-white p-1 rounded-full shadow"
                                >
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? 'Creating...' : `Create ${formData.isDeal ? 'Deal' : 'Post'}`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};





