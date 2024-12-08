import React, { useState } from "react";
import { useEffect } from "react";
import Header from './Header'
import logo from '../../assets/Home/logo.png'
import { UserCircleIcon, HandThumbUpIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/outline";


const HomePage = () => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [upvotes, setUpvotes] = useState([0, 0]);
    const [selectedFile, setSelectedFile] = useState(null); // Declare only once
    const [niche, setNiche] = useState([]);
    const [problem, setProblem] = useState("");
    const [solution, setSolution] = useState("");
    const [description, setDescription] = useState(""); // Declare only once
    const [costRange, setCostRange] = useState("");
    const [feed, setFeed] = useState([]);
    const [companyName, setCompanyName] = useState("");
    const [companyUrl, setCompanyUrl] = useState("");
    const [productLink, setProductLink] = useState("");
    const [companyLocation, setCompanyLocation] = useState("");
    const [activeUsers, setActiveUsers] = useState("");
    const [isFullTime, setIsFullTime] = useState("");
    const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "User1",
      problem: "None",
      solution: "None",
      upvotes: 0,
      comments: [],
      description: "Sample description",
      timestamp: new Date(),
      hasUpvoted: false,
      isCommenting: false,
      newComment: ""
    },
    {
      id: 2,
      user: "User2",
      problem: "None",
      solution: "None",
      upvotes: 0,
      comments: [],
      description: "Another description",
      timestamp: new Date(),
      hasUpvoted: false,
      isCommenting: false,
      newComment: "",
    },

  ]);

 useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log("Stored user:", storedUser); // Add logging
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };



  const handleUpvote = (index) => {
    const newPosts = [...posts];
    const post = newPosts[index];
    if (post.hasUpvoted) {
      post.upvotes -= 1;
      post.hasUpvoted = false;
    } else {
      post.upvotes += 1;
      post.hasUpvoted = true;
    }

    setPosts(newPosts);
  };


  const handleAddComment = (index) => {
    const newPosts = [...posts];
    const comment = newPosts[index].newComment.trim();
    if (comment) {
      newPosts[index].comments.push(comment);
      newPosts[index].newComment = "";
      newPosts[index].isCommenting = false;
      setPosts(newPosts);
    }
  };

  const handleCommentChange = (index, event) => {
    const newPosts = [...posts];
    newPosts[index].newComment = event.target.value;
    setPosts(newPosts);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(URL.createObjectURL(file));
    }
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const timeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(diff / 1000 / 60 / 60);
    const days = Math.floor(diff / 1000 / 60 / 60 / 24);

    if (minutes < 60) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
  };


  const handlePostSubmit = async (e) => {
    e.preventDefault()

    if (!niche.length || !problem || !solution || !costRange) {
      alert("Please fill in all fields and select at least one niche.");
      return;
    }
    if (niche.length > 0 && problem && solution && costRange) {
      const newPost = {
        user: user ? user.username : "Your name",
        image: null,
        upvotes: 0,
        comments: [],
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
        description: `Problem Statement: ${problem} Solution: ${solution} Niche: ${niche} Cost: ${costRange}`,
        timestamp: new Date(),
        hasUpvoted: false,
        isCommenting: false,
        newComment: "",
      };
      
      try {
        const response = await fetch("http://localhost:3000/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPost),
        });
        if (response.ok) {
          const savedPost = await response.json();
          setFeed((prevFeed) => [savedPost, ...prevFeed]);

          setPosts([newPost, ...posts]);
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
          // fetchPosts();
          setIsFormVisible(false);
        }

        else {
          alert("Your post contains prohibited content. Please revise and try again.");
        }
      } catch (error) {
        console.error("Error saving post:", error);
        alert("An error occurred while saving the post.");
      }

    } else {
      alert("Please fill in all fields and select at least one niche.");
    }

  };

  // const fetchPosts = async () => {
  //   try {
  //     const response = await fetch("http://localhost:3000/posts");
  //     if (response.ok) {
  //       const data = await response.json();
  //       setPosts(data); // Set the posts in state
  //     }
  //   } catch (error) {
  //     console.error("Error fetching posts:", error);
  //   }
  // };
  // useEffect(() => {
  //   fetchPosts();
  // }, []);



  return (
    <div className="bg-white shadow-lg min-h-screen ">
      <Header />


      <div className="max-w-6xl mx-auto py-8 ">
        <div className="flex flex-col flex-1 p-4 rounded-lg max-w-5xl mx-auto">
          <div className="flex items-center justify-center p-4">
            <button
              onClick={toggleFormVisibility}
              className="bg-gradient-to-r from-green-600 to-green-800 shadow-lg text-white py-2 px-4 rounded-lg"
            >
              {isFormVisible ? "Cancel" : "Post Idea"}
            </button>
          </div>



          <div className="border-2 border-green-800 rounded-lg">
            {isFormVisible && (
              <div className="p-4 border border-gray-300 rounded-lg mt-4">
                <h2 className="text-lg font-bold mb-4">Post Your Idea</h2>
                <form onSubmit={handlePostSubmit}>


                  <div className="mb-4  ">
                    <label className="block text-sm font-medium text-gray-700">
                      Select Niches (You can choose multiple)
                    </label>
                    <div className="mt-1 space-y-2">
                      {["Finance", "Tech", "Health", "Education", "E-commerce"].map((nicheOption) => (
                        <label key={nicheOption} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            value={nicheOption}
                            checked={niche.includes(nicheOption)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNiche([...niche, nicheOption]);
                              } else {
                                setNiche(niche.filter((n) => n !== nicheOption));
                              }
                            }}
                            className="form-checkbox text-green-600"
                          />
                          <span>{nicheOption}</span>
                        </label>
                      ))}
                    </div>
                  </div>




                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Problem Statement
                    </label>
                    <input
                      type="text"
                      value={problem}
                      onChange={(e) => setProblem(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="Enter the problem statement of your idea"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Solution Overview
                    </label>
                    <textarea
                      value={solution}
                      onChange={(e) => setSolution(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="Enter your USP/Value reposition"
                    />
                  </div>


                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="Enter your company name"
                    />
                  </div>


                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Company URL
                    </label>
                    <input
                      type="url"
                      value={companyUrl}
                      onChange={(e) => setCompanyUrl(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="https://example.com"
                    />
                  </div>



                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Add Link to Your Product (Optional)
                    </label>
                    <input
                      type="url"
                      value={productLink}
                      onChange={(e) => setProductLink(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="https://example.com/product"
                    />
                  </div>


                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Where is your company based?
                    </label>
                    <select
                      value={companyLocation}
                      onChange={(e) => setCompanyLocation(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    >
                      <option value="">Select City</option>
                      {["Karachi", "Lahore", "Islamabad", "Faisalabad", "Multan", "Rawalpindi"].map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>


                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      How many active users or customers do you have?
                    </label>
                    <input
                      type="number"
                      value={activeUsers}
                      onChange={(e) => setActiveUsers(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="Enter number of active users/customers"
                    />
                  </div>


                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Are you working full-time on this?
                    </label>
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
                    <label className="block text-sm font-medium text-gray-700">
                      Money looking to raise
                    </label>
                    <input
                      type="text"
                      value={costRange}
                      onChange={(e) => setCostRange(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="Enter amount you are looking to raise"
                    />
                  </div>



                  <button
                    type="submit"
                    className="bg-gradient-to-r from-green-600 to-green-800 shadow-lg text-white py-2 px-4 rounded-lg"
                  >
                    Submit
                  </button>
                </form>
              </div>
            )}
          </div>


          <div className="mt-6 space-y-4">
            {posts.map((post, index) => (

              <div key={post.id} className="border-2 border-green-800 rounded-lg p-4 bg-white shadow-md overflow-hidden">
              
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button className="text-gray-600 hover:text-green-400">
                      <UserCircleIcon className="h-6 w-6" />
                    </button>
                    <h2 className="font-bold">{post.user}</h2>
                  </div>
                  <span className="text-gray-400">
                    {timeAgo(post.timestamp)}
                  </span>
                </div>


               


                <div className="p-4 border rounded-lg shadow-md bg-white">
                  <div className="mt-4">
                    <p className="text-gray-600 mb-2">
                      <strong>Problem Statement:</strong> {post.problem}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <strong>Solution(USP/Value Reposition):</strong> {post.solution}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <strong>Niche:</strong> {post.niches}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <strong>Money looking to raise:</strong> {post.costRange}
                    </p>
                  </div>
                  <br></br>
                  <h1 className="text-gray-600 mb-2"><strong> Company Name:</strong></h1>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {post.companyName}
                  </h3>

                  {post.companyUrl && (
                    <a
                      href={post.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-green-600 font-medium transition-all mb-4 block"
                      style={{ textDecoration: "none" }}
                    >
                      Visit Company Website
                    </a>
                  )}

                  {post.productLink && (
                    <a
                      href={post.productLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-green-600 font-medium transition-all mb-4 block"
                      style={{ textDecoration: "none" }}
                    >
                      Check Product
                    </a>
                  )}

                  <p className="text-gray-600 mb-2">
                    <strong>Location:</strong> {post.companyLocation}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <strong>Active Users:</strong> {post.activeUsers}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <strong>Working Full-Time:</strong> {post.isFullTime ? "Yes" : "No"}
                  </p>

                  {post.image && (
                    <div className="w-full mt-4">
                      <div className="flex justify-center items-center">
                        <img
                          src={post.image}
                          alt="Post Image"

                          className="w-full max-w-sm object-contain rounded-lg shadow-lg"
                        />
                      </div>
                    </div>
                  )}
                </div>



                <div className="p-4 border-t border-gray-200 flex justify-between items-center">
                  <button
                    onClick={() => handleUpvote(index)}
                    className="flex items-center gap-1 text-gray-600 hover:text-green-400"
                  >
                    <HandThumbUpIcon className="h-5 w-5" />
                    {post.upvotes} {post.upvotes === 1 ? "Upvote" : "Upvotes"}
                  </button>

                  <button
                    onClick={() => {
                      const newPosts = [...posts];
                      newPosts[index].isCommenting = true;
                      setPosts(newPosts);
                    }}
                    className="flex items-center gap-1 text-gray-600 hover:text-green-400"
                  >
                    <ChatBubbleLeftIcon className="h-5 w-5" />

                    {post.comments.length} {post.comments.length === 1 ? "Comment" : "Comments"}
                  </button>
                </div>

                {post.isCommenting && (
                  <div className="p-4">
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      placeholder="Write your comment..."
                      value={post.newComment}
                      onChange={(e) => handleCommentChange(index, e)}
                    />
                    <button

                      className="bg-gradient-to-r from-green-600 to-green-800 shadow-lg text-white py-2 px-4 rounded-lg"
                      onClick={() => handleAddComment(index)}
                    >
                      Post Comment
                    </button>
                  </div>
                )}

                {post.comments.length > 0 && (
                  <div className="p-4 border-t border-gray-200">
                    {post.comments.map((comment, idx) => (
                      <div key={idx} className="text-gray-600">
                        {comment}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="w-1/3"></div>
      </div>
    </div>
  );
};

export default HomePage;
