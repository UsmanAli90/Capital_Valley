import React, { useState } from "react";
import { useEffect } from "react";
import Header from './Header'
import logo from '../../assets/Home/logo.png'
import { UserCircleIcon, HandThumbUpIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/outline";


const HomePage = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [upvotes, setUpvotes] = useState([0, 0]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [niche, setNiche] = useState([]);
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [description, setDescription] = useState("");
  const [costRange, setCostRange] = useState("");
  const [feed, setFeed] = useState([]);
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "User1",
      image: logo,
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
      image: logo,
      problem: "None",
      solution: "None",
      upvotes: 0,
      comments: [],
      description: "Another description",
      timestamp: new Date(),
      hasUpvoted: false,
      isCommenting: false,
      newComment: ""
    },

  ]);


  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  // const handleUpvote = (index) => {
  //   const newPosts = [...posts];
  //   if (!newPosts[index].hasUpvoted) {
  //     newPosts[index].upvotes += 1;
  //     newPosts[index].hasUpvoted = true;
  //     setPosts(newPosts);
  //   }
  // };

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

  //handleFormSubmit is not called anywhere commented myself(Usman Ali)


  // const handleFormSubmit = (e) => {
  //   e.preventDefault();


  //   if (niche.length > 0 && problem && solution && costRange) {
  //     const newPost = {
  //       user: "User3", // Update this with Dynamic User asap(Usman Ali)
  //       image: null,
  //       upvotes: 0,
  //       comments: [],
  //       problem,
  //       solution,
  //       niches: niche,
  //       costRange,
  //       description: `Problem Statement: ${problem} Solution: ${solution} Niche: ${niche} Cost: ${costRange}`,
  //       // description: `Problem Statement: <strong>${problem}</strong><br>Solution: <strong>${solution}</strong><br>Niche: <strong>(${niche.join(", ")})</strong><br>Cost: <strong>${costRange}</strong>`,

  //       timestamp: new Date(),
  //       hasUpvoted: false,
  //       isCommenting: false,
  //       newComment: "",
  //     };

  //     setPosts([newPost, ...posts]);
  //     setNiche(niche);
  //     setProblem(problem);
  //     setSolution(solution);
  //     setCostRange(costRange);
  //     setIsFormVisible(false);
  //   } else {
  //     alert("Please fill in all fields and select at least one niche.");
  //   }
  // };

  // const handlePostSubmit = async (e) => {
  //   e.preventDefault();

  //   // Validation check for required fields
  //   if (!niche.length || !problem || !solution || !costRange) {
  //     alert("Please fill in all fields and select at least one niche.");
  //     return;
  //   }

  //   // Prepare the new post object
  //   const newPost = {
  //     problem,
  //     solution,
  //     niches: niche, // Array of selected niches
  //     costRange,
  //   };

  //   try {
  //     // Send a POST request to save the post to the backend
  //     const response = await fetch("http://localhost:3000/posts", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(newPost),
  //     });

  //     if (response.ok) {
  //       const savedPost = await response.json();

  //       // Fetch all posts after adding the new post
  //       fetch("http://localhost:3000/posts")
  //         .then((response) => response.json())
  //         .then((data) => setPosts(data)) // Update the feed with the fetched posts
  //         .catch((error) => console.error("Error fetching posts:", error));

  //       // Update the feed with the saved post (optimistic update)
  //       setFeed((prevFeed) => [savedPost, ...prevFeed]);

  //       // Clear form fields
  //       setProblem("");
  //       setSolution("");
  //       setCostRange("");
  //       setNiche([]);
  //     } else {
  //       alert("Failed to save the post. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Error saving post:", error);
  //     alert("An error occurred while saving the post.");
  //   }
  // };




  ////////////////////////////////////////////Working handlepostsubmit..////////////////////////////////////////////////////////////
  const handlePostSubmit = async (e) => {
    e.preventDefault()

    if (!niche.length || !problem || !solution || !costRange) {
      alert("Please fill in all fields and select at least one niche.");
      return;
    }
    if (niche.length > 0 && problem && solution && costRange) {
      const newPost = {
        user: "User3", // Update this with Dynamic User asap(Usman Ali)
        image: null,
        upvotes: 0,
        comments: [],
        problem,
        solution,
        niches: niche,
        costRange,
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
          setCostRange("");
          setNiche([]);
          // fetchPosts();
          setIsFormVisible(false);
        }

        else {
          alert("Failed to save the post. Please try again.");
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
                      placeholder="Enter the overview of your solution"
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
          </div>


          {/* To display posts after form submissions (but description needs fixing(Try splitting up the form conten)) */}
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