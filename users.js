import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11.10.5/+esm';
import supabase from "./config.js";

async function displayAllUsers() {
    const userTableBody = document.getElementById("userTableBody");

    // 1. Pehle Check karein ke Admin Login hai ya nahi
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    // 2. Role Check (BlogCustomer table se)
    const { data: adminProfile } = await supabase
        .from('BlogCustomer')
        .select('role')
        .eq('uid', user.id)
        .single();

    if (adminProfile?.role !== 'admin') {
        alert("Sirf Admin ye page dekh sakta hai!");
        window.location.href = "index.html";
        return;
    }

    // 3. Saare Users Fetch karein
    const { data: allUsers, error } = await supabase
        .from('BlogCustomer')
        .select('*'); // '*' ka matlab saara data

    if (error) {
        console.error("Error fetching users:", error);
        return;
    }

    // 4. Table mein Data Render karein
    userTableBody.innerHTML = ""; // Pehle purana data saaf karein

    allUsers.forEach((customer) => {
        userTableBody.innerHTML += `
            <tr>
                <td>${customer.name || 'No Name'}</td>
                <td>${customer.email}</td>
                <td>
                    <span class="badge ${customer.role === 'admin' ? 'bg-danger' : 'bg-primary'}">
                        ${customer.role}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteUser('${customer.uid}')">
                        <i class="fa-solid fa-trash"></i> Remove
                    </button>
                </td>
            </tr>
        `;
    });
}

// Delete User Function (Global banana parega taake HTML button pe chale)
window.deleteUser = async (uid) => {
    const confirmation = await Swal.fire({
        title: 'User Delete Karein?',
        text: "Iska data database se nikal jayega!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Haan, Delete!'
    });

    if (confirmation.isConfirmed) {
        const { error } = await supabase
            .from('BlogCustomer')
            .delete()
            .eq('uid', uid);

        if (!error) {
            Swal.fire("Deleted!", "User record removed.", "success");
            displayAllUsers(); // List refresh karein
        }
    }
}

// Page load hote hi function chalayein
displayAllUsers();