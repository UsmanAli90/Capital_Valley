import { FaPaperclip, FaPaperPlane } from "react-icons/fa"; // Icons for attach & send

const ChatContainer = ({ user }) => {
    return (
        <div className="flex flex-col h-screen bg-gray-800 text-white">
            {/* Top Bar */}
            <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700">
                <div>
                    <h2 className="text-lg font-semibold">{user.username}</h2>
                    <p className="text-sm text-gray-400">
                        {user.online ? "Online" : "Offline"}
                    </p>
                </div>
            </div>

            {/* Chat Messages (We'll add dynamic messages later) */}
            <div className="flex-1 p-4 overflow-y-auto "style={{ minHeight: "0px" }}>
                {/* Messages will go here */}
            </div>

            {/* Input Field */}
            <div className="flex items-center p-4 border-t border-gray-700 bg-gray-900">
                <button className="p-2 text-gray-400 hover:text-white">
                    <FaPaperclip size={20} />
                </button>
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 mx-2 p-2 bg-gray-800 rounded-md text-white focus:outline-none"
                />
                <button className="p-2 text-blue-400 hover:text-blue-500">
                    <FaPaperPlane size={20} />
                </button>
            </div>
        </div>
    );
};

export default ChatContainer;
