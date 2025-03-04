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
    } = ChatStore();
    const messageEndRef = useRef(null);

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
                        <div className='chat-image avatar'>
                            <div className='size-10 rounded-full border'>
                                <img
                                    src={message.senderId === currentUser._id ? currentUser.profilepic || '/avatar.png' : user.profilepic || '/avatar.png'}
                                    alt=""
                                />
                            </div>
                        </div>

                        <div className='chat-header mb-1'>
                            <time className='text-xs opacity-50 ml-1'>
                                {formatMessageTime(message.createdAt)}
                            </time>
                        </div>

                        <div className='chat-bubble flex flex-col'>
                            {message.image && (
                                <img src={message.image} alt='Attachement' className='sm:max-w-[200px] rounded-md mb-2' />
                            )}
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