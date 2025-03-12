// import React, { useEffect, useState } from "react";
// import { toast } from "react-hot-toast";
// import Header from "../HomePage/Header";
// import { ChatStore } from "../../store/ChatStore";

// const ContractDisplay = ({ contractDetails, createContract }) => {
//     const BASE_URL = "http://localhost:3000";
//     const currentUser = JSON.parse(localStorage.getItem('user'));
//     const [contracts, setContracts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [totalCount, setTotalCount] = useState(0);
    
//     const {
//         messages,
//         isMessageLoading,
//         getMessages,
//         subscribeToNewMessages,
//         unsubscribeFromMessages,
//         setSelectedUser,
//     } = ChatStore();
    
//     // Set selected user for chat (only once)
//     useEffect(() => {
//         if (currentUser) {
//             setSelectedUser(currentUser);
//         }
//     }, []);
    
//     // Fetch contracts from the backend
//     const fetchContracts = async () => {
//         if (!currentUser || !currentUser.id) {
//             toast.error("User not logged in or session missing");
//             console.error("User not logged in or session missing");
//             setLoading(false);
//             return;
//         }
        
//         console.log("Fetching contracts for user ID:", currentUser.id);
        
//         try {
//             // Add cache-busting timestamp and higher limit
//             const response = await fetch(`${BASE_URL}/getUserContracts`, {
//                 method: "GET",
//                 credentials: "include",
//                 headers: {
//                     'Cache-Control': 'no-cache',
//                     'Pragma': 'no-cache'
//                 }
//             });

//             if (!response.ok) {
//                 const errorText = await response.text();
//                 console.error("API error:", response.status, errorText);
//                 throw new Error(`Failed to fetch contracts: ${response.status}`);
//             }

//             const data = await response.json();
//             console.log("Raw contract data:", JSON.stringify(data)); 
            
//             // Check if we're getting all contracts
//             if (data.contracts) {
//                 // Log each contract to check investor/startup values
//                 data.contracts.forEach((contract, index) => {
//                     console.log(`Contract #${index + 1}:`, {
//                         id: contract._id,
//                         senderId: contract.senderId,
//                         receiverId: contract.receiverId,
//                         isCurrentUserInvestor: contract.senderId === currentUser.id,
//                         isCurrentUserStartup: contract.receiverId === currentUser.id
//                     });
//                 });
                
//                 console.log(`Received ${data.contracts.length} contracts from API`);
                
//                 // Store contracts without filtering
//                 setContracts({ contracts: data.contracts });
//                 setTotalCount(data.contracts.length);
                
//                 if (data.contracts.length > 0) {
//                     toast.success(`Showing ${data.contracts.length} contracts`);
//                 }
//             } else {
//                 console.error("Invalid data structure received:", data);
//                 toast.error("Invalid data received from server");
//             }
//             setLoading(false);
//         } catch (error) {
//             console.error("Error fetching contracts:", error);
//             toast.error(`Failed to fetch contracts: ${error.message}`);
//             setLoading(false);
//         }
//     };

//     // Only fetch contracts once when the component mounts
//     useEffect(() => {
//         // Only fetch if we're on the contracts page
//         if (!window.location.pathname.includes("/chat")) {
//             fetchContracts();
//         } else {
//             setLoading(false);
//         }
//     }, []);

//     // Skip rendering the entire component if we're in chat context
//     if (window.location.pathname.includes("/chat")) {
//         return null;
//     }

//     // Loading state
//     if (loading) {
//         return (
//             <>
//                 <Header />
//                 <div className="flex justify-center items-center h-64">
//                     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//                 </div>
//             </>
//         );
//     }

//     return (
//         <>
//             <Header />
//             <div className="container mx-auto px-4 py-8">
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-2xl font-semibold">Your Contracts ({totalCount})</h2>
//                     <button 
//                         onClick={fetchContracts}
//                         className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
//                     >
//                         Refresh
//                     </button>
//                 </div>
                
//                 {contracts && contracts.contracts && contracts.contracts.length > 0 ? (
//                     <div>
//                         <p className="text-sm text-gray-500 mb-4">Showing {contracts.contracts.length} contracts</p>
//                         {contracts.contracts.map((contract, index) => (
//                             <div key={contract._id || index} className="bg-gray-100 p-4 rounded-lg mb-3 shadow">
//                                 <div className="flex justify-between mb-2">
//                                     <span className="font-medium">Contract #{index + 1}</span>
//                                     <span className={`text-sm px-2 py-1 rounded ${
//                                         contract.isAccepted ? "bg-green-100 text-green-800" : 
//                                         contract.isDeclined ? "bg-red-100 text-red-800" : 
//                                         "bg-blue-100 text-blue-800"
//                                     }`}>
//                                         {contract.isAccepted ? "Accepted" : contract.isDeclined ? "Declined" : "Pending"}
//                                     </span>
//                                 </div>
                                
//                                 {/* Display user role in this contract */}
//                                 <div className="mb-2">
//                                     <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
//                                         {contract.receiverId === currentUser.id ? "You are the Investor" : "You are the Startup"}
//                                     </span>
//                                 </div>

//                                 <div className="grid grid-cols-2 gap-2 mb-3">
//                                     <p><span className="font-medium">Amount:</span> {contract.investmentAmount} ETH</p>
//                                     <p><span className="font-medium">Equity:</span> {contract.equityPercentage}%</p>
//                                     <p><span className="font-medium">Investor:</span> {contract.investor.slice(0, 6)}...{contract.investor.slice(-4)}</p>
//                                     <p><span className="font-medium">Startup:</span> {contract.startup.slice(0, 6)}...{contract.startup.slice(-4)}</p>
//                                     <p><span className="font-medium">Created:</span> {new Date(contract.createdAt).toLocaleDateString()}</p>
//                                     <p><span className="font-medium">Post-Name:</span> {contract.postId}</p>
//                                     {contract.conditions && <p><span className="font-medium">Conditions:</span> {contract.conditions}</p>}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 ) : (
//                     <div className="bg-gray-50 p-8 rounded-lg text-center">
//                         <p className="text-gray-600 mb-4">No contracts found.</p>
//                         <p className="text-sm text-gray-500">When you create or receive contract offers, they will appear here.</p>
//                     </div>
//                 )}
//             </div>
//         </>
//     );
// };

// export default ContractDisplay;



import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Header from "../HomePage/Header";
import { ChatStore } from "../../store/ChatStore";

const ContractDisplay = ({ contractDetails, createContract }) => {
    const BASE_URL = "http://localhost:3000";
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [selectedIdea, setSelectedIdea] = useState(null);
    const [ideaLoading, setIdeaLoading] = useState(false);
    
    const {
        messages,
        isMessageLoading,
        getMessages,
        subscribeToNewMessages,
        unsubscribeFromMessages,
        setSelectedUser,
    } = ChatStore();
    
    // Set selected user for chat (only once)
    useEffect(() => {
        if (currentUser) {
            setSelectedUser(currentUser);
        }
    }, []);
    
    // Fetch contracts from the backend
    const fetchContracts = async () => {
        if (!currentUser || !currentUser.id) {
            toast.error("User not logged in or session missing");
            console.error("User not logged in or session missing");
            setLoading(false);
            return;
        }
        
        console.log("Fetching contracts for user ID:", currentUser.id);
        
        try {
            // Add cache-busting timestamp and higher limit
            const response = await fetch(`${BASE_URL}/getUserContracts`, {
                method: "GET",
                credentials: "include",
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("API error:", response.status, errorText);
                throw new Error(`Failed to fetch contracts: ${response.status}`);
            }

            const data = await response.json();
            console.log("Raw contract data:", JSON.stringify(data)); 
            
            // Check if we're getting all contracts
            if (data.contracts) {
                // Log each contract to check investor/startup values
                data.contracts.forEach((contract, index) => {
                    console.log(`Contract #${index + 1}:`, {
                        id: contract._id,
                        senderId: contract.senderId,
                        receiverId: contract.receiverId,
                        isCurrentUserInvestor: contract.senderId === currentUser.id,
                        isCurrentUserStartup: contract.receiverId === currentUser.id
                    });
                });
                
                console.log(`Received ${data.contracts.length} contracts from API`);
                
                // Store contracts without filtering
                setContracts({ contracts: data.contracts });
                setTotalCount(data.contracts.length);
                
                if (data.contracts.length > 0) {
                    toast.success(`Showing ${data.contracts.length} contracts`);
                }
            } else {
                console.error("Invalid data structure received:", data);
                toast.error("Invalid data received from server");
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching contracts:", error);
            toast.error(`Failed to fetch contracts: ${error.message}`);
            setLoading(false);
        }
    };

    // Fetch post solution by postId
    const fetchPostSolution = async (postId) => {
        if (!postId) {
            toast.error("Post ID is missing");
            return;
        }
        
        setIdeaLoading(true);
        
        try {
            const response = await fetch(`${BASE_URL}/getPostSolution/${postId}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("API error:", response.status, errorText);
                throw new Error(`Failed to fetch post solution: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.solution) {
                setSelectedIdea(data.solution);
                toast.success("Idea details loaded successfully");
            } else {
                console.error("Invalid solution data received:", data);
                toast.error("Invalid solution data received from server");
            }
            
            setIdeaLoading(false);
        } catch (error) {
            console.error("Error fetching post solution:", error);
            toast.error(`Failed to fetch idea details: ${error.message}`);
            setIdeaLoading(false);
        }
    };

    // Handle View Idea button click
    const handleViewIdea = (postId) => {
        fetchPostSolution(postId);
    };

    // Close idea modal
    const closeIdeaModal = () => {
        setSelectedIdea(null);
    };

    // Only fetch contracts once when the component mounts
    useEffect(() => {
        // Only fetch if we're on the contracts page
        if (!window.location.pathname.includes("/chat")) {
            fetchContracts();
        } else {
            setLoading(false);
        }
    }, []);

    // Skip rendering the entire component if we're in chat context
    if (window.location.pathname.includes("/chat")) {
        return null;
    }

    // Loading state
    if (loading) {
        return (
            <>
                <Header />
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Your Contracts ({totalCount})</h2>
                    <button 
                        onClick={fetchContracts}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Refresh
                    </button>
                </div>
                
                {contracts && contracts.contracts && contracts.contracts.length > 0 ? (
                    <div>
                        <p className="text-sm text-gray-500 mb-4">Showing {contracts.contracts.length} contracts</p>
                        {contracts.contracts.map((contract, index) => (
                            <div key={contract._id || index} className="bg-gray-100 p-4 rounded-lg mb-3 shadow">
                                <div className="flex justify-between mb-2">
                                    <span className="font-medium">Contract #{index + 1}</span>
                                    <span className={`text-sm px-2 py-1 rounded ${
                                        contract.isAccepted ? "bg-green-100 text-green-800" : 
                                        contract.isDeclined ? "bg-red-100 text-red-800" : 
                                        "bg-blue-100 text-blue-800"
                                    }`}>
                                        {contract.isAccepted ? "Accepted" : contract.isDeclined ? "Declined" : "Pending"}
                                    </span>
                                </div>
                                
                                {/* Display user role in this contract */}
                                <div className="mb-2">
                                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                                        {contract.receiverId === currentUser.id ? "You are the Investor" : "You are the Startup"}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    <p><span className="font-medium">Amount:</span> {contract.investmentAmount} ETH</p>
                                    <p><span className="font-medium">Equity:</span> {contract.equityPercentage}%</p>
                                    <p><span className="font-medium">Investor:</span> {contract.investor.slice(0, 6)}...{contract.investor.slice(-4)}</p>
                                    <p><span className="font-medium">Startup:</span> {contract.startup.slice(0, 6)}...{contract.startup.slice(-4)}</p>
                                    <p><span className="font-medium">Created:</span> {new Date(contract.createdAt).toLocaleDateString()}</p>
                                    <p><span className="font-medium">Post-Name:</span> {contract.postId}</p>
                                    {contract.conditions && <p><span className="font-medium">Conditions:</span> {contract.conditions}</p>}
                                </div>
                                
                                {/* View Idea button for accepted contracts */}
                                {contract.isAccepted && (
                                    <div className="mt-3">
                                        <button 
                                            onClick={() => handleViewIdea(contract.postId)}
                                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                                        >
                                            View Idea
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-50 p-8 rounded-lg text-center">
                        <p className="text-gray-600 mb-4">No contracts found.</p>
                        <p className="text-sm text-gray-500">When you create or receive contract offers, they will appear here.</p>
                    </div>
                )}
                
                {/* Modal for displaying the idea details */}
                {selectedIdea && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Idea Details</h2>
                                <button 
                                    onClick={closeIdeaModal}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                {/* <div>
                                    <h3 className="font-medium text-lg">Problem</h3>
                                    <p>{selectedIdea.problem}</p>
                                </div> */}
                                
                                <div>
                                    <h3 className="font-medium text-lg">Solution</h3>
                                    <p>{selectedIdea.solution}</p>
                                </div>
                                
                                {/* <div>
                                    <h3 className="font-medium text-lg">Solution</h3>
                                    <p>{selectedIdea.solution}</p>
                                </div> */}
                                
                                {selectedIdea.tags && (
                                    <div>
                                        <h3 className="font-medium text-lg">Tags</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedIdea.tags.map((tag, idx) => (
                                                <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {selectedIdea.createdAt && (
                                    <div>
                                        <h3 className="font-medium text-lg">Created</h3>
                                        <p>{new Date(selectedIdea.createdAt).toLocaleString()}</p>
                                    </div>
                                )}
                            </div>
                            
                            <div className="mt-6">
                                <button 
                                    onClick={closeIdeaModal}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Loading overlay for idea fetch */}
                {ideaLoading && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg">
                            <div className="flex items-center space-x-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                <p>Loading idea details...</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ContractDisplay;