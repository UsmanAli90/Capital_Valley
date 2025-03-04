import React, { useEffect, useRef } from 'react';
import { ChatStore } from '../../store/ChatStore.js';
import MessageInput from './MessageInput.jsx';
import formatMessageTime from '../../../lib/utils.js';

const ChatContainer = ({ user, currentUser }) => {
    const {
        messages,
        isMessageLoading,
        getMessages,
        subscribeToNewMessages,
        unsubscribeFromMessages,
        setSelectedUser, // Add this action from ChatStore
    } = ChatStore();
    const messageEndRef = useRef(null);

    // Update selectedUser in ChatStore when user changes
    useEffect(() => {
        if (user) {
            setSelectedUser(user); // Update selectedUser in ChatStore
        }
    }, [user, setSelectedUser]);
    // Fetch messages and subscribe to new messages when the selected user changes
    useEffect(() => {
        if (user && user._id) {
            getMessages(user._id); // Fetch messages for the selected user
            subscribeToNewMessages(); // Subscribe to new messages
        }

        return () => {
            if (user && user._id) {
                unsubscribeFromMessages(); // Unsubscribe when the component unmounts
            }
        };
    }, [user, getMessages, subscribeToNewMessages, unsubscribeFromMessages]);

    // Scroll to the bottom of the chat when messages change
    useEffect(() => {
        if (messageEndRef.current && messages) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Show loading skeleton if messages are being fetched
    if (isMessageLoading) {
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                {/* <MessageSkeleton /> */}
                <MessageInput />
            </div>
        );
    }

    return (
        <div className='flex flex-col h-screen'>
            {/* Chat Messages */}
            <div className='flex-1 overflow-y-auto p-4 space-y-4'>
                {messages.map((message) => (
                    <div
                        key={message._id}
                        className={`chat ${message.senderId === currentUser._id ? 'chat-end' : 'chat-start'}`}
                        ref={messageEndRef}
                    >
                        {/* Profile Picture */}
                        <div className='chat-image avatar'>
                            <div className='w-10 rounded-full'>
                                <img
                                    src={message.senderId === currentUser._id ? currentUser.profilepic || '/avatar.png' : user.profilepic || '/avatar.png'}
                                    alt="Profile"
                                />
                            </div>
                        </div>

                        {/* Message Header (Time) */}
                        <div className='chat-header'>
                            <time className='text-xs opacity-50'>
                                {formatMessageTime(message.createdAt)}
                            </time>
                        </div>

                        {/* Message Bubble */}
                        <div className={`chat-bubble ${message.senderId === currentUser._id ? 'bg-blue-500 text-white' : 'bg-gray-900 text-white'}`}>
                            {/* Display the sender's username */}
                            <div className="text-sm font-semibold mb-1">
                                {message.senderId === currentUser._id ? "You" : user.username}
                            </div>

                            {/* Display the message image (if any) */}
                            {message.image && (
                                <img src={message.image} alt='Attachment' className='sm:max-w-[200px] rounded-md mb-2' />
                            )}
                            {/* Display the message text (if any) */}
                            {message.text && <p>{message.text}</p>}
                        </div>
                    </div>
                ))}
            </div>

            {/* Message Input */}
            {user && <MessageInput />}
        </div>
    );
};

export default ChatContainer;