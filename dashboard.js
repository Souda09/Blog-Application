
import supabase from "./config.js";
import { renderBlogs } from "./blogRender.js";

// Check User Role Immediately
async function checkRole() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        window.location.href = "./logIn.html";
        return;
    }

    const { data, error } = await supabase
        .from('BlogCustomer')
        .select('role')
        .eq("uid", user.id)
        .single();

    if (error || data.role !== "admin") {
        Swal.fire({ icon: 'error', title: 'Access Denied!' })
        .then(() => window.location.href = "./index.html");
    }
}
checkRole();

// Initial Render
document.addEventListener("DOMContentLoaded", () => {
    renderBlogs("blogContainer");
});

// Modal Instances
const editModal = new bootstrap.Modal(document.getElementById('editBlogModal'));
const deleteModal = new bootstrap.Modal(document.getElementById('deleteBlogModal'));

// Global ID storage for delete
let deleteId = null;

// Event Delegation for Edit and Delete buttons
document.addEventListener("click", async (e) => {
    const target = e.target;

    // Handle Edit Click
    if (target.classList.contains("edit-btn") || target.parentElement.classList.contains("edit-btn")) {
        const btn = target.closest(".edit-btn");
        document.getElementById("editBlogId").value = btn.dataset.id;
        document.getElementById("editTitle").value = btn.dataset.title;
        document.getElementById("editDescription").value = btn.dataset.description;
        document.getElementById("editCategory").value = btn.dataset.category;
        editModal.show();
    }

    // Handle Delete Click
    if (target.classList.contains("delete-btn") || target.parentElement.classList.contains("delete-btn")) {
        const btn = target.closest(".delete-btn");
        deleteId = btn.dataset.id;
        deleteModal.show();
    }
});

// Update Function
document.getElementById("updateBlogBtn").addEventListener("click", async () => {
    const id = document.getElementById("editBlogId").value;
    const updateData = {
        title: document.getElementById("editTitle").value,
        description: document.getElementById("editDescription").value,
        category: document.getElementById("editCategory").value,
    };

    const { error } = await supabase
        .from("formBlog")
        .update(updateData)
        .eq("id", id);

    if (error) {
        Swal.fire("Error", error.message, "error");
    } else {
        editModal.hide();
        Swal.fire("Updated!", "Blog post updated successfully", "success")
        .then(() => location.reload());
    }
});

// Delete Function
document.getElementById("confirmDeleteBtn").addEventListener("click", async () => {
    if (!deleteId) return;

    const { error } = await supabase
        .from("formBlog")
        .delete()
        .eq("id", deleteId);

    if (error) {
        Swal.fire("Error", error.message, "error");
    } else {
        deleteModal.hide();
        Swal.fire("Deleted!", "Post has been removed", "success")
        .then(() => location.reload());
    }
});