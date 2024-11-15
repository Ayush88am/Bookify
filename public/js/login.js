document.addEventListener("DOMContentLoaded",()=>{

  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }
  const token = getCookie("cookieToken");
  if(token){
    window.location.pathname = '/home';

  }
  const tokenSaved = (token) => {
    document.cookie = `cookieToken=${token}; path=/;`;
  };
function showNotification(color,message) {
  const notification = document.getElementById("notification");
  const notificationMessage = document.getElementById("notification-message");

  notificationMessage.textContent = message;
  notification.style.color = color;
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000); 
}


const userRegister = () => {
  document.querySelector('#submit').addEventListener('click', async (e) => {
    e.preventDefault();
    let email = document.querySelector('#email').value;
    let password = document.querySelector('#password').value;
    if(!email || !password) {
      showNotification("red", "Enter both email and password");
      return;
    }
    if (password.length <= 5) {
      showNotification("red", "Password length should be atleast 5")
      return;
    }
    const response = await fetch('http://localhost:3000/api/userLogin', {
      method: "POST",
      body: JSON.stringify({
        email,
        password
      }),
      headers: {
        'content-type': 'application/json'
      },
      credentials: 'include'
    })
    const data = await response.json();
    if (!response.ok) {
      showNotification("red", data.message || data.error || data.result)
    }
    else{
      tokenSaved(data.token);
      showNotification("green", data.message || data.error || data.result)
      setTimeout(() => {
        window.location.pathname='/home';
      }, 1000);
    }
  })
}
userRegister();
})