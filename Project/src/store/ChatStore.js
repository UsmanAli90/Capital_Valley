const { create } = require('zustand');
const toast = require('react-hot-toast');
const { io } = require('socket.io-client');

const BASE_URL = "http://localhost:3000"; // Backend URL

const ChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessageLoading: false,
    socket: null, // Add socket to the store
    onlineUsers: [], // Add onlineUsers state

    // Initialize socket connection
    connectSocket: () => {
        const user = JSON.parse(localStorage.getItem('user')); // Fetch user from localStorage
        if (!user || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: user._id, // Use user._id from localStorage
            },
        });

        socket.connect();
        set({ socket });

        // Handle online users
        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds }); // Update onlineUsers state
        });
    },

    // Disconnect socket
    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },

    // Fetch users for the sidebar
    getUsers: async () => {
        set({ isUserLoading: true });
        try {
            const response = await fetch(`${BASE_URL}/message/users`, {
                credentials: 'include', // Send cookies for authentication
            });
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await response.json();
            set({ users: data });
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            set({ isUserLoading: false });
        }
    },

    // Fetch messages for a specific user
    getMessages: async (userID) => {
        set({ isMessageLoading: true });
        try {
            const response = await fetch(`${BASE_URL}/message/${userID}`, {
                credentials: 'include', // Send cookies for authentication
            });
            if (!response.ok) {
                throw new Error('Failed to fetch messages');
            }
            const data = await response.json();
            set({ messages: data.messages });
        } catch (error) {
            toast.error('Failed to fetch messages');
        } finally {
            set({ isMessageLoading: false });
        }
    },

    // Send a message
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const response = await fetch(`${BASE_URL}/message/send/${selectedUser._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Send cookies for authentication
                body: JSON.stringify(messageData),
            });
            if (!response.ok) {
                throw new Error('Failed to send message');
            }
            const data = await response.json();
            set({ messages: [...messages, data] });
        } catch (error) {
            toast.error(error.message);
        }
    },

    // Subscribe to new messages
    subscribeToNewMessages: () => {
        const { selectedUser, socket } = get();
        if (!selectedUser || !socket) return;

        socket.on('newMessage', (newMessage) => {
            if (newMessage.senderId !== selectedUser._id) return; // Only handle messages from the selected user
            set({
                messages: [...get().messages, newMessage],
            });
        });
    },

    // Unsubscribe from messages
    unsubscribeFromMessages: () => {
        const { socket } = get();
        if (socket) socket.off('newMessage');
    },

    // Set the selected user
    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));

module.exports = ChatStore;