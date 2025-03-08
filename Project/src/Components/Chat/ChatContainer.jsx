import React, { useEffect, useRef, memo } from 'react';
import { ChatStore } from '../../store/ChatStore.js';
import MessageInput from './MessageInput.jsx';
import formatMessageTime from '../../../lib/utils.js';
import socket from './Socket.js'; // Import the Socket.IO client

const ChatContainer = ({ user, currentUser }) => {
    console.log('ChatContainer rendered'); // Debugging
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
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Connect to Socket.IO and handle messages
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

        // Add the event listener
        socket.on('receiveMessage', handleReceiveMessage);

        // Cleanup on component unmount
        return () => {
            console.log('Socket.IO event listener removed'); // Debugging

            // Remove the event listener
            socket.off('receiveMessage', handleReceiveMessage);

            // Disconnect from the Socket.IO server
            socket.disconnect();
        };
    }, [currentUser?.id, messages]); // Include messages in dependency array to check for duplicates

    // Function to send a message
    // Function to send a message
    const sendMessage = async (messageData) => {
        try {
            // First save the message to the database via API
            const newMessage = {
                ...messageData,
                senderId: currentUser.id,
                receiverId: user._id,
                createdAt: new Date(),
            };

            // Save the message to the database using the API
            const savedMessage = await ChatStore.getState().sendMessage(newMessage);

            // The message is now saved and added to the messages state
            // We emit the saved message (with _id) to Socket.IO for delivery to the recipient
            socket.emit('sendMessage', savedMessage);
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    // Show loading skeleton if messages are being fetched
    if (isMessageLoading) {
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <MessageInput />
            </div>
        );
    }

    return (
        <div className='flex flex-col h-screen'>
            {/* Chat Messages */}
            <div className='flex-1 overflow-y-auto p-4 space-y-4'>
                {messages.map((message, index) => (
                    <div
                        key={message._id || index}
                        className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                    >
                        {/* Profile Picture for Other User */}
                        {message.senderId !== currentUser.id && (
                            <div className='flex-shrink-0'>
                                <div className='size-10 rounded-full border'>
                                    <img
                                        src={user.profilepic || '/avatar.png'}
                                        alt="Profile"
                                        className='w-full h-full rounded-full'
                                    />
                                </div>
                            </div>
                        )}

                        {/* Message Content */}
                        <div className='flex flex-col'>
                            {/* Message Bubble */}
                            <div className={`p-3 rounded-lg max-w-[100%] ${message.senderId === currentUser.id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                                {/* Display the sender's username */}
                                <div className="text-sm font-semibold mb-1">
                                    {message.senderId === currentUser.id ? "You" : user.username}
                                </div>

                                {/* Display the message image (if any) */}
                                {message.image && (
                                    <img src={message.image} alt='Attachment' className='sm:max-w-[200px] rounded-md mb-2' />
                                )}

                                {/* Display the message text (if any) */}
                                {message.text && <p>{message.text}</p>}
                            </div>

                            {/* Message Header (Time) */}
                            <time className='text-xs opacity-50 mt-1'>
                                {formatMessageTime(message.createdAt)}
                            </time>
                        </div>

                        {/* Profile Picture for Current User */}
                        {message.senderId === currentUser.id && (
                            <div className='flex-shrink-0'>
                                <div className='size-10 rounded-full border'>
                                    <img
                                        src={currentUser.profilepic || '/avatar.png'}
                                        alt="Profile"
                                        className='w-full h-full rounded-full'
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                <div ref={messageEndRef} />
            </div>

            {/* Message Input */}
            {user && <MessageInput sendMessage={sendMessage} />}
        </div>
    );
};

export default memo(ChatContainer);