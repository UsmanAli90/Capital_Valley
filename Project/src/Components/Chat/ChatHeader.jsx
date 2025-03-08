import { X } from "lucide-react";

const ChatHeader = ({ user, onClose }) => {
    // If no user is selected, return a fallback UI
    if (!user) {
        return (
            <div className="p-2.5 border-b border-base-300">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div>
                            <h3 className="font-medium">No user selected</h3>
                            <p className="text-sm text-base-content/70">Offline</p>
                        </div>
                    </div>

                    {/* Close button */}
                    <button onClick={onClose}>
                        <X />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-2.5 border-b border-base-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* User info */}
                    <div>
                        <div className="flex items-center gap-3">
                            <img
                                src={user.profilepic || "/avatar.png"}
                                alt={user.username}
                                className="size-12 object-cover rounded-full"
                            />
                            <h3 className="font-medium">{user.username}</h3>
                        </div>
                        <p className="text-sm text-base-content/70">
                            {/* Online status */}
                            {/* {user.online ? "Online" : "Offline"} */}
                        </p>
                    </div>
                </div>

                {/* Close button */}
                <button onClick={onClose}>
                    <X />
                </button>
            </div>
        </div>
    );
};

export default ChatHeader;