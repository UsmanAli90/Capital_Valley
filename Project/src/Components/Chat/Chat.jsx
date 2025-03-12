import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatSidebar from "./ChatSidebar1";
import ChatHeader from "./ChatHeader";
import ChatContainer from "./ChatContainer";
import Header from "../HomePage/Header";
import toast from "react-hot-toast";
import Web3 from "web3";
import socket from "./Socket"; // Import Socket.IO client
import ContractDisplay from "./ContractDisplay";

const Chat = () => {
    const BASE_URL = "http://localhost:3000";
    const navigate = useNavigate();
    const [selectedUser, setSelectedUser] = useState(null); // State for selected user
    const [contractDetails, setContractDetails] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
    const currentUser = JSON.parse(localStorage.getItem('user')); // Fetch current user from localStorage
    
    useEffect(() => {
        const checkSubscription = async () => {
            try {
                // Construct the query parameters
                const params = new URLSearchParams({
                    userId: currentUser.id,
                    type: currentUser.type, // "startup" or "investor"
                });

                // Call the backend API to check subscription status using fetch
                const response = await fetch(`${BASE_URL}/check-subscription?${params.toString()}`, {
                    method: "GET",
                    credentials: "include", // Include cookies (if sessions are cookie-based)
                    // headers: {
                    //     "Session-ID": sessionId, // Include the session ID in the headers
                    // },
                });

                if (!response.ok) {
                    throw new Error("Failed to check subscription status.");
                }
                console.log("Subscription check response status in Chat.jsx:", response.status);
                const data = await response.json();
                const { hasSubscription } = data;
                console.log("Subscription check response data in chat.jsx:", data);
                console.log("Has subscription in Chat.jsx:", data.hasSubscription);

                if (!hasSubscription) {
                    toast.error("You need to purchase a subscription to access the chat.");
                    navigate("/payment"); // Redirect to the payment page
                }
            } catch (error) {
                console.error("Error checking subscription:", error);
                toast.error("Failed to check subscription status.");
                navigate("/"); // Redirect to home or login page
            }
        };

        checkSubscription();
    }, [navigate, currentUser]);

    const handleContractSubmit = (contractData) => {
        const {
            id,
            investmentAmount,
            equityPercentage,
            conditions,
            paymentDate,
            postId,
            postDetails
        } = contractData;

        setContractDetails({
            investmentAmount,
            equityPercentage,
            conditions,
            paymentDate,
            postId,
            postDetails
        });

        console.log("Contract details at Chat.jsx are", {
            investmentAmount,
            equityPercentage,
            conditions,
            paymentDate,
            postId,
            postName: postDetails?.problem,
            companyName: postDetails?.companyName
        });
    };
    return (
        <>
            <Header />
            <div className="flex h-screen pt-8">
                {/* Sidebar */}
                <ChatSidebar
                    selectedUser={selectedUser} // Pass selectedUser as a prop
                    onSelectUser={setSelectedUser} // Pass setSelectedUser as a prop
                />

                {/* Chat Container */}
                <div className="flex-1">
                    {selectedUser ? (
                        <>
                            {/* Chat Header */}
                            <ChatHeader
                                user={selectedUser} // Pass selectedUser as the user prop
                                onClose={() => setSelectedUser(null)} // Pass onClose function
                                setIsModalOpen={setIsModalOpen} // Pass setIsModalOpen function
                                isModalOpen={isModalOpen} // Pass isModalOpen state
                                onContractSubmit={handleContractSubmit}
                            // createContract={createContract} // Pass createContract function
                            />
                            {/* Chat Container */}
                            <ChatContainer
                                user={selectedUser}
                                currentUser={currentUser}
                                contractDetails={contractDetails} // Pass contractDetails as a prop
                            // createContract={createContract}
                            />
                            <ContractDisplay
                                user={selectedUser}
                                currentUser={currentUser}
                                contractDetails={contractDetails} // Pass contractDetails as a prop
                            // createContract={createContract}
                            />
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-black-400">
                            Select a user to start chatting
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Chat;