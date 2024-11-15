document.addEventListener("DOMContentLoaded", () => {
  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  const token = getCookie("token");
  if (!token) {
    window.location.pathname = '/login';
  }

  const modal = document.querySelector('.modal');
  const updateModal = document.querySelector('.update-info-modal');
  const backgroundOverlay = document.createElement('div');
  backgroundOverlay.classList.add('background-overlay');
  document.body.appendChild(backgroundOverlay);

  // Close Modals
  function closeModals() {
    modal.classList.remove('active');
    updateModal.classList.remove('active');
    backgroundOverlay.classList.remove('active');
  }

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

  function hideOverlay() {
    const overlay = document.querySelector(".image-overlay");
    if (overlay) {
      overlay.style.display = "none"; // Hide the overlay
    }
  }

  const getUserProfile = async () => {
    try {
      const response = await fetch('https://bookify-l8ec.onrender.com/api/userProfileOwner');
      const user = await response.json();

      if (response.ok) {
        const profileDetailsHTML = `
          <div class="profile-img"></div>
          <div class="profile-info">
            <h2>${[user.firstname, user.middlename, user.lastname].filter(Boolean).join(' ')}</h2>
            <span class="user-bio"><h2>Bio:</h2><h3>${user.bio || '#NO-BIO'}</h3></span>
            <button class="edit-button open-modal-btn">Edit Profile</button>
          </div>
        `;
        document.querySelector(".profile-details").innerHTML = profileDetailsHTML;

        const profileImg = document.querySelector(".profile-img");
        if (user.userProfilePicture) {
          profileImg.style.backgroundImage = `url('${user.userProfilePicture}')`;
          profileImg.style.backgroundSize = 'cover';
          profileImg.style.backgroundPosition = 'center';

          profileImg.addEventListener("click", () => {
            showImageOverlay(user.userProfilePicture);
          });
        }

        const contactInfoHTML = `
          <div class="contact-item">
            <i class="fas fa-envelope"></i>
            <span>${user.email || 'Email not provided'}</span>
          </div>
          <div class="contact-item">
            <i class="fas fa-phone-alt"></i>
            <span>${user.number || '#NO-NUMBER'}</span>
          </div>
          <div class="contact-item">
            <i class="fas fa-map-marker-alt"></i>
            <span>${user.address || '#NO-ADDRESS'}</span>
          </div>
          <button class="update-button open-update-modal-btn">
            <i class="fas fa-plus"></i> Update Information
          </button>
          <button class="upload-book-button">
            <i class="fas fa-upload"></i> Upload a Book
          </button>
        `;
        document.querySelector(".contact-details").innerHTML = contactInfoHTML;

        document.querySelector('.edit-button.open-modal-btn').addEventListener('click', () => {
          modal.classList.add('active');
          backgroundOverlay.classList.add('active');
        });
        document.querySelector(".upload-book-button").addEventListener("click", () => {
          window.location.pathname = "/uploadBook";
        });
        document.querySelector('.update-button.open-update-modal-btn').addEventListener('click', () => {
          updateModal.classList.add('active');
          backgroundOverlay.classList.add('active');
        });
      } else {
      }
    } catch (error) {
    }
  };

  getUserProfile();
  document.querySelector(".go-back").addEventListener("click", () => {
    window.location.pathname = "/home";
  });

  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', closeModals);
  });
  backgroundOverlay.addEventListener('click', closeModals);

  document.querySelector(".go-back").addEventListener('click', () => {
    clearCookie('user_id');
  });
  const updateUser = () => {
    document.querySelector("#add-phone").addEventListener("click", async (e) => {
      e.preventDefault();
      const phone = document.querySelector("#phone").value;
      const address = document.querySelector("#address").value;
      if (phone || address) {
        const response = await fetch('https://bookify-l8ec.onrender.com/api/updateUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone: phone || null,
            address: address || null
          })
        })
        const data = await response.json();
        if (response.ok) {
          document.location.pathname = '/yourProfile';
        } else {
          showNotification("red", data.message || data.error || data.result)

        }
      }
    })
  }
  updateUser();
  const updateProfile = () => {
    document.querySelector("#edit-profile-btn").addEventListener("click", async (e) => {
      e.preventDefault();
      const username = document.querySelector("#username").value;
      const bio = document.querySelector("#bio").value;
      const profileImage = document.querySelector("#image-upload").files[0];

      const formData = new FormData();
      if (username) formData.append("username", username);
      if (bio) formData.append("bio", bio);
      if (profileImage) formData.append("profileImage", profileImage);

      const response = await fetch("https://bookify-l8ec.onrender.com/api/updateUser", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      if (!response.ok) {
        showNotification("red", data.message || data.error || data.result)
      }
      else {
        window.location.pathname = '/yourProfile';
      }
    });
  }

  updateProfile();
});

// Optional helper function to clear cookies (placeholder)
function clearCookie(cookieName) {
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
