import { useState } from "react";
import ChatSidebar from "./ChatSidebar1";
import ChatHeader from "./ChatHeader";
import ChatContainer from "./ChatContainer";
import Header from "../HomePage/Header";
import toast from "react-hot-toast";
import Web3 from "web3";
import socket from "./Socket"; // Import Socket.IO client

const Chat = () => {
    const BASE_URL = "http://localhost:3000";
    const [selectedUser, setSelectedUser] = useState(null); // State for selected user
    const [contractDetails, setContractDetails] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
    const currentUser = JSON.parse(localStorage.getItem('user')); // Fetch current user from localStorage
    //     const { id, investmentAmount, equityPercentage } = contractData;
    
    //     setContractDetails({ investmentAmount, equityPercentage }); // ✅ Store contract details
    //     console.log("Contract details at Chat.jsx are", contractData);
    // };
    
    

    // Function to create a contract
    // const createContract = async ({ investmentAmount, equityPercentage, paymentDate }) => {
    //     if (!window.ethereum) {
    //         toast.error("Please install MetaMask to create a contract.");
    //         return;
    //     }

    //     try {
    //         await window.ethereum.request({ method: "eth_requestAccounts" });
    //         const web3 = new Web3(window.ethereum);
    //         const accounts = await web3.eth.getAccounts();
    //         const investorAddress = accounts[0];
    //         const secondUserAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; // Use the selected user's wallet address

    //         const paymentTimestamp = Math.floor(new Date(paymentDate).getTime() / 1000);

    //         // Create contract details
    //         const contractDetails = {
    //             _id: new Date().getTime().toString(), // Generate a unique ID
    //             investorAddress,
    //             secondUserAddress,
    //             investmentAmount,
    //             equityPercentage,
    //             paymentTimestamp,
    //         };

    //         // Emit the contract via Socket.IO
    //         socket.emit('sendContract', contractDetails);
    //         toast.success("Contract sent successfully!");

    //         // Update the contractDetails state
    //         setContractDetails(contractDetails);
    //     } catch (error) {
    //         console.error("Error creating contract:", error);
    //         toast.error("Failed to create contract. Check the console for details.");
    //     }
    // };

    // const createContract = async ({ investmentAmount, equityPercentage, paymentDate }) => {
    //     const web3 = new Web3(window.ethereum);
    //     const accounts = await web3.eth.getAccounts();
    //     const investorAddress = accounts[0];
    //     const secondUserAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
    //     console.log("Selected User in Chat.jsx is:",selectedUser._id)
    //     try {
    //         const response = await fetch(`${BASE_URL}/contracts/${selectedUser._id}`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 senderId: currentUser.id,
    //                 receiverId: selectedUser._id,
    //                 investorAddress: investorAddress, // Assuming currentUser has walletAddress
    //                 secondUserAddress: secondUserAddress, // Assuming user has walletAddress
    //                 investmentAmount,
    //                 equityPercentage,
    //                 // paymentDate,
    //             }),
    //         });
    //         console.log("Response is", response);

    //         if (!response.ok) {
    //             throw new Error('Failed to save contract details.');
    //         }

    //         const data = await response.json();
    //         toast.success("Contract saved successfully!");
    //     } catch (error) {
    //         console.error("Error creating contract:", error);
    //         toast.error("Failed to create contract. Check the console for details.");
    //     }
    // };


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