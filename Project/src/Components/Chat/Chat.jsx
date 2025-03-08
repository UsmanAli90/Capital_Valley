import { useState } from "react";
import ChatSidebar from "./ChatSidebar1";
import ChatHeader from "./ChatHeader";
import ChatContainer from "./ChatContainer";
import Header from "../HomePage/Header";

const Chat = () => {
    const [selectedUser, setSelectedUser] = useState(null); // State for selected user
    const currentUser = JSON.parse(localStorage.getItem('user')); // Fetch current user from localStorage

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
                            />
                            {/* Chat Container */}
                            <ChatContainer user={selectedUser} currentUser={currentUser} />
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