import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Button from "../component/button";
import Text from "../component/text";
import Img from "../component/img";
import toast from "react-hot-toast";
import Header from "../../HomePage/Header";

const Profile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [notificationsAllowed, setNotificationsAllowed] = useState(false);
  const [user, setUser] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [postedIdeas, setPostedIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false); // State for modal visibility

  const isLoggedInUser = !id || (loggedInUser && user && loggedInUser.id === user.id);
  const avatars = Array.from({ length: 10 }, (_, i) => `/avatars/avatar${i + 1}.png`);

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
        setIsAvatarModalOpen(false); // Close the modal on success
      } else {
        console.error("Failed to update avatar:", data.message);
        toast.error(data.message || "Failed to update avatar.");
      }
    } catch (error) {
      console.error("Error in saveAvatar fetch:", error);
      toast.error("Failed to update avatar.");
    }
  };

  const [selectedTab, setSelectedTab] = useState("myIdeas");

  if (loading) {
    return (
      <>
        <Helmet>
          <title>User Profile</title>
        </Helmet>
        <Header />
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
          <Text as="p" className="text-gray-600 text-lg">Loading...</Text>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <Header />
      <div className="flex justify-center items-center min-h-screen bg-gray-50 py-8">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 border border-green-200">
          <div className="flex flex-col items-center border-b border-gray-200 pb-6">
            <div className="relative">
              <Img
                src={user?.avatar || "profileAssets/images/user.png"}
                alt="Profile Image"
                className="h-20 w-20 rounded-full object-cover border-2 border-green-200 shadow-md hover:shadow-lg transition-shadow"
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
            <Text as="h1" className="text-xl font-bold text-gray-800 mt-4">
              {user ? user.username : "Your name"}
            </Text>
            <Text as="p" className="text-sm text-gray-500 mt-1">
              {user ? user.email : "yourname@gmail.com"}
            </Text>

            {/* Avatar Modal */}
            {isAvatarModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all duration-300 scale-100 hover:scale-105">
                  <div className="flex justify-between items-center mb-4">
                    <Text as="h3" className="text-lg font-semibold text-gray-800">
                      Choose Your Avatar
                    </Text>
                    <button
                      onClick={() => setIsAvatarModalOpen(false)}
                      className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                    >
                      &times;
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-4 mb-6">
                    {avatars.map((avatar, index) => (
                      <Img
                        key={index}
                        src={avatar}
                        alt={`Avatar ${index + 1}`}
                        onClick={() => handleAvatarSelect(avatar)}
                        className={`h-12 w-12 rounded-full cursor-pointer border-2 ${
                          selectedAvatar === avatar ? "border-blue-500 shadow-lg" : "border-gray-300"
                        } hover:border-blue-400 transition-all duration-200`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      onClick={() => setIsAvatarModalOpen(false)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={saveAvatar}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-200"
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex gap-4">
              {isLoggedInUser ? (
                <>
                  <Button
                    onClick={() => navigate("/ProfileSetting")}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300"
                  >
                    Update Profile
                  </Button>
                  <Button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300"
                  >
                    Log Out
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleChat}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300"
                >
                  Chat
                </Button>
              )}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex border-b border-gray-200">
              {user?.type === "startup" && (
                <button
                  className={`w-1/2 py-2 text-center font-semibold ${
                    selectedTab === "myIdeas" ? "border-b-2 border-green-600 text-green-700" : "text-gray-500 hover:text-gray-700"
                  } transition-colors duration-200`}
                  onClick={() => setSelectedTab("myIdeas")}
                >
                  {isLoggedInUser ? "My Ideas" : "Ideas Posted"}
                </button>
              )}
              <button
                className={`w-${user?.type === "startup" ? "1/2" : "full"} py-2 text-center font-semibold ${
                  selectedTab === "likedIdeas" ? "border-b-2 border-green-600 text-green-700" : "text-gray-500 hover:text-gray-700"
                } transition-colors duration-200`}
                onClick={() => setSelectedTab("likedIdeas")}
              >
                Liked Ideas
              </button>
            </div>

            {selectedTab === "myIdeas" && user?.type === "startup" && (
              <div className="mt-6">
                {postedIdeas.length === 0 ? (
                  <Text as="p" className="text-gray-500 text-center mt-4">
                    {isLoggedInUser ? "No ideas posted yet." : "No ideas posted by this user."}
                  </Text>
                ) : (
                  <div className="space-y-4">
                    {postedIdeas.map((post) => (
                      <div key={post._id} className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                        <Text as="h3" className="text-lg font-semibold text-gray-800">
                          {post.problem}
                        </Text>
                        <Text as="p" className="text-gray-600 mt-2">
                          {post.solution}
                        </Text>
                        <Text as="p" className="text-sm text-gray-500 mt-1">
                          {post.companyName}
                        </Text>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {selectedTab === "likedIdeas" && (
              <div className="mt-6">
                {likedPosts.length === 0 ? (
                  <Text as="p" className="text-gray-500 text-center mt-4">
                    {isLoggedInUser ? "No liked ideas yet." : "No liked ideas by this user."}
                  </Text>
                ) : (
                  <div className="space-y-4">
                    {likedPosts.map((post) => (
                      <div key={post._id} className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                        <Text as="h3" className="text-lg font-semibold text-gray-800">
                          {post.problem}
                        </Text>
                        <Text as="p" className="text-gray-600 mt-2">
                          {post.solution}
                        </Text>
                        <Text as="p" className="text-sm text-gray-500 mt-1">
                          {post.companyName}
                        </Text>
                        <div className="flex items-center mt-3">
                          <Button
                            onClick={() => handleUpvote(post._id, post.upvotedBy?.includes(user.id))}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-1 px-3 rounded-md text-sm transition-colors"
                          >
                            {post.upvotedBy?.includes(user.id) ? "Remove Upvote" : "Upvote"} ({post.upvotes})
                          </Button>
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
    </>
  );
};

export default Profile;