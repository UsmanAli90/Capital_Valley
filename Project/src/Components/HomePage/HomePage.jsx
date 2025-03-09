import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import { UserCircleIcon, HandThumbUpIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import ChatButton from "../Subscription/SubscriptionForm.jsx";

const HomePage = () => {
  const navigate = useNavigate();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [upvotes, setUpvotes] = useState([0, 0]);
  const [niche, setNiche] = useState([]); // Correct state variable name
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [description, setDescription] = useState("");
  const [costRange, setCostRange] = useState("");
  const [feed, setFeed] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [companyUrl, setCompanyUrl] = useState("");
  const [productLink, setProductLink] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");
  const [activeUsers, setActiveUsers] = useState("");
  const [isFullTime, setIsFullTime] = useState("");
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState("");
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
      niches: niche, // Fixed: Use niche instead of niches
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

  return (
    <div className="bg-white shadow-lg min-h-screen">
      <Header />
      <div className="max-w-6xl mx-auto py-8">
        <div className="flex flex-col flex-1 p-4 rounded-lg max-w-5xl mx-auto">
          <div className="flex items-center justify-center p-4">
            {user?.type === "startup" && (
              <button onClick={toggleFormVisibility} className="bg-gradient-to-r from-green-600 to-green-800 shadow-lg text-white py-2 px-4 rounded-lg">
                {isFormVisible ? "Cancel" : "Post Idea"}
              </button>
            )}
          </div>
          <div className="border-2 border-green-800 rounded-lg">
            {isFormVisible && (
              <div className="p-4 border border-gray-300 rounded-lg mt-4">
                <h2 className="text-lg font-bold mb-4">Post Your Idea</h2>
                <form onSubmit={handlePostSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Select Niches</label>
                    {["Finance", "Tech", "Health", "Education", "E-commerce"].map((nicheOption) => (
                      <label key={nicheOption} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={nicheOption}
                          checked={niche.includes(nicheOption)}
                          onChange={(e) => (e.target.checked ? setNiche([...niche, nicheOption]) : setNiche(niche.filter((n) => n !== nicheOption)))}
                          className="form-checkbox text-green-600"
                        />
                        <span>{nicheOption}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Problem Statement</label>
                    <input
                      type="text"
                      value={problem}
                      onChange={(e) => setProblem(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="Enter the problem statement of your idea"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Solution Overview</label>
                    <textarea
                      value={solution}
                      onChange={(e) => setSolution(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="Enter your USP/Value reposition"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Company Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="Enter your company name"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Company URL</label>
                    <input
                      type="url"
                      value={companyUrl}
                      onChange={(e) => setCompanyUrl(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Add Link to Your Product</label>
                    <input
                      type="url"
                      value={productLink}
                      onChange={(e) => setProductLink(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="https://example.com/product"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Company Location</label>
                    <select
                      value={companyLocation}
                      onChange={(e) => setCompanyLocation(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    >
                      <option value="">Select City</option>
                      {["Karachi", "Lahore", "Islamabad", "Faisalabad", "Multan", "Rawalpindi"].map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Active Users</label>
                    <input
                      type="number"
                      value={activeUsers}
                      onChange={(e) => setActiveUsers(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="Enter number of active users/customers"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Working Full-Time</label>
                    <div className="flex items-center space-x-4 mt-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          value="Yes"
                          checked={isFullTime === "Yes"}
                          onChange={(e) => setIsFullTime(e.target.value)}
                          className="form-radio text-green-600"
                        />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          value="No"
                          checked={isFullTime === "No"}
                          onChange={(e) => setIsFullTime(e.target.value)}
                          className="form-radio text-red-600"
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Money Looking to Raise</label>
                    <input
                      type="text"
                      value={costRange}
                      onChange={(e) => setCostRange(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="Enter amount you are looking to raise"
                    />
                  </div>
                  <button type="submit" className="bg-gradient-to-r from-green-600 to-green-800 shadow-lg text-white py-2 px-4 rounded-lg">
                    Submit
                  </button>
                </form>
              </div>
            )}
          </div>
          <div className="mt-6 space-y-4">
            {posts.map((post, index) => (
              <div key={post._id} className="border-2 border-green-800 rounded-lg p-4 bg-white shadow-md overflow-hidden">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 bg-gray-300 flex items-center justify-center rounded-full text-sm text-white">
                      {post.owner?.email?.[0] || "U"}
                    </div>
                    <h2 className="font-bold">{post.owner?.email || "Unknown"}</h2>
                  </div>
                  <span className="text-gray-400">{timeAgo(post.createdAt)}</span>
                </div>
                <div className="p-4 border rounded-lg shadow-md bg-white">
                  <div className="mt-4">
                    <p className="text-gray-600 mb-2"><strong>Problem Statement:</strong> {post.problem}</p>
                    <p className="text-gray-600 mb-2"><strong>Abstract:</strong> {post.abstract}</p> {/* Show abstract instead of solution */}
                    <p className="text-gray-600 mb-2"><strong>Niche:</strong> {post.niches.join(", ")}</p>
                    <p className="text-gray-600 mb-2"><strong>Money Looking to Raise:</strong> {post.costRange}</p>
                  </div>
                  <br />
                  <h1 className="text-gray-600 mb-2"><strong>Company Name:</strong></h1>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{post.companyName}</h3>
                  {post.companyUrl && (
                    <a href={post.companyUrl} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-green-600 font-medium transition-all mb-4 block" style={{ textDecoration: "none" }}>
                      Visit Company Website
                    </a>
                  )}
                  {post.productLink && (
                    <a href={post.productLink} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-green-600 font-medium transition-all mb-4 block" style={{ textDecoration: "none" }}>
                      Check Product
                    </a>
                  )}
                  <p className="text-gray-600 mb-2"><strong>Location:</strong> {post.companyLocation}</p>
                  <p className="text-gray-600 mb-2"><strong>Active Users:</strong> {post.activeUsers}</p>
                  <p className="text-gray-600 mb-2"><strong>Working Full-Time:</strong> {post.isFullTime}</p>
                  {post.image && (
                    <div className="w-full mt-4">
                      <div className="flex justify-center items-center">
                        <img src={post.image} alt="Post Image" className="w-full max-w-sm object-contain rounded-lg shadow-lg" />
                      </div>
                    </div>
                  )}
                  {user?.id === post.owner && (
                    <button onClick={() => navigate(`/verify-idea/${post.hash}`)} className="mt-4 text-blue-600">
                      View Full Idea
                    </button>
                  )}
                </div>
                <div className="p-4 border-t border-gray-200 flex justify-between items-center">
                  <button onClick={() => handleUpvote(index)} className="flex items-center gap-1 text-gray-600 hover:text-green-400">
                    <HandThumbUpIcon className="h-5 w-5" />
                    {post.upvotes} {post.upvotes === 1 ? "Upvote" : "Upvotes"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-1/3"></div>
      </div>
    </div>
  );
};

export default HomePage;