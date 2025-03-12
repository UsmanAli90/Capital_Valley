import React, { useEffect, useRef, memo, useState } from "react";
import { ChatStore } from "../../store/ChatStore.js";
import MessageInput from "./MessageInput.jsx";
import formatMessageTime from "../../../lib/utils.js";
import socket from "./Socket";
import Web3 from "web3";
import toast from "react-hot-toast";
import ContractABI from "./ContractABI"; // Import your contract ABI


const ChatContainer = ({ user, currentUser, contractDetails, createContract }) => {
    console.log("Contract Deatils ", contractDetails);
    const [contracts, setContracts] = useState([]);
    const currentUser1 = JSON.parse(localStorage.getItem('user'));
    const BASE_URL = "http://localhost:3000";
    const {
        messages,
        isMessageLoading,
        getMessages,
        subscribeToNewMessages,
        unsubscribeFromMessages,
        setSelectedUser,
    } = ChatStore();
    const messageEndRef = useRef(null);

    // Update selectedUser in ChatStore when user changes
    useEffect(() => {
        if (user) {
            setSelectedUser(user);
        }
    }, [user, setSelectedUser]);

    // Fetch messages and subscribe to new messages when the selected user changes
    useEffect(() => {
        if (user && user._id) {
            getMessages(user._id);
            subscribeToNewMessages();
        }

        return () => {
            if (user && user._id) {
                unsubscribeFromMessages();
            }
        };
    }, [user, getMessages, subscribeToNewMessages, unsubscribeFromMessages]);

    // Scroll to the bottom of the chat when messages change
    useEffect(() => {
        if (messageEndRef.current && messages) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        console.log('Socket.IO event listener attached'); // Debugging

        // Connect to the Socket.IO server
        socket.connect();

        // Join the current user's room
        if (currentUser?.id) {
            socket.emit('joinRoom', currentUser.id);
        }

        // Listen for incoming messages
        const handleReceiveMessage = (newMessage) => {
            console.log('Received new message:', newMessage); // Debugging

            // Only handle messages that are from the other user to avoid duplicates
            if (newMessage.senderId !== currentUser.id) {
                // Check if the message already exists in the messages list
                const messageExists = messages.some((msg) => msg._id === newMessage._id);

                if (!messageExists) {
                    // Add the new message to the messages list
                    ChatStore.setState((state) => ({
                        messages: [...state.messages, newMessage],
                    }));
                }
            }
        };


        // Add the event listeners
        socket.on('receiveMessage', handleReceiveMessage);

        // Cleanup on component unmount
        return () => {
            console.log('Socket.IO event listener removed'); // Debugging

            // Remove the event listeners
            socket.off('receiveMessage', handleReceiveMessage);
            // Disconnect from the Socket.IO server
            socket.disconnect();
        };
    }, [currentUser?.id, messages]); // Include messages in dependency array to check for duplicates


    useEffect(() => {
        // Listen for new contracts
        socket.on('receiveContract', (newContract) => {
            setContracts((prevContracts) => [...prevContracts, newContract]);
        });

        // Listen for accepted contracts
        socket.on('contractAccepted', (updatedContract) => {
            setContracts((prevContracts) =>
                prevContracts.map((contract) =>
                    contract._id === updatedContract._id ? updatedContract : contract
                )
            );
        });

        // Listen for declined contracts
        socket.on('contractDeclined', (updatedContract) => {
            setContracts((prevContracts) =>
                prevContracts.map((contract) =>
                    contract._id === updatedContract._id ? updatedContract : contract
                )
            );
        });

        // Cleanup event listeners
        return () => {
            socket.off('receiveContract');
            socket.off('contractAccepted');
            socket.off('contractDeclined');
        };
    }, []);

    useEffect(() => {
        const fetchContracts = async () => {
            if (!user || !user._id) {
                console.error("User not logged in or session missing");
                return;
            }

            try {
                const response = await fetch(`${BASE_URL}/getcontract/${user._id}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                // console.log("Resonse in chatContainer.jsx is", response);
                // console.log("User id in chatContainer: ", user._id)
                if (!response.ok) {
                    throw new Error('Failed to fetch contracts.');
                }
                const data = await response.json();
                setContracts(data);
                console.log("Contracts are:", data);
                toast.success("Contracts fetched successfully!");
            } catch (error) {
                console.error('Error fetching contracts:', error);
            }
        };

        fetchContracts();
    }, [user]);
    // Function to send a message
    // const sendMessage = async (messageData) => {
    //     try {
    //         // First save the message to the database via API
    //         const newMessage = {
    //             ...messageData,
    //             senderId: currentUser.id,
    //             receiverId: user._id,
    //             createdAt: new Date(),
    //         };

    //         // Save the message to the database using the API
    //         const savedMessage = await ChatStore.getState().sendMessage(newMessage);

    //         // The message is now saved and added to the messages state
    //         // We emit the saved message (with _id) to Socket.IO for delivery to the recipient
    //         socket.emit('sendMessage', savedMessage);
    //     } catch (error) {
    //         console.error("Failed to send message:", error);
    //     }
    // };

    const sendMessage = async (messageData) => {
        try {
            // First save the message to the database via API
            const newMessage = {
                ...messageData,
                senderId: currentUser.id,
                receiverId: user._id,
                createdAt: new Date(),
            };
            console.log("In chatcontainer New Message is", newMessage);
            console.log("Current User is", currentUser.id);
            console.log("User is", user._id);

            // Save the message to the database using the API
            const savedMessage = await ChatStore.getState().sendMessage(newMessage);

            // The message is now saved and added to the messages state
            // We emit the saved message (with _id) to Socket.IO for delivery to the recipient
            socket.emit('sendMessage', savedMessage);
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };


    // Handle contract acceptance
    const handleAcceptContract = async (contractID) => {
        if (!window.ethereum) {
            toast.error("Please install MetaMask to accept the contract.");
            return;
        }

        const selectedContract = contracts.contracts.find(c => c._id === contractID);
        try {

            // Request account access
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();
            const investorAddress = accounts[0];
            const secondUserAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
            const deployedContract = await new web3.eth.Contract(ContractABI)

                .deploy({
                    data: "0x608060405234801561001057600080fd5b50604051610970380380610970833981810160405281019061003291906100f4565b836000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555082600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508160028190555080600381905550505050506101c1565b6000815190506100d981610193565b92915050565b6000815190506100ee816101aa565b92915050565b6000806000806080858703121561010a57600080fd5b6000610118878288016100ca565b9450506020610129878288016100ca565b935050604061013a878288016100df565b925050606061014b878288016100df565b91505092959194509250565b600061016282610169565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b61019c81610157565b81146101a757600080fd5b50565b6101b381610189565b81146101be57600080fd5b50565b6107a0806101d06000396000f3fe6080604052600436106100915760003560e01c80639818227611610059578063981822761461014c578063b3892c6414610163578063b564e9261461018e578063e4f2e4e8146101b9578063f4a92299146101d057610091565b80631e0018d61461009657806367bbe321146100c157806369d89575146100ec5780636d20676e146100f65780636faa10b914610121575b600080fd5b3480156100a257600080fd5b506100ab6101fb565b6040516100b89190610640565b60405180910390f35b3480156100cd57600080fd5b506100d661021f565b6040516100e391906106f6565b60405180910390f35b6100f4610225565b005b34801561010257600080fd5b5061010b610356565b60405161011891906106f6565b60405180910390f35b34801561012d57600080fd5b5061013661035c565b604051610143919061065b565b60405180910390f35b34801561015857600080fd5b5061016161036f565b005b34801561016f57600080fd5b5061017861041a565b6040516101859190610640565b60405180910390f35b34801561019a57600080fd5b506101a3610440565b6040516101b0919061065b565b60405180910390f35b3480156101c557600080fd5b506101ce610453565b005b3480156101dc57600080fd5b506101e5610500565b6040516101f2919061065b565b60405180910390f35b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60025481565b600460009054906101000a900460ff16801561024d5750600460019054906101000a900460ff165b61028c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610283906106b6565b60405180910390fd5b60025434146102d0576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102c790610696565b60405180910390fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc349081150290604051600060405180830381858888f19350505050158015610338573d6000803e3d6000fd5b506001600460026101000a81548160ff021916908315150217905550565b60035481565b600460009054906101000a900460ff1681565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146103fd576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103f4906106d6565b60405180910390f35b6001600460006101000a81548160ff021916908315150217905550565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600460029054906101000a900460ff1681565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146104e3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104da90610676565b60405180910390f35b6001600460016101000a81548160ff021916908315150217905550565b600460019054906101000a900460ff1681565b61051c81610722565b82525050565b61052b81610734565b82525050565b600061053e601583610711565b91507f4f6e6c7920737461727475702063616e207369676e00000000000000000000006000830152602082019050919050565b600061057e601b83610711565b91507f496e636f727265637420696e766573746d656e7420616d6f756e7400000000006000830152602082019050919050565b60006105be601c83610711565b91507f426f74682070617274696573206d757374207369676e206669727374000000006000830152602082019050919050565b60006105fe601683610711565b91507f4f6e6c7920696e766573746f722063616e207369676e000000000000000000006000830152602082019050919050565b61063a81610760565b82525050565b60006020820190506106556000830184610513565b92915050565b60006020820190506106706000830184610522565b92915050565b6000602082019050818103600083015261068f81610531565b9050919050565b600060208201905081810360008301526106af81610571565b9050919050565b600060208201905081810360008301526106cf816105b1565b9050919050565b600060208201905081810360008301526106ef816105f1565b9050919050565b600060208201905061070b6000830184610631565b92915050565b600082825260208201905092915050565b600061072d82610740565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600081905091905056fea264697066735822122061b2e345bbf950d29132ae9280beef421251b3e797499019c99295f1ece55f3f64736f6c63430008000033",
                    arguments: [
                        investorAddress,
                        secondUserAddress,
                        selectedContract.investmentAmount,
                        selectedContract.equityPercentage,
                        // paymentTimestamp,
                    ],
                })
                .send({ from: investorAddress });

            const response = await fetch(`${BASE_URL}/contract/${contractID}/accept`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to update contract acceptance.');
            }

            toast.success("Contract accepted and deployed successfully!");
        } catch (error) {
            console.error('Error accepting contract:', error);
            toast.error('Failed to accept contract. Check the console for details.');
        }
    };

    // Handle contract decline
    const handleDeclineContract = async (contractID) => {
        try {
            // Call the backend to update isDeclined to true
            const response = await fetch(`${BASE_URL}/contract/${contractID}/decline`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to decline contract.');
            }



            toast.success("Contract declined successfully!");
        } catch (error) {
            console.error('Error declining contract:', error);
            toast.error('Failed to decline contract. Check the console for details.');
        }
    };

    return (
        <div className="flex flex-col h-screen">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <div
                        key={message._id || index}
                        className={`flex ${message.senderId === currentUser.id ? "justify-end" : "justify-start"}`}
                        
                    >
                        {console.log("message.senderId",user._id)}
                        {console.log("currentUser.id", currentUser.id)}
                        {/* Message Content */}
                        <div className="flex flex-col">
                            <div
                                className={`p-3 rounded-lg max-w-[100%] ${message.senderId === currentUser.id ? "bg-blue-500 text-white" : "bg-gray-200"
                                    }`}
                            >
                                {message.text && <p>{message.text}</p>}
                            </div>
                            <time className="text-xs opacity-50 mt-1">
                                {formatMessageTime(message.createdAt)}
                            </time>
                        </div>
                    </div>
                ))}

                {/* Display All Contracts */}
                {contracts && contracts.contracts && contracts.contracts.length > 0 && (
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold mb-3">Contracts</h2>
                        {contracts.contracts.map((contract, index) => (
                            <div key={contract._id || index} className="bg-gray-100 p-4 rounded-lg mb-3">
                                <div className="flex justify-between mb-2">
                                    <span className="font-medium">Contract #{index + 1}</span>
                                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                        {contract.isAccepted ? "Accepted" : contract.isDeclined ? "Declined" : "Pending"}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    <p><span className="font-medium">Amount:</span> {contract.investmentAmount} ETH</p>
                                    <p><span className="font-medium">Equity:</span> {contract.equityPercentage}%</p>
                                    <p><span className="font-medium">Investor:</span> {contract.investor.slice(0, 6)}...{contract.investor.slice(-4)}</p>
                                    <p><span className="font-medium">Startup:</span> {contract.startup.slice(0, 6)}...{contract.startup.slice(-4)}</p>
                                    <p><span className="font-medium">Created:</span> {new Date(contract.createdAt).toLocaleDateString()}</p>
                                    <p><span className="font-medium">Post-Name:</span> {contract.postName}</p>
                                    {contract.conditions && <p><span className="font-medium">Conditions:</span> {contract.conditions}</p>}
                                </div>

                                {/* Show action buttons or accepted text based on contract status */}
                                {contract.receiverId === currentUser.id && (
                                    <div className="flex gap-2 mt-2">
                                        {contract.isAccepted ? (
                                            <p className="text-green-600 font-medium">Contract Accepted</p>
                                        ) : contract.isDeclined ? (
                                            <p className="text-red-600 font-medium">Contract Declined</p>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => handleAcceptContract(contract._id)}
                                                    className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleDeclineContract(contract._id)}
                                                    className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm"
                                                >
                                                    Decline
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <div ref={messageEndRef} />
            </div>

            {/* Message Input */}
            {user && <MessageInput sendMessage={sendMessage} />}
        </div>
    );
};

export default memo(ChatContainer);