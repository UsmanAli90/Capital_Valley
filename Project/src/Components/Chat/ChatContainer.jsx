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
                {messages.map((message) => (
                    <div
                        key={message._id}
                        className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                        ref={messageEndRef}
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
            </div>

            {/* Message Input */}
            {user && <MessageInput />}
        </div>
    );
};

export default ChatContainer;