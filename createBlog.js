import supabase from "./config.js";

// form element
const blogForm = document.getElementById("blogForm");

if (blogForm) {
  blogForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // get logged-in user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first");
      window.location.href = "signUp.html";
      return;
    }

    // get form values
    const ftitle = document.getElementById("ftitle").value;
    const fdescription = document.getElementById("fdescription").value;
    const fcategory = document.getElementById("fcategory").value;
    const imageInput = document.getElementById("fimage");
    const file = imageInput.files[0];

    if (!ftitle || !fdescription || !fcategory || !file) {
      alert("All fields are required");
      return;
    }

    try {
      // upload image
      const fileName = `${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("UserBlogs")
        .upload(fileName, file);

      if (uploadError) {
        alert("Image upload failed");
        return;
      }

      // get public URL
      const { data } = supabase.storage
        .from("UserBlogs")
        .getPublicUrl(fileName);

      const publicUrl = data.publicUrl;

      // insert blog
      const { error: insertError } = await supabase
        .from("formBlog")
        .insert([{
          title: ftitle,
          description: fdescription,
          category: fcategory,
          imageUrl: publicUrl,
          user_id: user.id
        }]);

      if (insertError) {
        alert("Blog creation failed");
      } else {
        alert("Blog created successfully");
        blogForm.reset();
      }

    } catch (err) {
      console.log(err);
    }
  });
}
