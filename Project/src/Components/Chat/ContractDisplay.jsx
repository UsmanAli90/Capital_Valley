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
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-50 p-8 rounded-lg text-center">
                        <p className="text-gray-600 mb-4">No contracts found.</p>
                        <p className="text-sm text-gray-500">When you create or receive contract offers, they will appear here.</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default ContractDisplay;