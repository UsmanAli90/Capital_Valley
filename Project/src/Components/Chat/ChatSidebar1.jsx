import React, { useEffect, useState } from 'react';
import { ChatStore } from '../../store/ChatStore';
import { Users } from "lucide-react";

const Sidebar = ({ selectedUser, onSelectUser }) => {
    const { users, isUserLoading, getUsers, onlineUsers } = ChatStore();
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);

    // Fetch users when the component mounts
    useEffect(() => {
        getUsers();
    }, [getUsers]);

    // Filter users based on online status
    const filteredUsers = showOnlineOnly ? users.filter((user) => onlineUsers.includes(user._id)) : users;
    console.log("Filtered users are", filteredUsers);

    return (
        <aside className="h-full w-20 lg:w-72 border-r border-gray-300 flex flex-col transition-all duration-200">
            <div className="border-b border-gray-300 w-full p-5">
                <div className="flex items-center gap-2">
                    <Users className="size-6" />
                    <span className="font-medium hidden lg:block">Contacts</span>
                </div>

                {/* <div className="mt-3 hidden lg:flex items-center gap-2">
                    <label className="cursor-pointer flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={showOnlineOnly}
                            onChange={(e) => setShowOnlineOnly(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-sm">Show online only</span>
                    </label>
                    <span className="text-xs text-gray-500">({onlineUsers.length} online)</span>
                </div> */}
            </div>

            <div className="overflow-y-auto w-full py-3">
                {filteredUsers.map((user) => (
                    <button
                        key={user._id}
                        onClick={() => onSelectUser(user)} // Use onSelectUser prop to update selectedUser
                        className={`
                            w-full p-3 flex items-center gap-3
                            hover:bg-gray-100 transition-colors
                            ${selectedUser?._id === user._id ? "bg-gray-100 ring-1 ring-gray-300" : ""}
                        `}
                    >
                        <div className="relative mx-auto lg:mx-0">
                            <img
                                src={user.avatar }
                                alt={user.username}
                                className="size-12 object-cover rounded-full"
                            />
                            {onlineUsers.includes(user._id) && (
                                <span
                                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                                    rounded-full ring-2 ring-white"
                                />
                            )}
                        </div>

                        <div className="hidden lg:block text-left min-w-0">
                            <div className="font-medium truncate">{user.username}</div>
                            {/* <div className="text-sm text-gray-400">
                                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                            </div> */}
                        </div>
                    </button>
                ))}
                {filteredUsers.length === 0 && (
                    <div className="text-center text-gray-500 py-4">No online users</div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;