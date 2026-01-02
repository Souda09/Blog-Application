
import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11.10.5/+esm';

import supabase from "./config.js";

export async function renderBlogs(containerId) {
  const blogContainer = document.getElementById(containerId);
  if (!blogContainer) return;

  // 1. Get Logged-in User & Role
  const { data: { user } } = await supabase.auth.getUser();
  
  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from('BlogCustomer')
      .select('role')
      .eq("uid", user.id)
      .single();
    isAdmin = profile?.role === "admin";
  }

  // 2. Fetch Blogs
  const { data: blogs, error } = await supabase
    .from("formBlog")
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.log("Fetch Error:", error);
    return;
  }

  blogContainer.innerHTML = `<h1 class="text-center mb-4">Your Blog Diary</h1>`;
  
  // Grid row open
  let rowHtml = '<div class="row">';

  blogs.forEach(blog => {
    // SECURITY CHECK: Kya ye user owner hai ya admin?
    const isOwner = user && blog.user_id === user.id;
    
    // Sirf buttons tab dikhayenge jab permission ho
    const buttonsHtml = (isAdmin || isOwner) ? `
      <div class="mt-auto d-flex gap-2">
        <button class="btn btn-sm btn-warning edit-btn" data-id="${blog.id}">Edit</button>
        <button class="btn btn-sm btn-danger delete-btn" data-id="${blog.id}">Delete</button>
      </div>
    ` : `<p class="text-muted small">View Only</p>`;

    rowHtml += `
      <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
        <div class="card h-100 shadow-sm">
          <img src="${blog.imageUrl || 'https://via.placeholder.com/180'}" class="card-img-top" style="height:180px; object-fit:cover">
          <div class="card-body d-flex flex-column">
            <h6 class="fw-bold">${blog.title}</h6>
            <p class="text-muted small">${blog.description.slice(0, 80)}...</p>
            <span class="badge bg-secondary mb-2" style="width: fit-content;">${blog.category}</span>
            ${buttonsHtml}
          </div>
        </div>
      </div>
    `;
  });

  rowHtml += '</div>';
  blogContainer.innerHTML += rowHtml;

  // 3. Attach Delete Events (With Security Check)
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.onclick = async () => {
      const id = btn.dataset.id;
      
      const confirmDelete = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      });

      if (confirmDelete.isConfirmed) {
        // Double check on DB side with .eq('user_id', user.id) if not admin
        let query = supabase.from("formBlog").delete().eq("id", id);
        
        // Agar admin nahi hai to query mein user_id lazmi check karein security ke liye
        if (!isAdmin) {
          query = query.eq("user_id", user.id);
        }

        const { error: delError } = await query;

        if (delError) {
          Swal.fire("Error", "You don't have permission to delete this.", "error");
        } else {
          Swal.fire("Deleted!", "Post has been removed.", "success")
          .then(() => renderBlogs(containerId));
        }
      }
    };
  });

  // 4. Attach Edit Events
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.onclick = () => {
      window.location.href = `edit.html?id=${btn.dataset.id}`;
    };
  });
}