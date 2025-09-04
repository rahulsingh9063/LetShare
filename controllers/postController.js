const postModel = require("../models/postModel");

const createPostController = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(400).send({
        success: false,
        message: "Please provide all the fields",
      });
    }

    const post = new postModel({
      title,
      description,
      postedBy: req.auth._id, // ✅ works with express-jwt
    });

    await post.save(); // ✅ important!

    res.status(201).send({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in creating post",
      error: error.message,
    });
  }
};

//Get all posts
const getAllPostsController = async (req, res) => {
  try {
    const posts = await postModel.find({}).populate("postedBy", "-password").sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "All posts fetched successfully",
      posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching posts",
      error: error.message,
    });
  }
};

//get user posts
const getUserPostsController = async (req, res) => {
  try {
    const userPosts = await postModel.find({ postedBy: req.auth._id }).populate("postedBy", "-password").sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "User posts fetched successfully",
      userPosts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching user posts",
      error: error.message,
    });
  }
};

//delete user post
const deleteUserPostController = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).send({
        success: false,
        message: "Post not found",
      });
    }

    // Check if the logged-in user is the owner of the post
    if (post.postedBy.toString() !== req.auth._id) {
      return res.status(403).send({
        success: false,
        message: "You are not authorized to delete this post"
      });
    }

    await postModel.findByIdAndDelete(postId);
    res.status(200).send({
      success: true,
      message: "Post deleted successfully",
      post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in deleting post",
      error: error.message,
    });
  }
};

// ✅ UPDATE USER POST - Now properly implemented
const updateUserPostController = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, description } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(400).send({
        success: false,
        message: "Please provide title and description"
      });
    }

    // Find the post
    const post = await postModel.findById(postId);
    
    if (!post) {
      return res.status(404).send({
        success: false,
        message: "Post not found"
      });
    }

    // Check if the user is authorized to update this post
    if (post.postedBy.toString() !== req.auth._id.toString()) {
      return res.status(403).send({
        success: false,
        message: "You are not authorized to update this post"
      });
    }

    // Update the post
    const updatedPost = await postModel.findByIdAndUpdate(
      postId,
      { title, description },
      { new: true }
    ).populate('postedBy', '-password');

    res.status(200).send({
      success: true,
      message: "Post updated successfully",
      post: updatedPost
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error updating post",
      error: error.message
    });
  }
};

module.exports = { 
  createPostController, 
  getAllPostsController, 
  getUserPostsController, 
  deleteUserPostController, 
  updateUserPostController 
};