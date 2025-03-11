import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import Header from "../../HomePage/Header";

const Profile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [notificationsAllowed, setNotificationsAllowed] = useState(false);
  const [user, setUser] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [likedPosts, setLikedPosts] = useState([]);
  const [postedIdeas, setPostedIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const isLoggedInUser = !id || (loggedInUser && user && loggedInUser.id === user.id);
  const avatars = Array.from({ length: 10 }, (_, i) => `/avatars/avatar${i + 1}.png`);
  const [selectedTab, setSelectedTab] = useState("myIdeas");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      console.log("Stored user from localStorage:", storedUser);
      setLoggedInUser(storedUser);
    } else {
      console.log("No user found in localStorage");
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        let response;
        if (id) {
          response = await fetch(`http://localhost:3000/profile/${id}`, {
            method: "GET",
            credentials: "include",
          });
        } else {
          response = await fetch("http://localhost:3000/profile", {
            method: "GET",
            credentials: "include",
          });
        }

        const data = await response.json();
        console.log("Profile fetch response:", data);

        if (response.ok && data.success) {
          setUser(data.user);
          if (!id) {
            localStorage.setItem("user", JSON.stringify(data.user));
            setLoggedInUser(data.user);
          }
        } else {
          alert("Session expired, user not found, or could not verify session.");
          localStorage.removeItem("user");
          navigate("/signin");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        alert("Could not verify session.");
        navigate("/signin");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, id]);

  useEffect(() => {
    if (user) {
      const fetchPosts = async () => {
        console.log("fetchPosts triggered for user:", user.id);
        console.log("User type:", user.type);
        try {
          if (!user || !user.id) {
            console.error("User ID is missing");
            return;
          }

          const likedUrl = `http://localhost:3000/posts/liked/${user.id}`;
          let postedUrl = null;

          if (user.type === "startup") {
            postedUrl = `http://localhost:3000/posts/owned/${user.id}`;
          }

          console.log("Fetching liked posts from:", likedUrl);
          if (postedUrl) console.log("Fetching posted ideas from:", postedUrl);

          const likedResponse = await fetch(likedUrl);
          const likedData = await likedResponse.json();
          console.log("Liked posts response:", likedData);

          if (likedResponse.ok) {
            console.log("Liked posts fetched successfully:", likedData);
            setLikedPosts(likedData);
          } else {
            console.error("Error fetching liked posts:", likedData);
          }

          if (postedUrl) {
            const postedResponse = await fetch(postedUrl);
            const postedData = await postedResponse.json();
            console.log("Posted ideas response:", postedData);

            if (postedResponse.ok) {
              console.log("Posted ideas fetched successfully:", postedData);
              if (Array.isArray(postedData)) {
                setPostedIdeas(postedData);
              } else {
                console.error("Unexpected response format for posted ideas:", postedData);
              }
            } else {
              console.error("Error fetching posted ideas:", postedData);
            }
          }
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      };

      fetchPosts();
    } else {
      console.log("No user available to fetch posts");
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      const response = await fetch("http://localhost:3000/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        toast.success("Logged out!");
        navigate("/signin");
      } else {
        alert("Logout failed. Try again.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Logout failed. Try again.");
    }
  };

  const handleUpvote = async (postId, isUpvoted) => {
    try {
      const upvoteChange = isUpvoted ? -1 : 1;

      const response = await fetch(`http://localhost:3000/posts/${postId}/upvote`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, upvoteChange }),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        console.log("Upvote updated successfully:", updatedPost);
        setLikedPosts((prevLikedPosts) =>
          prevLikedPosts.map((post) =>
            post._id === postId
              ? { ...post, upvotes: updatedPost.upvotes, upvotedBy: updatedPost.upvotedBy }
              : post
          )
        );
      } else {
        console.error("Failed to update upvote:", await response.json());
      }
    } catch (error) {
      console.error("Error upvoting post:", error);
    }
  };

  const handleChat = () => {
    navigate("/chat");
  };

  const handleAvatarSelect = (avatar) => {
    console.log("Avatar selected:", avatar);
    setSelectedAvatar(avatar);
  };

  const saveAvatar = async () => {
    console.log("saveAvatar triggered, selectedAvatar:", selectedAvatar);
    if (!selectedAvatar) {
      console.log("No avatar selected");
      toast.error("Please select an avatar!");
      return;
    }
    try {
      console.log("Sending request to update avatar:", selectedAvatar);
      const response = await fetch("http://localhost:3000/update-avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ avatar: selectedAvatar }),
      });

      const data = await response.json();
      console.log("Response from /update-avatar:", data);

      if (response.ok) {
        console.log("Avatar update successful, updating state");
        setUser({ ...user, avatar: selectedAvatar });
        setLoggedInUser({ ...loggedInUser, avatar: selectedAvatar });
        localStorage.setItem("user", JSON.stringify({ ...loggedInUser, avatar: selectedAvatar }));
        toast.success("Avatar updated successfully!");
        setIsAvatarModalOpen(false);
      } else {
        console.error("Failed to update avatar:", data.message);
        toast.error(data.message || "Failed to update avatar.");
      }
    } catch (error) {
      console.error("Error in saveAvatar fetch:", error);
      toast.error("Failed to update avatar.");
    }
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>User Profile</title>
        </Helmet>
        <Header />
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{user?.username || "User"}'s Profile - Capital Valley</title>
      </Helmet>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 py-2">
        <div className="w-full max-w-5xl mx-4 flex flex-col lg:flex-row">
          {/* Left Side - Branding */}
          <div className="w-full lg:w-1/3 bg-gradient-to-br from-green-500 to-emerald-700 text-white p-6 flex items-center justify-center">
            <div className="text-center">
              {/* Placeholder for Logo */}
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
                {/* Add your logo image here, e.g., <img src="/path/to/logo.png" alt="Logo" /> */}
              </div>
              <h1 className="text-3xl font-bold mb-2">Capital Valley</h1>
              <p className="text-sm">View {user?.username || "user"}'s profile and ideas.</p>
            </div>
          </div>

          {/* Right Side - Profile Content */}
          <div className="w-full lg:w-2/3 bg-white p-6 rounded-r-lg shadow-lg">
            {/* Profile Header */}
            <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
              <div className="relative">
                <img
                  src={user?.avatar || "profileAssets/images/user.png"}
                  alt="Profile Image"
                  className="h-16 w-16 rounded-full object-cover border-2 border-green-200 shadow-md"
                />
                {isLoggedInUser && (
                  <button
                    onClick={() => setIsAvatarModalOpen(true)}
                    className="absolute bottom-0 right-0 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md hover:bg-blue-600 transition-all duration-200"
                  >
                    Edit
                  </button>
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  {user ? user.username : "Your name"}
                </h1>
                <p className="text-sm text-gray-500">{user ? user.email : "yourname@gmail.com"}</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-4 flex gap-3">
              {isLoggedInUser ? (
                <>
                  <button
                    onClick={() => navigate("/ProfileSetting")}
                    className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-full shadow-md hover:bg-blue-700 transition-all duration-300"
                  >
                    Update Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold py-2 px-4 rounded-full shadow-md hover:from-red-600 hover:to-red-800 transition-all duration-300"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <button
                  onClick={handleChat}
                  className="bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold py-2 px-4 rounded-full shadow-md hover:from-green-700 hover:to-emerald-800 transition-all duration-300"
                >
                  Chat
                </button>
              )}
            </div>

            {/* Tabs */}
            <div className="mt-6 border-b border-gray-200">
              <div className="flex">
                {user?.type === "startup" && (
                  <button
                    onClick={() => setSelectedTab("myIdeas")}
                    className={`flex-1 py-2 text-center font-semibold text-sm ${
                      selectedTab === "myIdeas"
                        ? "border-b-2 border-green-600 text-green-700"
                        : "text-gray-500 hover:text-gray-700"
                    } transition-colors duration-200`}
                  >
                    {isLoggedInUser ? "My Ideas" : "Ideas Posted"}
                  </button>
                )}
                <button
                  onClick={() => setSelectedTab("likedIdeas")}
                  className={`flex-1 py-2 text-center font-semibold text-sm ${
                    selectedTab === "likedIdeas"
                      ? "border-b-2 border-green-600 text-green-700"
                      : "text-gray-500 hover:text-gray-700"
                  } transition-colors duration-200`}
                >
                  Liked Ideas
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="mt-6 max-h-[300px] overflow-y-auto">
              {selectedTab === "myIdeas" && user?.type === "startup" && (
                <div>
                  {postedIdeas.length === 0 ? (
                    <p className="text-gray-500 text-center text-sm">
                      {isLoggedInUser ? "No ideas posted yet." : "No ideas posted by this user."}
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {postedIdeas.map((post) => (
                        <div
                          key={post._id}
                          className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
                        >
                          <h3 className="text-base font-semibold text-gray-800">
                            {post.problem}
                          </h3>
                          <p className="text-gray-600 text-sm mt-1">{post.solution}</p>
                          <p className="text-gray-500 text-sm mt-1">{post.companyName}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {selectedTab === "likedIdeas" && (
                <div>
                  {likedPosts.length === 0 ? (
                    <p className="text-gray-500 text-center text-sm">
                      {isLoggedInUser ? "No liked ideas yet." : "No liked ideas by this user."}
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {likedPosts.map((post) => (
                        <div
                          key={post._id}
                          className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
                        >
                          <h3 className="text-base font-semibold text-gray-800">
                            {post.problem}
                          </h3>
                          <p className="text-gray-600 text-sm mt-1">{post.solution}</p>
                          <p className="text-gray-500 text-sm mt-1">{post.companyName}</p>
                          <div className="mt-3">
                            <button
                              onClick={() => handleUpvote(post._id, post.upvotedBy?.includes(user.id))}
                              className={`${
                                post.upvotedBy?.includes(user.id)
                                  ? "bg-green-600 text-white"
                                  : "bg-gray-200 text-gray-700"
                              } hover:bg-green-700 font-medium py-1 px-3 rounded-full text-sm transition-colors duration-200`}
                            >
                              {post.upvotedBy?.includes(user.id) ? "Unlike" : "Like"} ({post.upvotes})
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Modal */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Choose Your Avatar</h3>
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-lg"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-5 gap-3 mb-4">
              {avatars.map((avatar, index) => (
                <img
                  key={index}
                  src={avatar}
                  alt={`Avatar ${index + 1}`}
                  onClick={() => handleAvatarSelect(avatar)}
                  className={`h-12 w-12 rounded-full cursor-pointer border-2 ${
                    selectedAvatar === avatar ? "border-green-500 shadow-lg" : "border-gray-300"
                  } hover:border-green-400 transition-all duration-200`}
                />
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={saveAvatar}
                className="bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:from-green-700 hover:to-emerald-800 transition-all duration-300"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;