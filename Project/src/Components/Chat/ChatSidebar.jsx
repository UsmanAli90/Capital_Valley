import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa"; // Import user icon

const ChatSidebar = ({ onSelectUser }) => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("http://localhost:3000/chat");
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    // Filter users based on search input
    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="w-72 h-screen bg-gray-900 text-white flex flex-col p-4">
            {/* Sidebar Header */}
            <h2 className="text-xl font-semibold mb-4">Chats</h2>

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-2 mb-4 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Users List */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
                {filteredUsers.length > 0 ? (
                    <ul>
                        {filteredUsers.map((user) => (
                            <li
                                key={user._id}
                                onClick={() => onSelectUser(user)}
                                className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-700 rounded-md transition-all"
                            >
                                <FaUser className="text-gray-400" size={20} /> {/* User Icon */}
                                <span className="truncate">{user.username}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400 text-center">No users found</p>
                )}
            </div>
        </div>
    );
};

export default ChatSidebar;
