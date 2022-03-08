const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

try {
  mongoose.connect("mongodb://localhost:27017/blogDB");
  console.log("DB connected");
} catch (error) {
  console.log("Error\n" + error);
}

const blogSchema = mongoose.Schema({
  title: String,
  content: String,
});

const Blog = mongoose.model("Blog", blogSchema);

const homePageContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";

const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


app.get("/", async (_req, res) => {
  const posts = await Blog.find();
  res.render("home", { startingContent: homePageContent, posts });
});

app.get("/about", (_req, res) => {
  res.render("about", { aboutContent });
});

app.get("/contact", (_req, res) => {
  res.render("contact", { contactContent });
});

app.get("/posts/:postId", async (req, res) => {
  const { postId } = req.params
  const post = await Blog.find({ _id: postId });
  if (post.length > 0) {
    res.render("post", { post });
  } else {
    res.render("404");
  }
});


app.route("/compose")
  .get((_req, res) => {
    res.render("compose");
  })
  .post(async (req, res) => {
    const post = new Blog({
      title: req.body.postTitle,
      content: req.body.postBody,
    });
    try {
      await post.save();
      res.redirect("/");
    } catch (error) {
      console.log(error);
      res.render("404");
    }
  });

app.post("/post/delete", async (req, res) => {
  const { postId } = req.body;
  try {
    const post = await Blog.deleteOne({ _id: postId });
    if (post.deletedCount === 0) {
      res.render("404")
    }
    res.redirect("/");
  } catch (error) {
    res.send(error);
  }
})

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
