import React, { useState } from "react";
import Header from './Header'
import logo from '../../assets/Home/logo.png'
import { UserCircleIcon, HandThumbUpIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/outline";


const handleFormSubmit = (e) => {
  e.preventDefault();

  if (niche && title && description && costRange) {
    const newPost = {
      id: posts.length + 1,
      user: "User3", // Update this with Dynamic User asap(Usman Ali)
      image: null, 
      upvotes: 0,
      comments: [],
      description: `${title}: ${description} (${niche}, Cost: ${costRange})`,
      timestamp: new Date(),
      hasUpvoted: false,
      isCommenting: false,
      newComment: "",
    };

    setPosts([newPost, ...posts]);
    setNiche("");
    setTitle("");
    setDescription("");
    setCostRange("");
    setIsFormVisible(false); 
  } else {
    alert("Please fill in all fields.");
  }
};

const HomePage = () => {
  const [upvotes, setUpvotes] = useState([0, 0]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "User1",
      image: logo,
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
      image: logo,
      upvotes: 0,
      comments: [],
      description: "Another description",
      timestamp: new Date(),
      hasUpvoted: false,
      isCommenting: false,
      newComment: ""
    },

  ]);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };
  const handleUpvote = (index) => {
    const newPosts = [...posts];
    if (!newPosts[index].hasUpvoted) {
      newPosts[index].upvotes += 1;
      newPosts[index].hasUpvoted = true;
      setPosts(newPosts);
    }
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

  const handlePostSubmit = () => {
    if (description) {
      const newPost = {
        id: posts.length + 1,
        user: "User3",
        image: selectedFile || null,
        upvotes: 0,
        comments: [],
        description: description,
        timestamp: new Date(),
        hasUpvoted: false,
        isCommenting: false,
        newComment: "",
      };
      setPosts([newPost, ...posts]);
      setSelectedFile(null);
      setDescription("");
    }
  };

  const [niche, setNiche] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [costRange, setCostRange] = useState("");

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

          {isFormVisible && (
            <div className="p-4 border border-gray-300 rounded-lg mt-4">
              <h2 className="text-lg font-bold mb-4">Post Your Idea</h2>
              <form onSubmit={handleFormSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Niche
                  </label>
                  <select
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  >
                    <option value="">Select a Niche</option>
                    <option value="Finance">Finance</option>
                    <option value="Tech">Tech</option>
                    <option value="Health">Health</option>
                    <option value="Education">Education</option>
                    <option value="E-commerce">E-commerce</option>
                    {/* Add more niches as needed */}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Problem Statement
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    placeholder="Enter the problem statement of your idea"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Proposed Solution
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    placeholder="Enter the proposed solution for your idea"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Cost Range
                  </label>
                  <input
                    type="text"
                    value={costRange}
                    onChange={(e) => setCostRange(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    placeholder="Enter cost range (e.g., $1000 - $5000)"
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



          {selectedFile && (
            <div className="border-2 border-green-800 rounded-lg p-4 mt-4 bg-white shadow-md">
              <div className="flex flex-col space-y-2">
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Write something about your photo..."
                  value={description}
                  onChange={handleDescriptionChange}
                />
                <button
                  className="self-start bg-gradient-to-r from-green-600 to-green-800 text-white py-2 px-4 rounded-lg"
                  onClick={handlePostSubmit}
                >
                  Post
                </button>
              </div>


              <div className="mt-4">
                <h3 className="font-bold text-lg mb-2">Selected Photo:</h3>
                <div className="flex justify-center items-center">
                  <img
                    src={selectedFile}
                    alt="Uploaded"
                    className="w-full max-w-sm object-contain rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {!selectedFile && description && (
            <div className="border-2 border-green-800 rounded-lg p-4 mt-4 bg-white shadow-md">
              <h3 className="font-bold text-lg">Write a Post:</h3>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Write your description..."
                value={description}
                onChange={handleDescriptionChange}
              />
              <button
                className="mt-4 bg-gradient-to-r from-green-600 to-green-800 text-white py-2 px-4 rounded-lg"
                onClick={handlePostSubmit}
              >
                Post
              </button>
            </div>
          )}


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
                  <span className="text-gray-400">{timeAgo(post.timestamp)}</span>
                </div>

                <div className="p-4">
                  <p className="text-gray-700 mb-4">{post.description}</p>
                  {post.image && (
                    <div className="w-full">
                      <div className="flex justify-center items-center">
                        <img
                          src={post.image}
                          alt="Post Image"
                          className="w-full max-w-sm object-contain rounded-lg"
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
                      className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-lg"
                      onClick={() => handleAddComment(index)}
                    >
                      Post Comment
                    </button>
                  </div>
                )}

                {post.comments.length > 0 && (
                  <div className="p-4 border-t border-gray-200">
                    {post.comments.map((comment, idx) => (
                      <div key={idx} className="text-gray-600">{comment}</div>
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