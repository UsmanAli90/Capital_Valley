import React, { useState } from "react";
import Header from "./Header";
import logo from "../img/logo.png"; // Adjust the path if necessary
import { UserCircleIcon, HandThumbUpIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/outline";

const HomePage = () => {
  const [upvotes, setUpvotes] = useState([0, 0]); // One count for each post
  const [selectedFile, setSelectedFile] = useState(null); // Store selected file for upload
  const [description, setDescription] = useState(""); // Store description input
  const [posts, setPosts] = useState([ // Initialize with some dummy posts
    { 
      id: 1, 
      user: "User1",
      image: logo, 
      upvotes: 0, 
      comments: [], 
      description: "Sample description", 
      timestamp: new Date(), 
      hasUpvoted: false, 
      isCommenting: false,  // New state for showing comment input
      newComment: "" // New state for storing the new comment input
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

  // Function to handle upvotes
  const handleUpvote = (index) => {
    const newPosts = [...posts];
    if (!newPosts[index].hasUpvoted) {
      newPosts[index].upvotes += 1; // Increment upvote count for the specific post
      newPosts[index].hasUpvoted = true; // Mark the post as upvoted
      setPosts(newPosts);
    }
  };

  // Function to handle adding a comment
  const handleAddComment = (index) => {
    const newPosts = [...posts];
    const comment = newPosts[index].newComment.trim(); // Get the new comment text
    if (comment) {
      newPosts[index].comments.push(comment); // Add comment to the post
      newPosts[index].newComment = ""; // Reset the comment input field
      newPosts[index].isCommenting = false; // Hide the input field after posting
      setPosts(newPosts);
    }
  };

  // Function to handle comment input change
  const handleCommentChange = (index, event) => {
    const newPosts = [...posts];
    newPosts[index].newComment = event.target.value; // Update the comment input field
    setPosts(newPosts);
  };

  // Function to handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(URL.createObjectURL(file)); // Set the selected file for preview
    }
  };

  // Function to handle description change
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value); // Update description text
  };

  // Function to format time difference (e.g., "5 minutes ago")
  const timeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp); // Time difference in milliseconds
    const minutes = Math.floor(diff / 1000 / 60); // Convert to minutes
    const hours = Math.floor(diff / 1000 / 60 / 60); // Convert to hours
    const days = Math.floor(diff / 1000 / 60 / 60 / 24); // Convert to days

    if (minutes < 60) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
  };

  // Function to handle post submission
  const handlePostSubmit = () => {
    if (description) {
      const newPost = {
        id: posts.length + 1,
        user: "User3", // Example user
        image: selectedFile || null, // If no image selected, leave it null
        upvotes: 0,
        comments: [],
        description: description,
        timestamp: new Date(), // Save the current time when post is created
        hasUpvoted: false,
        isCommenting: false,
        newComment: "",
      };
      setPosts([newPost, ...posts]); // Add the new post with uploaded photo and description
      setSelectedFile(null); // Reset the file
      setDescription(""); // Reset description field
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen ">
      {/* Header */}
      <Header />

      {/* Content Section */}
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
  <div className="p-4 bg-white shadow-lg rounded-lg w-full max-w-md">
    {/* Upload Section */}
    <header className="bg-white shadow-sm p-4 flex items-center justify-between rounded-lg">
      <button className="text-gray-600 hover:text-blue-500">
        <UserCircleIcon className="h-6 w-6" />
      </button>
      <input
        type="text"
        placeholder="What's on your mind..."
        className="border border-gray-300 rounded-lg p-2 w-1/3 outline-none focus:ring-2 focus:ring-blue-400"
        value={description}
        onChange={handleDescriptionChange} // Capture description text input
      />
      <div className="relative">
        {/* Hidden file input */}
        <input
          type="file"
          id="fileInput"
          className="hidden"
          onChange={handleFileChange} // Handle file selection
        />
        {/* Styled upload button */}
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-lg"
          onClick={() => document.getElementById("fileInput").click()} // Trigger file input
        >
          Upload Photo
        </button>
      </div>
    </header>

    {selectedFile && (
  <div className="mt-4 p-4 bg-white shadow-md rounded-lg">
    {/* Description Input and Post Button */}
    <div className="flex flex-col space-y-2">
      <textarea
        className="w-full p-2 border border-gray-300 rounded-lg"
        placeholder="Write something about your photo..."
        value={description}
        onChange={handleDescriptionChange} // Update description as user types
      />
      <button
        className="self-start bg-blue-500 text-white py-2 px-4 rounded-lg"
        onClick={handlePostSubmit} // Submit the post with image and description
      >
        Post
      </button>
    </div>

    {/* Display Selected Image */}
    <div className="mt-4">
      <h3 className="font-bold text-lg mb-2">Selected Photo:</h3>
      <img
        src={selectedFile}
        alt="Uploaded"
        className="w-full object-cover rounded-lg"
      />
    </div>
  </div>
)}

        {/* Display Post without Image Option */}
        {!selectedFile && description && (
          <div className="mt-4 p-4 bg-white shadow-md rounded-lg">
            <h3 className="font-bold text-lg">Write a Post:</h3>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Write your description..."
              value={description}
              onChange={handleDescriptionChange} // Update description as user types
            />
            <button
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
              onClick={handlePostSubmit} // Submit the description as a post
            >
              Post
            </button>
          </div>
        )}

        {/* Posts Section */}
        <div className="mt-6 space-y-4">
          {posts.map((post, index) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Post Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button className="text-gray-600 hover:text-blue-500">
                    <UserCircleIcon className="h-6 w-6" />
                  </button>
                  <h2 className="font-bold">{post.user}</h2>
                </div>
                <span className="text-gray-400">{timeAgo(post.timestamp)}</span>
              </div>

              {/* Post Content */}
              <div className="p-4">
                <p className="text-gray-700 mb-4">{post.description}</p>
                {post.image && (
                  <div className="w-full">
                    <img
                      src={post.image}
                      alt="Post Image"
                      className="w-full object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Post Actions */}
              <div className="p-4 border-t border-gray-200 flex justify-between items-center">
                {/* Upvote Button */}
                <button
                  onClick={() => handleUpvote(index)}
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-500"
                >
                  <HandThumbUpIcon className="h-5 w-5" />
                  {post.upvotes} {post.upvotes === 1 ? "Upvote" : "Upvotes"}
                </button>

                {/* Comment Button */}
                <button
                  onClick={() => {
                    const newPosts = [...posts];
                    newPosts[index].isCommenting = true; // Show the input field when clicked
                    setPosts(newPosts);
                  }}
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-500"
                >
                  <ChatBubbleLeftIcon className="h-5 w-5" />
                  {post.comments.length} {post.comments.length === 1 ? "Comment" : "Comments"}
                </button>
              </div>

              {/* Comment Input Field (only shown if isCommenting is true) */}
              {post.isCommenting && (
                <div className="p-4">
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Write your comment..."
                    value={post.newComment}
                    onChange={(e) => handleCommentChange(index, e)} // Update new comment
                  />
                  <button
                    className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-lg"
                    onClick={() => handleAddComment(index)} // Post the comment
                  >
                    Post Comment
                  </button>
                </div>
              )}

              {/* Display Comments */}
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
</div>

    </div>
  );
};

export default HomePage;