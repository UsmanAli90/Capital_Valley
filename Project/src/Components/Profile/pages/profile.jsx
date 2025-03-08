import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Button from "../component/button";
import Text from "../component/text";
import Img from "../component/img";
import Header from "../../HomePage/Header";

const Profile = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // ID from the URL parameter
  const [notificationsAllowed, setNotificationsAllowed] = useState(false);
  const [user, setUser] = useState(null); // The user being viewed (logged-in or searched)
  const [loggedInUser, setLoggedInUser] = useState(null); // The logged-in user
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [postedIdeas, setPostedIdeas] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  // Determine if the profile belongs to the logged-in user
  const isLoggedInUser = !id || (loggedInUser && user && loggedInUser.id === user.id);

  // Fetch logged-in user from localStorage on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setLoggedInUser(storedUser);
    }
  }, []);

  // Fetch profile based on URL parameter (id) or logged-in user
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true); // Set loading to true while fetching
        let response;
        if (id) {
          // Fetch the profile of the user from the URL parameter (using id)
          response = await fetch(`http://localhost:3000/profile/${id}`, {
            method: "GET",
            credentials: "include",
          });
        } else {
          // Fetch the logged-in user's profile
          response = await fetch("http://localhost:3000/profile", {
            method: "GET",
            credentials: "include",
          });
        }

        const data = await response.json();

        if (response.ok && data.success) {
          setUser(data.user);
          // Only update localStorage if this is the logged-in user
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
        console.error("Error during server-side fetch:", error);
        alert("Could not verify session.");
        navigate("/signin");
      } finally {
        setLoading(false); // Set loading to false after fetch completes
      }
    };

    fetchProfile();
  }, [navigate, id]);

  useEffect(() => {
    if (user) {
      const fetchPosts = async () => {
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
          if (postedUrl) console.log("Fetching posted posts from:", postedUrl);

          const likedResponse = await fetch(likedUrl);
          const likedData = await likedResponse.json();

          if (likedResponse.ok) {
            console.log("Liked posts fetched successfully", likedData);
            setLikedPosts(likedData);
          } else {
            console.error("Error fetching liked posts:", likedData);
          }

          if (postedUrl) {
            const postedResponse = await fetch(postedUrl);
            const postedData = await postedResponse.json();

            if (postedResponse.ok) {
              console.log("Fetched Startup Posted Ideas:", postedData);
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
        console.log("Updated Post:", updatedPost);
      }
    } catch (error) {
      console.log("user: ", user.id);
      console.error("Error upvoting post:", error);
    }
  };

  const handleChat = () => {
    // Navigate to chat with the searched user
    navigate("/chat");
  };

  const [selectedTab, setSelectedTab] = useState("myIdeas");

  // Render loading state while fetching data
  if (loading) {
    return (
      <>
        <Helmet>
          <title>User Profile</title>
        </Helmet>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <Text as="p" className="text-gray-600">Loading...</Text>
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-2xl bg-white shadow-md p-6 border-2 border-green-800 rounded-lg">
          {/* Profile Info */}
          <div className="flex flex-col items-center border-b pb-4">
            <Img
              src="profileAssets/images/user.png"
              alt="Profile Image"
              className="h-[70px] w-[6%] rounded-[34px] object-contain"
            />
            <Text as="p" className="text-lg font-bold">
              {user ? user.username : "Your name"}
            </Text>
            <Text as="p" className="text-sm text-gray-600">
              {user ? user.email : "yourname@gmail.com"}
            </Text>

            {/* Buttons: Conditional based on whether it's the logged-in user */}
            <div className="mt-4 flex gap-4">
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

          {/* Tabs for "My Ideas" & "Liked Ideas" */}
          <div className="mt-6">
            <div className="flex border-b">
              <button
                className={`w-1/2 py-2 text-center font-bold ${
                  selectedTab === "myIdeas" ? "border-b-4 border-green-600 text-green-700" : "text-gray-500"
                }`}
                onClick={() => setSelectedTab("myIdeas")}
              >
                {isLoggedInUser ? "My Ideas" : "Ideas Posted"}
              </button>
              <button
                className={`w-1/2 py-2 text-center font-bold ${
                  selectedTab === "likedIdeas" ? "border-b-4 border-green-600 text-green-700" : "text-gray-500"
                }`}
                onClick={() => setSelectedTab("likedIdeas")}
              >
                Liked Ideas
              </button>
            </div>

            {/* My Ideas / Ideas Posted Section */}
            {selectedTab === "myIdeas" && user?.type === "startup" && (
              <div className="mt-4">
                {postedIdeas.length === 0 ? (
                  <Text as="p" className="text-gray-600 mt-2">
                    {isLoggedInUser ? "No ideas posted yet." : "No ideas posted by this user."}
                  </Text>
                ) : (
                  <div className="space-y-4">
                    {postedIdeas.map((post) => (
                      <div key={post._id} className="border p-4 rounded-lg shadow-md">
                        <Text as="h3" className="text-lg font-bold">{post.problem}</Text>
                        <Text as="p" className="text-gray-700">{post.solution}</Text>
                        <Text as="p" className="text-sm text-gray-500 mt-2">{post.companyName}</Text>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Liked Ideas Section */}
            {selectedTab === "likedIdeas" && (
              <div className="mt-4">
                {likedPosts.length === 0 ? (
                  <Text as="p" className="text-gray-600 mt-2">
                    {isLoggedInUser ? "No liked ideas yet." : "No liked ideas by this user."}
                  </Text>
                ) : (
                  <div className="space-y-4">
                    {likedPosts.map((post) => (
                      <div key={post._id} className="border p-4 rounded-lg shadow-md">
                        <Text as="h3" className="text-lg font-bold">{post.problem}</Text>
                        <Text as="p" className="text-gray-700">{post.solution}</Text>
                        <Text as="p" className="text-sm text-gray-500 mt-2">{post.companyName}</Text>
                        <div className="flex items-center mt-2">
                          <Button
                            onClick={() => handleUpvote(post._id, post.upvotedBy.includes(user?._id))}
                            className="bg-gray-200 p-1 rounded"
                          >
                            {post.upvotedBy.includes(user?._id) ? "Remove Upvote" : "Upvote"} ({post.upvotes})
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