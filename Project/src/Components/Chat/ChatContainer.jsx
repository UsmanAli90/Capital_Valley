const React = require('react');
const { useEffect, useRef } = React;
const { ChatStore } = require('../../store/ChatStore');
const ChatHeader = require('./ChatHeader');
const MessageInput = require('./MessageInput');
// const MessageSkeleton = require('./skeletons/MessageSkeleton');
const { useAuthStore } = require('../../store/useAuthStore');
const formatMessageTime = require('../lib/utils');

const ChatContainer = () => {
    const { messages, isMessageLoading, getMessages, selectedUser, subscribeToNewMessages, unsubscribeFromMessages } = ChatStore();
    const { authUser } = useAuthStore();
    const messageEndRef = useRef(null);

    useEffect(() => {
        getMessages(selectedUser._id);

        subscribeToNewMessages();

        return () => unsubscribeFromMessages();
    }, [selectedUser._id, getMessages, subscribeToNewMessages, unsubscribeFromMessages]);

    useEffect(() => {
        if (messageEndRef.current && messages) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    if (isMessageLoading) {
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader />
                {/* <MessageSkeleton /> */}
                <MessageInput />
            </div>
        );
    }

    return (
        <div className='flex-1 flex flex-col overflow-auto'>
            <ChatHeader />
            <div className='flex-1 overflow-y-auto p-4 space-y-4'>
                {messages.map((message) => (
                    <div
                        key={message._id}
                        className={`chat ${message.senderId === authUser._id ? 'chat-end' : 'chat-start'}`}
                        ref={messageEndRef}
                    >
                        <div className='chat-image avatar'>
                            <div className='size-10 rounded-full border'>
                                <img
                                    src={message.senderId === authUser._id ? authUser.profilepic || '/avatar.png' : selectedUser.profilepic || '/avatar.png'}
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
            <MessageInput />
        </div>
    );
};

module.exports = ChatContainer;