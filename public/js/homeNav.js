document.addEventListener("DOMContentLoaded", () => {
  // Toggle Search
  const toggleSearchButton = document.querySelector('.toggle-search');
  if (toggleSearchButton) {
    toggleSearchButton.addEventListener('click', () => {
      const searchContainer = document.querySelector('.search-container');
      const logo = document.querySelector(".logo");
      const profileDropdown = document.querySelector(".profile-dropdown");
      const navGoBackIcon = document.querySelector(".nav-go-back-icon");

      if (searchContainer && logo && profileDropdown && navGoBackIcon) {
        searchContainer.classList.add('temp-class');
        toggleSearchButton.classList.add('hide');
        logo.classList.add('hide');
        profileDropdown.classList.add('hide');
        navGoBackIcon.classList.remove('hide');
      }
    });
  }

  // Toggle Back Search
  const toggleBackSearchButton = document.querySelector('.nav-go-back-icon');
  if (toggleBackSearchButton) {
    toggleBackSearchButton.addEventListener('click', () => {
      const searchContainer = document.querySelector('.search-container');
      const logo = document.querySelector(".logo");
      const profileDropdown = document.querySelector(".profile-dropdown");
      const toggleSearch = document.querySelector(".toggle-search");

      if (searchContainer && logo && profileDropdown && toggleSearch) {
        searchContainer.classList.remove('temp-class');
        toggleBackSearchButton.classList.add('hide');
        logo.classList.remove('hide');
        profileDropdown.classList.remove('hide');
        toggleSearch.classList.remove('hide');
      }
    });
  }

  // Toggle Dropdown Menu
  const dropdown = document.getElementById("dropdownMenu");
  const profileIcon = document.querySelector('.profile-icon');
  if (profileIcon && dropdown) {
    profileIcon.addEventListener("click", () => {
      dropdown.classList.toggle("show");
    });

    window.onclick = function (event) {
      if (!event.target.closest('.profile-icon')) {
        if (dropdown.classList.contains('show')) {
          dropdown.classList.remove('show');
        }
      }
    };
  }

  // Search Input Focus and Blur
  const searchInput = document.querySelector('.search-input');
  const searchItemsContainer = document.querySelector('.search-items-container');

  if (searchInput && searchItemsContainer) {
    searchInput.addEventListener('focus', () => {
      searchItemsContainer.classList.remove('hide');
    });

    searchInput.addEventListener('blur', () => {
      setTimeout(() => searchItemsContainer.classList.add('hide'), 200);
    });
  }
});



//---------------------------------------------------------------------

window.addEventListener("DOMContentLoaded", () => {
  const selectedId = () => {
    const select = document.querySelector(".custom-select");
    return select.options[select.selectedIndex].id;
  };

  const idSaved = (id) => {
    document.cookie = `user_id=${id}; path=/;`;
    window.location.pathname = "/user";

  };
  const bookIdSaved = (id) => {
    document.cookie = `book_id=${id}; path=/;`;
    window.location.pathname="/book";
  }
  const searchingItem = () => {
    const searchInput = document.querySelector('.search-input');
    const searchItemsContainer = document.querySelector('.search-items-container');
    const searchItems = searchItemsContainer.querySelector('.searching-items');
    let itemsArray = [];

    searchInput.addEventListener('input', async (e) => {
      const selectId = selectedId();
      if (selectId === "book") {
        try {
          const response = await fetch(`http://localhost:3000/api/searchBook?bookName=${e.target.value}`);
          const data = await response.json();

          itemsArray = Array.isArray(data) ? data.map((item) => {
            return `<div class="item" id="book-${item._id}" style="border-bottom:1px solid gainsboro; padding: 10px; height: fit-content; width: 13rem; border-radius: 10px; cursor: pointer; display: flex; flex-wrap: wrap; align-items: center; gap: 0.6rem;">
              <img src="${item.bookImageUrl}" alt="" height="50px" width="50px" style="border-radius: 50%; object-fit: cover;">
              <h2 style="font-size: medium;">${item.title}</h2>
            </div>`;
          }) : ['<h5>NOT FOUND ! ENTER SOMETHING ELSE</h5>'];
          searchItems.innerHTML = itemsArray.slice(0, 15).join('');
          searchItems.addEventListener('click', (event) => {
            const clickedItem = event.target.closest('.item');
            if (clickedItem && clickedItem.id.startsWith('book-')) {
              const userId = clickedItem.id.split('-')[1];
              bookIdSaved(userId);
            }
          });
        } catch (error) {
          console.error("Error fetching book data:", error);
        }
      } else {
        try {
          const response = await fetch(`http://localhost:3000/api/searchUser/profile?username=${e.target.value}`);
          const data = await response.json();

          itemsArray = Array.isArray(data) ? data.map((item) => {
            return `<div class="item" id="user-${item._id}" style="border-bottom:1px solid gainsboro; padding: 10px; height: fit-content; width: 13rem; border-radius: 10px; cursor: pointer; display: flex; flex-wrap: wrap; align-items: center; gap: 0.6rem;">
              <img src="${item.userProfilePicture || ''}" alt="" height="50px" width="50px" style="border-radius: 50%; object-fit: cover; border:1px solid white;">
              <h2 style="font-size: medium;">${[item.firstname, item.middlename, item.lastname].filter(name => name).join(' ')}</h2>
            </div>`;
          }) : ['<h5>NOT FOUND ! ENTER SOMETHING ELSE</h5>'];

          // Set HTML and delegate click event to the container
          searchItems.innerHTML = itemsArray.slice(0, 15).join('');

          // Event delegation for saving ID on click
          searchItems.addEventListener('click', (event) => {
            const clickedItem = event.target.closest('.item');
            if (clickedItem && clickedItem.id.startsWith('user-')) {
              const userId = clickedItem.id.split('-')[1];
              idSaved(userId);
            }
          });
        } catch (error) {
          console.error("Error fetching user profile data:", error);
        }
      }
    });
  };

  searchingItem();
  function showNotification(color, message) {
    const notification = document.getElementById("notification");
    const notificationMessage = document.getElementById("notification-message");

    notificationMessage.textContent = message;
    notification.style.color = color;
    notification.classList.add("show");

    setTimeout(() => {
      notification.classList.remove("show");
    }, 3000);
  }
  const profileSettings = async () => {
    const profileButton = document.querySelector(".profile-icon");
    const response = await fetch("http://localhost:3000/api/userProfileOwner");
    const data = await response.json();
    profileButton.style.backgroundImage = `url('${data.userProfilePicture}')`;

    document.querySelector("#logout-user").addEventListener('click', async () => {
      const response = await fetch("http://localhost:3000/api/user/logout");
      await response.json();
      if (response.ok){
        showNotification("green","Logout successFully");
        setTimeout(() => {
          window.location.pathname="/login";
        }, 1000);
      }
      else{
        showNotification("red", "Some error occured");
      }
    });
    document.querySelector("#see-profile").addEventListener('click', async () => {
      window.location.pathname="/yourProfile";
    })
    document.querySelector("#upload-book").addEventListener('click', async () => {
      window.location.pathname = "/uploadBook";
    })
  };

  profileSettings();
});
