import supabase from "./config.js";
console.log(supabase)

let logform = document.getElementById("logform")
let lemail = document.getElementById("lemail")
let lpassword = document.getElementById("lpassword")


async function Login(e){
    e.preventDefault()

    try{
        if(! lemail.value){
            alert("Please enter  email")
            return
        }
        else if(! lpassword.value){
            alert("Please enter password")
            return
        }

const { data, error } = await supabase.auth.signInWithPassword({
  email: lemail.value.trim(),
  password: lpassword.value.trim(),
})

if(error){
    console.log(error)
}
else{
    console.log(data)
    // alert("Login Successfully")
    // location.href= "home.html";
 Swal.fire({
  icon: 'success',
  title: 'Login Successful!',
  text: 'Welcome to Blogger Platform',
}).then(() => {
  window.location.href = "index.html"; // redirect after popup
});

}
}
    catch(err){
        console.log(err)
    }
}
console.log("Login JS loaded successfully")

logform && logform.addEventListener('submit', Login)