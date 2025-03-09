import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { UserCircleIcon, HandThumbUpIcon } from "@heroicons/react/24/outline";

const HomePage = () => {
  const navigate = useNavigate();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [niche, setNiche] = useState([]);
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [costRange, setCostRange] = useState("");
  const [feed, setFeed] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [companyUrl, setCompanyUrl] = useState("");
  const [productLink, setProductLink] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");
  const [activeUsers, setActiveUsers] = useState("");
  const [isFullTime, setIsFullTime] = useState("");
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await fetch("http://localhost:3000/posts", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched data from server:", data);
        const initializedPosts = data.map((post) => ({
          ...post,
          hasUpvoted: false,
        }));
        setPosts(initializedPosts);
      } else {
        console.error("Failed to fetch posts:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) navigate("/signin");
    else setUser(JSON.parse(storedUser));
    setIsLoading(false);
  }, [navigate]);

  useEffect(() => {
    fetchPosts();
  }, []);

  if (isLoading) return <p>Loading...</p>;

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
      const response = await fetch(
        `http://localhost:3000/posts/${post._id}/upvote`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, upvoteChange }),
        }
      );
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
        alert(
          "Your post contains prohibited content. Please revise and try again."
        );
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
    navigate(`/profile/${userId}`); // Navigate to profile page with user ID
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-white min-h-screen">
      <Header />
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col flex-1 p-4 rounded-xl max-w-5xl mx-auto">
          <div className="flex items-center justify-center p-4">
            {user?.type === "startup" && (
              <button
                onClick={toggleFormVisibility}
                className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-2 px-6 rounded-lg shadow-lg hover:from-green-700 hover:to-emerald-800 transition-all duration-300"
              >
                {isFormVisible ? "Cancel" : "Post Your Idea"}
              </button>
            )}
          </div>
          {isFormVisible && (
            <div className="p-6 bg-white rounded-xl shadow-lg border border-green-200 mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Post Your Idea</h2>
              <form onSubmit={handlePostSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Select Niches</label>
                  {["Finance", "Tech", "Health", "Education", "E-commerce"].map((nicheOption) => (
                    <label key={nicheOption} className="flex items-center space-x-2 mt-2">
                      <input
                        type="checkbox"
                        value={nicheOption}
                        checked={niche.includes(nicheOption)}
                        onChange={(e) =>
                          e.target.checked
                            ? setNiche([...niche, nicheOption])
                            : setNiche(niche.filter((n) => n !== nicheOption))
                        }
                        className="form-checkbox h-5 w-5 text-green-600 border-gray-300 rounded"
                      />
                      <span className="text-gray-600">{nicheOption}</span>
                    </label>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Problem Statement</label>
                  <input
                    type="text"
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter the problem statement of your idea"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Solution Overview</label>
                  <textarea
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter your USP/Value proposition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter your company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company URL</label>
                  <input
                    type="url"
                    value={companyUrl}
                    onChange={(e) => setCompanyUrl(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Add Link to Your Product</label>
                  <input
                    type="url"
                    value={productLink}
                    onChange={(e) => setProductLink(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="https://example.com/product"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Location</label>
                  <select
                    value={companyLocation}
                    onChange={(e) => setCompanyLocation(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter number of active users/customers"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Working Full-Time</label>
                  <div className="mt-2 flex space-x-6">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="Yes"
                        checked={isFullTime === "Yes"}
                        onChange={(e) => setIsFullTime(e.target.value)}
                        className="form-radio h-5 w-5 text-green-600 border-gray-300"
                      />
                      <span className="text-gray-600">Yes</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="No"
                        checked={isFullTime === "No"}
                        onChange={(e) => setIsFullTime(e.target.value)}
                        className="form-radio h-5 w-5 text-red-600 border-gray-300"
                      />
                      <span className="text-gray-600">No</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Money Looking to Raise</label>
                  <input
                    type="text"
                    value={costRange}
                    onChange={(e) => setCostRange(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter amount you are looking to raise"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white py-3 px-6 rounded-lg shadow-lg hover:from-green-700 hover:to-emerald-800 transition-all duration-300"
                >
                  Submit Idea
                </button>
              </form>
            </div>
          )}
          <div className="mt-8 grid gap-6">
            {posts.map((post, index) => (
              <div
                key={post._id}
                className="bg-white border border-green-200 rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
              >
                <div className="p-6 bg-gradient-to-r from-green-100 to-white flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center text-xl font-semibold text-gray-700">
                      {post.owner?.email?.[0] || "U"}
                    </div>
                    <div>
                      <h2
                        className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-green-600 transition-colors"
                        onClick={() => handleViewProfile(post.owner?._id || post.owner)}
                      >
                        {post.owner?.email || "Unknown User"}
                      </h2>
                      <span className="text-sm text-gray-500">{timeAgo(post.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      <span className="font-medium text-green-700">Problem:</span> {post.problem}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium text-green-700">Abstract:</span> {post.abstract}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium text-green-700">Niche:</span> {post.niches.join(", ")}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium text-green-700">Funding Goal:</span> {post.costRange}
                    </p>
                    <h3 className="text-xl font-bold text-gray-900 mt-4">Company: {post.companyName}</h3>
                    {post.companyUrl && (
                      <a
                        href={post.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800 font-medium underline transition-colors"
                      >
                        Visit Website
                      </a>
                    )}
                    {post.productLink && (
                      <a
                        href={post.productLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800 font-medium underline transition-colors mt-2 block"
                      >
                        View Product
                      </a>
                    )}
                    <p className="text-gray-600 mt-2">
                      <span className="font-medium text-green-700">Location:</span> {post.companyLocation}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium text-green-700">Active Users:</span> {post.activeUsers}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium text-green-700">Full-Time:</span> {post.isFullTime}
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 flex justify-between items-center">
                  <button
                    onClick={() => handleUpvote(index)}
                    className="flex items-center gap-2 text-green-600 hover:text-green-800 transition-colors"
                  >
                    <HandThumbUpIcon className="h-6 w-6" />
                    <span>
                      {post.upvotes} {post.upvotes === 1 ? "Upvote" : "Upvotes"}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;