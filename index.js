import supabase from "./config.js";


import { renderBlogs } from "./blogRender.js";

document.addEventListener("DOMContentLoaded", () => {
  renderBlogs("blogContainer"); // "blogContainer" tumhare div ka id
});


const createBlogBtns = document.querySelectorAll(".createBlogBtn");

createBlogBtns.forEach((btn) => {
  btn.addEventListener("click", async () => {

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      window.location.href = "createBlog.html";
    } else {
      alert("Please login first");
      window.location.href = "signUp.html";
    }

  });
});
