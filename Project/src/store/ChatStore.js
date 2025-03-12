import { create } from 'zustand';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const BASE_URL = "http://localhost:3000"; // Backend URL

export const ChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null, // Initialize as null
    isUserLoading: false,
    isMessageLoading: false,
    socket: null,
    onlineUsers: [],

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
            const response = await fetch(`${BASE_URL}/chat`, {
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
    // getMessages: async (userID) => {
    //     set({ isMessageLoading: true });
    //     try {
    //         const response = await fetch(`${BASE_URL}/${userID}`, {
    //             credentials: 'include', // Send cookies for authentication
    //         });
    //         if (!response.ok) {
    //             throw new Error('Failed to fetch messages');
    //         }
    //         const data = await response.json();
    //         set({ messages: data.messages });
    //     } catch (error) {
    //         toast.error('Failed to fetch messages');
    //     } finally {
    //         set({ isMessageLoading: false });
    //     }
    // },
    getMessages: async (userID) => {
        set({ isMessageLoading: true });
        try {
            console.log("In getMessages Fetching messages for userID:", userID); // Debugging
            // console.log("Fetching messages for userID:", userID); // Debugging
            const response = await fetch(`${BASE_URL}/messages/${userID}`, {
                credentials: 'include', // Send cookies for authentication
            });
            // console.log("Response status:", response.status); // Debugging
            if (!response.ok) {
                throw new Error('Failed to fetch messages');
            }
            const data = await response.json();
            // console.log("Fetched messages:", data.messages); // Debugging
            set({ messages: data.messages });
        } catch (error) {
            console.log("Error in getMessages:", error.message); // Debugging
            toast.error('Failed to fetch messages');
        } finally {
            set({ isMessageLoading: false });
        }
    },

    // Send a message
    sendMessage: async (messageData) => {
        console.log("In sendMessage messageData:", messageData); // Debugging
        const { selectedUser, messages } = get();
        console.log("Selected user in sendMessage:", selectedUser); // Debugging
        if (!selectedUser) {
            toast.error('No user selected');
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/send/${selectedUser._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Send cookies for authentication
                body: JSON.stringify(messageData),
            });
            // console.log("messageData:", messageData); // Debugging
            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            const data = await response.json();
            set({ messages: [...messages, data] }); // Update the messages list with the saved message
            return data; // Return the saved message
        } catch (error) {
            toast.error(error.message);
            throw error; // Re-throw the error to handle it in the component
        }
    },

    // In your ChatStore.js

    // sendMessage: async (messageData) => {

    // },
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