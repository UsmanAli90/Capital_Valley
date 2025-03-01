import { useState } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatContainer from "./ChatContainer";
import Header from "../HomePage/Header";

const Chat = () => {
    const [selectedUser, setSelectedUser] = useState(null);

    return (
        <>
        <Header/>
        <div className="flex h-screen pt-8">
            {/* Sidebar */}
            <ChatSidebar onSelectUser={setSelectedUser} />
            
            {/* Chat Container */}
            <div className="flex-1">
                {selectedUser ? (
                    <ChatContainer user={selectedUser} />
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
