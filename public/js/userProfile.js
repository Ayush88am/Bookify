document.addEventListener("DOMContentLoaded", () => {
  // Function to get a cookie by name
  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  const token = getCookie("token");
  if (!token) {
    window.location.pathname = '/login';
  }

  // Go back button with cookie clearance
  function clearCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  document.querySelector(".go-back").addEventListener("click", () => {
    clearCookie('user_id');
    window.location.pathname = "/home";
  });

  // Fetch and populate user profile
  const getUserProfile = async () => {
    const id = getCookie('user_id');
    if (!id) {
      console.log('No user ID cookie found');
      return;
    }

    const response = await fetch(`http://localhost:3000/api/getUser/profile/${id}`);
    const item = await response.json();

    const htmlOfProfile = `
      <div class="profile-img"></div>
      <div class="profile-info">
        <h2>${[item.firstname, item.middlename, item.lastname].filter(name => name).join(' ')}</h2>
        <span class="user-bio"><h2>Bio:</h2><h3>${item.bio || '#NO-BIO'}</h3></span>
      </div>`;

    document.querySelector(".profile-details").innerHTML = htmlOfProfile;

    const profileImgElement = document.querySelector(".profile-img");
    if (profileImgElement && item.userProfilePicture) {
      profileImgElement.style.backgroundImage = `url('${item.userProfilePicture}')`;
      profileImgElement.style.backgroundSize = 'cover';
      profileImgElement.style.backgroundPosition = 'center';
    }

    const htmlOfProfileAdditional = `
      <div class="contact-item">
        <i class="fas fa-envelope"></i>
        <span>${item.email || 'Email not given by user'}</span>
      </div>
      <div class="contact-item">
        <i class="fas fa-phone-alt"></i>
        <span>${item.phoneNumber || '#NO-NUMBER'}</span>
      </div>
      <div class="contact-item">
        <i class="fas fa-map-marker-alt"></i>
        <span>${item.address || '#NO-ADDRESS'}</span>
      </div>`;

    document.querySelector(".contact-details").innerHTML = htmlOfProfileAdditional;

    // Image enlargement feature
    profileImgElement.addEventListener("click", () => {
      const imageUrl = item.userProfilePicture;
      showImageOverlay(imageUrl);
    });
  };

  getUserProfile();

  // Function to show image overlay
  function showImageOverlay(imageUrl) {
    let overlay = document.querySelector(".image-overlay");

    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "image-overlay";
      overlay.innerHTML = `
      <span class="close-image" id="close-image-now">&times;</span>
      <img class="overlay-image" src="${imageUrl}" alt="Enlarged View">`;
      document.body.appendChild(overlay);

      // Close overlay when clicking the close button or outside the image
      overlay.querySelector("#close-image-now").addEventListener("click", hideOverlay);
      overlay.addEventListener("click", (event) => {
        if (event.target === overlay) hideOverlay();
      });
    }

    overlay.querySelector(".overlay-image").src = imageUrl;
    overlay.style.display = "flex"; // Show the overlay
  }

  // Function to hide the overlay
  function hideOverlay() {
    const overlay = document.querySelector(".image-overlay");
    if (overlay) {
      overlay.style.display = "none"; // Hide the overlay
    }
  }
});
