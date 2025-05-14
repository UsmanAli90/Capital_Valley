import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { HandThumbUpIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/outline";

const HomePage = () => {
  const navigate = useNavigate();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [niche, setNiche] = useState([]);
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [costRange, setCostRange] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyUrl, setCompanyUrl] = useState("");
  const [productLink, setProductLink] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");
  const [activeUsers, setActiveUsers] = useState("");
  const [isFullTime, setIsFullTime] = useState("");
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  // filepath: c:\Users\hp\Desktop\Capital_Valley\Project\src\Components\HomePage\HomePage.jsx
  const fetchPosts = async () => {
  try {
    const response = await fetch("http://localhost:3000/recommended-posts", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log("Received recommended posts:", data.length);
      
      // Make sure posts have the hasUpvoted property set
      const initializedPosts = data.map((post) => ({
        ...post,
        hasUpvoted: post.upvotedBy?.includes(user?.id) || false,
      }));
      
      setPosts(initializedPosts);
    } else {
      console.error("Failed to fetch posts:", response.status, response.statusText);
      fallbackToRegularPosts();
    }
  } catch (error) {
    console.error("Error fetching recommended posts:", error);
    fallbackToRegularPosts();
  }
};

  // Add this fallback function
  const fallbackToRegularPosts = async () => {
    try {
      const response = await fetch("http://localhost:3000/posts", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched regular posts from server:", data);
        const initializedPosts = data.map((post) => ({
          ...post,
          hasUpvoted: post.upvotedBy?.includes(user?.id) || false,
        }));
        setPosts(initializedPosts);
      } else {
        console.error("Failed to fetch regular posts:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching regular posts:", error);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) navigate("/signin");
    else {
      const parsedUser = JSON.parse(storedUser);
      console.log("Stored user in HomePage:", parsedUser);
      setUser(parsedUser);
    }
    setIsLoading(false);
  }, [navigate]);

  useEffect(() => {
  if (user) {
    fetchPosts();
  }
}, [user]);

  if (isLoading) return <p className="text-center text-gray-500">Loading...</p>;

  const handleUpvote = async (index) => {
    const newPosts = [...posts];
    const post = newPosts[index];
    if (!post || !post._id || !user || !user.id) {
      console.error("Invalid post or user:", { post, user });
      return;
    }
    console.log("Valid post _id:", post._id, "User ID:", user.id);
    const upvoteChange = post.hasUpvoted ? -1 : 1;
    post.upvotes += upvoteChange;
    post.hasUpvoted = !post.hasUpvoted;
    setPosts(newPosts);

    try {
      const response = await fetch(`http://localhost:3000/posts/${post._id}/upvote`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, upvoteChange }),
      });
      if (!response.ok) {
        console.error("Failed to upvote. Reverting UI...");
        post.upvotes -= upvoteChange;
        post.hasUpvoted = !post.hasUpvoted;
        setPosts([...newPosts]);
      } else {
        const updatedPost = await response.json();
        console.log("Updated post from server:", updatedPost);
      }
    } catch (error) {
      console.error("Unexpected error during fetch:", error);
      post.upvotes -= upvoteChange;
      post.hasUpvoted = !post.hasUpvoted;
      setPosts([...newPosts]);
    }
  };

  const timeAgo = (timestamp) => {
    if (!timestamp) return "Invalid date";
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "Invalid date";
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(diff / 1000 / 60 / 60);
    const days = Math.floor(diff / 1000 / 60 / 60 / 24);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  const toggleFormVisibility = () => setIsFormVisible(!isFormVisible);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!niche.length || !problem || !solution || !costRange) {
      alert("Please fill in all fields and select at least one niche.");
      return;
    }
    const newPost = {
      problem,
      solution,
      niches: niche,
      costRange,
      companyName,
      companyUrl,
      productLink,
      companyLocation,
      activeUsers,
      isFullTime,
      owner: user.id,
    };
    try {
      const response = await fetch("http://localhost:3000/filterposts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newPost),
      });
      if (response.ok) {
        const savedPost = await response.json();
        setPosts([savedPost, ...posts]);
        setProblem("");
        setSolution("");
        setNiche([]);
        setCostRange("");
        setCompanyName("");
        setCompanyUrl("");
        setProductLink("");
        setCompanyLocation("");
        setActiveUsers("");
        setIsFullTime("");
        setIsFormVisible(false);
      } else {
        alert("Your post contains prohibited content. Please revise and try again.");
      }
    } catch (error) {
      console.error("Error saving post:", error);
      alert("An error occurred while saving the post.");
    }
  };

  const handleViewProfile = (userId) => {
    if (!userId) {
      console.error("No user ID provided for navigation");
      return;
    }
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Post Idea Section (Facebook-like Interface) */}
        {user?.type === "startup" && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex items-center gap-3">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="User Avatar"
                  className="h-10 w-10 rounded-full object-cover border-2 border-gray-300"
                  onError={(e) => (e.target.src = "/default-avatar.png")}
                />
              ) : (
                <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center text-lg font-semibold text-gray-700">
                  {user?.email?.[0]?.toUpperCase() || "U"}
                </div>
              )}
              <button
                onClick={toggleFormVisibility}
                className="flex-1 text-left px-4 py-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
              >
                What's your idea?
              </button>
            </div>
          </div>
        )}

        {/* Post Idea Form (Modal) */}
        {isFormVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Create a Post</h2>
                <button
                  onClick={toggleFormVisibility}
                  className="text-gray-500 hover:text-gray-700 text-lg"
                >
                  ×
                </button>
              </div>
              <form onSubmit={handlePostSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Select Niches</label>
                  <div className="mt-2 flex flex-wrap gap-3">
                    {["Finance", "Tech", "Health", "Education", "E-commerce"].map((nicheOption) => (
                      <label key={nicheOption} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={nicheOption}
                          checked={niche.includes(nicheOption)}
                          onChange={(e) =>
                            e.target.checked
                              ? setNiche([...niche, nicheOption])
                              : setNiche(niche.filter((n) => n !== nicheOption))
                          }
                          className="form-checkbox h-4 w-4 text-green-600 border-gray-300 rounded"
                        />
                        <span className="text-gray-600 text-sm">{nicheOption}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Problem Statement</label>
                  <input
                    type="text"
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="What problem does your idea solve?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Solution Overview</label>
                  <input
                    type="text"
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="How does your idea solve it?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="Your company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company URL</label>
                  <input
                    type="url"
                    value={companyUrl}
                    onChange={(e) => setCompanyUrl(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Product Link</label>
                  <input
                    type="url"
                    value={productLink}
                    onChange={(e) => setProductLink(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="https://example.com/product"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Location</label>
                  <select
                    value={companyLocation}
                    onChange={(e) => setCompanyLocation(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  >
                    <option value="">Select City</option>
                    {["Karachi", "Lahore", "Islamabad", "Faisalabad", "Multan", "Rawalpindi"].map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Active Users</label>
                  <input
                    type="number"
                    value={activeUsers}
                    onChange={(e) => setActiveUsers(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="Number of active users"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Funding Goal</label>
                  <input
                    type="text"
                    value={costRange}
                    onChange={(e) => setCostRange(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="Funding goal (e.g., 1000)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Working Full-Time</label>
                  <div className="mt-2 flex space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="Yes"
                        checked={isFullTime === "Yes"}
                        onChange={(e) => setIsFullTime(e.target.value)}
                        className="form-radio h-4 w-4 text-green-600 border-gray-300"
                      />
                      <span className="text-gray-600 text-sm">Yes</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="No"
                        checked={isFullTime === "No"}
                        onChange={(e) => setIsFullTime(e.target.value)}
                        className="form-radio h-4 w-4 text-red-600 border-gray-300"
                      />
                      <span className="text-gray-600 text-sm">No</span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={toggleFormVisibility}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:from-green-700 hover:to-emerald-800 transition-all duration-300"
                  >
                    Post Idea
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Posts Timeline */}
        <div className="space-y-6">
          {posts.map((post, index) => (
            <div
              key={post._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  {post.owner?.avatar ? (
                    <img
                      src={post.owner.avatar}
                      alt={`${post.owner?.username || post.owner?.email || "User"}'s Avatar`}
                      className="h-10 w-10 rounded-full object-cover border-2 border-gray-300"
                      onError={(e) => {
                        console.log(`Failed to load avatar for post ${post._id}: ${post.owner.avatar}`);
                        e.target.src = "/default-avatar.png";
                      }}
                    />
                  ) : (
                    <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center text-lg font-semibold text-gray-700">
                      {post.owner?.email?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <div>
                    <h2
                      className="text-base font-semibold text-gray-800 cursor-pointer hover:text-green-600 transition-colors"
                      onClick={() => handleViewProfile(post.owner?._id || post.owner)}
                    >
                      {post.owner?.username || post.owner?.email || "Unknown User"}
                    </h2>
                    <span className="text-xs text-gray-500">{timeAgo(post.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  <p className="text-gray-700 text-sm">
                    <span className="font-medium text-green-700">Problem:</span> {post.problem}
                  </p>
                  <p className="text-gray-700 text-sm">
                    <span className="font-medium text-green-700">Niche:</span> {post.niches.join(", ")}
                  </p>
                  <p className="text-gray-700 text-sm">
                    <span className="font-medium text-green-700">Funding Goal:</span> {post.costRange}
                  </p>
                  <p className="text-gray-700 text-sm">
                    <span className="font-medium text-green-700">Company:</span> {post.companyName}
                  </p>
                  {post.companyUrl && (
                    <a
                      href={post.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-800 text-sm font-medium underline transition-colors"
                    >
                      Visit Website
                    </a>
                  )}
                  {post.productLink && (
                    <a
                      href={post.productLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-800 text-sm font-medium underline transition-colors block"
                    >
                      View Product
                    </a>
                  )}
                  {post.companyLocation && (
                    <p className="text-gray-700 text-sm">
                      <span className="font-medium text-green-700">Location:</span> {post.companyLocation}
                    </p>
                  )}
                  {post.activeUsers && (
                    <p className="text-gray-700 text-sm">
                      <span className="font-medium text-green-700">Active Users:</span> {post.activeUsers}
                    </p>
                  )}
                  {post.isFullTime && (
                    <p className="text-gray-700 text-sm">
                      <span className="font-medium text-green-700">Full-Time:</span> {post.isFullTime}
                    </p>
                  )}
                </div>
              </div>
              <div className="p-4 border-t border-gray-200 flex justify-between items-center">
                <button
                  onClick={() => handleUpvote(index)}
                  className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
                >
                  <HandThumbUpIcon className={`h-5 w-5 ${post.hasUpvoted ? "text-green-600" : ""}`} />
                  <span className="text-sm">
                    {post.upvotes} {post.upvotes === 1 ? "Like" : "Likes"}
                  </span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors">
                  <ChatBubbleLeftIcon className="h-5 w-5" />
                  <span className="text-sm">Comment</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;