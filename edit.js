
import supabase from "./config.js";

const params = new URLSearchParams(window.location.search);
const blogId = params.get("id");

// Form Fields
const editTitle = document.getElementById("editTitle");
const editDescription = document.getElementById("editDescription");
const editCategory = document.getElementById("editCategory");
const updateBtn = document.getElementById("updateBtn");

async function checkAccessAndFillForm() {
    // 1. Login User ki info lein
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (!user || authError) {
        window.location.href = "./logIn.html";
        return;
    }

    // 2. Blog ka data lein (formBlog table se)
    const { data: blog, error: blogError } = await supabase
        .from("formBlog")
        .select("*")
        .eq("id", blogId)
        .single();

    if (blogError || !blog) {
        Swal.fire("Error", "Blog not found!", "error");
        return;
    }

    // 3. User ka Role check karein (BlogCustomer table se)
    const { data: customerData } = await supabase
        .from('BlogCustomer')
        .select('role')
        .eq("uid", user.id)
        .single();

    const isAdmin = customerData?.role === "admin";
    const isOwner = blog.user_id === user.id; // Aapke column ka naam 'user_id' hai

    // 4. SECURITY CHECK: Agar na Admin hai na Owner, to bahar nikal do
    if (!isAdmin && !isOwner) {
        Swal.fire({
            icon: 'error',
            title: 'Unauthorized!',
            text: 'You can only edit your own blogs.'
        }).then(() => {
            window.location.href = "./index.html";
        });
        return;
    }

    // 5. Agar access hai to form fill karein
    editTitle.value = blog.title;
    editDescription.value = blog.description;
    editCategory.value = blog.category;

    // 6. UPDATE CLICK HANDLER
    updateBtn.addEventListener("click", async () => {
        updateBtn.disabled = true;
        updateBtn.innerText = "Updating...";

        const { error } = await supabase
            .from("formBlog")
            .update({
                title: editTitle.value,
                description: editDescription.value,
                category: editCategory.value
            })
            .eq("id", blogId);

        if (error) {
            Swal.fire("Error", error.message, "error");
            updateBtn.disabled = false;
            updateBtn.innerText = "Update Blog";
        } else {
            Swal.fire("Success", "Blog updated successfully", "success")
            .then(() => {
                window.location.href = "./index.html"; 
            });
        }
    });
}

// Function call karein
checkAccessAndFillForm();