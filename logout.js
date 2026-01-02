import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11.10.5/+esm';
import supabase from "./config.js";
console.log(supabase);

let logoutbtn = document.getElementById("logout");

async function  logout(e) {
   e.preventDefault()
try{
     const { error } = await supabase.auth.signOut()
     if(error){
        console.log(error)
     }
     else{
        // alert("logout Successfully!")
        // location.href = "signup.html";
 Swal.fire({
  icon: 'success',
  title: 'LogOut Successful!',
  text: 'Welcome to Blogger Platform',
}).then(() => {
  window.location.href = "signUp.html"; // redirect after popup
});

     }
}
catch(err){
    console.log(err)
}
    
}
logoutbtn && logoutbtn.addEventListener('click',logout)


