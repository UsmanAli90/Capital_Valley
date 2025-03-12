
const Post = require("../models/Post");
const Contract = require("../models/Contract");
const getPostSolutionById = async (req, res) => {
    try {
        const { postId } = req.params;
        
        if (!postId) {
            return res.status(400).json({ 
                success: false, 
                message: "Post ID is required" 
            });
        }

        // Find the post by ID
        const post = await Post.findById(postId);
        
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }
        
        // Check if the user has permission to view this solution
        // This assumes you have contracts that link users to posts they've invested in
        const contract = await Contract.findOne({
            $or: [
                { senderId: req.user.id, postId: postId, isAccepted: true },
                { receiverId: req.user.id, postId: postId, isAccepted: true }
            ]
        });
        
        if (!contract && req.user.id !== post.userId) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to view this solution"
            });
        }
        
        // Return selected fields from the post document
        const solution = {
            _id: post._id,
            // title: post.title,
            description: post.problem,
            solution: post.solution,
            // tags: post.tags,
            // createdAt: post.createdAt,
            // updatedAt: post.updatedAt
        };
        
        return res.status(200).json({
            success: true,
            solution
        });
        
    } catch (error) {
        console.error("Error in getPostSolutionById:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching post solution",
            error: error.message
        });
    }
};

module.exports = {
    getPostSolutionById
  };