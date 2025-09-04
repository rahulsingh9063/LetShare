const express = require("express");
const { createPostController, getAllPostsController, getUserPostsController, deleteUserPostController, updateUserPostController } = require("../controllers/postController");
const { requireSignIn } = require("../controllers/userController");
const { use } = require("react");

const router = express.Router();

router.post("/create-post", requireSignIn, createPostController);

//get all posts
router.get("/get-posts", getAllPostsController);


//get user posts
router.get("/get-user-posts", requireSignIn, getUserPostsController);

//delete user posts
router.delete("/delete-user-post/:postId", requireSignIn, deleteUserPostController);


//delete user posts
router.put("/update-user-post/:postId", requireSignIn, updateUserPostController);


module.exports = router;
