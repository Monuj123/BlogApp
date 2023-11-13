const Blog = require("../models/Blog");
const User = require("../models/User");
const mongoose = require("mongoose");
const getAllBlogs = async (req, res, next) => {
  let blogs;
  try {
    blogs = await Blog.find();
  } catch (err) {
    console.log(err);
  }
  if (!blogs) {
    return res.status(404).json({ message: "No blogs found" });
  }
  return res.status(200).json({ blogs });
};
const addBlog = async (req, res, next) => {
  const { title, description, image, user } = req.body;
  let existingUser;
  try {
    existingUser = await User.findById(user);
  } catch (err) {
    return console.log(err);
  }

  if (!existingUser) {
    return res.status(400).json({ message: "Unable to find user by this ID" });
  }
  const blog = new Blog({
    title,
    description,
    image,
    user,
  });

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await blog.save({ session });
    existingUser.blogs.push(blog);
    await existingUser.save({ session });
    await session.commitTransaction();
  } catch (err) {
    return console.log(err);
  }
  return res.status(200).json({ blog });
};

const updateBlog = async (req, res, next) => {
  const { title, description } = req.body;
  const blogId = req.params.id;

  let blog;
  try {
    blog = await Blog.findByIdAndUpdate(blogId, {
      title,
      description,
    });
  } catch (err) {
    return console.log(err);
  }

  if (!blog) {
    return res.status(500).json({ message: "Unable to update the blog" });
  }
  return res.status(200).json({ blog });
};
const getById = async (req, res, next) => {
  const id = req.params.id;

  let blog;
  try {
    blog = await Blog.findById(id);
  } catch (err) {
    return console.log(err);
  }

  if (!blog) {
    return res.status(404).json({ message: "No blogs found" });
  }
  return res.status(200).json({ blog });
};

const deleteBlog = async (req, res, next) => {
  const Id = req.params.id;

  try {
    blog = await Blog.findByIdAndDelete(Id).populate("user");
    await blog.user.blogs.pull(blog);
    await blog.user.save();
  } catch (err) {
    return console.log(err);
  }
  if (!blog) {
    return res.status(400).json({ message: "Unable to Delete" });
  }
  return res.status(200).json({ message: "Successfully Deleted" });
};
const getBlogById = async (req, res, next) => {
  const userId = req.params.id;
  let userBlogs;
  try {
    userBlogs = await User.findById(userId).populate("blogs");
  } catch (err) {
    return console.log(err);
  }

  if (!userBlogs) {
    return res.status(404).json({ message: "no blog found" });
  }
  return res.status(200).json({ user: userBlogs });
};
module.exports = {
  getAllBlogs,
  addBlog,
  updateBlog,
  getById,
  deleteBlog,
  getBlogById,
};