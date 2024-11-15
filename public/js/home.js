
window.addEventListener("load", () => {
  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }
  const token = getCookie("token");
  if (!token) {
    window.location.pathname = '/login';
  }
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
  const horizontalScroller = (leftArrow, rightArrow, carousel) => {
    if (leftArrow && rightArrow && carousel) {
      leftArrow.addEventListener('click', () => {
        carousel.scrollBy({
          left: -300,
          behavior: 'smooth'
        });
      });

      rightArrow.addEventListener('click', () => {
        carousel.scrollBy({
          left: 300,
          behavior: 'smooth'
        });
      });
    }
  };

  const carouselArrowLeft1 = document.querySelectorAll('.carousel-container')[0].querySelector('.left-arrow');
  const carouselArrowRight1 = document.querySelectorAll('.carousel-container')[0].querySelector('.right-arrow');
  const carousel1 = document.querySelectorAll('.carousel')[0];
  horizontalScroller(carouselArrowLeft1, carouselArrowRight1, carousel1);

  const carouselArrowLeft2 = document.querySelector('#leftSw');
  const carouselArrowRight2 = document.querySelector('#rightSw');
  const carousel2 = document.querySelectorAll('.carousel')[1];
  horizontalScroller(carouselArrowLeft2, carouselArrowRight2, carousel2);

  const randomNumber = (lengthOfArray) => Math.floor(Math.random() * lengthOfArray);

  const fetchBookData = async () => {
    const response = await fetch("https://bookify-l8ec.onrender.com/api/findBooks");
    const data = await response.json();
    if (!response.ok){
      showNotification("red", data.message)
    }
    else{
       return data;
    }
  };
  
  const bookIdSaved=(id)=>{
    document.cookie = `book_id=${id}; path=/;`;
  }
  const carouselBookes = async () => {
    const carousel = document.querySelector('#bookes-all');
    const data = await fetchBookData();
    const arrayOfBooks = Array.isArray(data) ? data.map((book) => (
      `<div class="book-card" id="book-${book._id}">
        <img src="${book.bookImageUrl}" class="book-image">
        <div class="card-info">
          <h3 class="book-title">${book.title}</h3>
          <p class="book-details">Author: ${book.author}<br>Category: ${book.booktype}</p>
          <p class="book-description">${book.bookDescription}.</p>
        </div>
      </div>`
    )) : [];
    arrayOfBooks.sort(() => Math.random() - 0.5);
    carousel.innerHTML = arrayOfBooks.join('');
    carousel.addEventListener('click', (event) => {
      const clickedItem = event.target.closest('.book-card');
      if (clickedItem && clickedItem.id.startsWith('book-')) {
        const bookId = clickedItem.id.split('-')[1];
        bookIdSaved(bookId);
        window.location.pathname = "/book";

      }
    })
  };

  const idSaved = (id) => {
    document.cookie = `user_id=${id}; path=/;`;
  };

  const popBooks = async () => {
    const popBooks = document.querySelector('.bookPop');
    const data = await fetchBookData();
    const popBooksArray = Array.isArray(data) ? data.map((book) => (
      `<div class="book-1" style="width:30rem; height:500px" id="book-${book._id}">
        <img src="${book.bookImageUrl}" alt="Another Book cover" class="book-image" style="border-top-left-radius: 1rem; border-top-right-radius: 1rem;">
        <h1 style="text-align: center; font-weight: 900;">${book.title}</h1>
      </div>`
    )) : [];
    let randomNumber1 = randomNumber(popBooksArray.length);
    let randomNumber2 = randomNumber(popBooksArray.length);
    popBooks.innerHTML = popBooksArray[randomNumber1] + popBooksArray[randomNumber2];
    popBooks.addEventListener('click', (event) => {
      const clickedItem = event.target.closest('.book-1');
      if (clickedItem && clickedItem.id.startsWith('book-')) {
        const bookId = clickedItem.id.split('-')[1];
        bookIdSaved(bookId);
        window.location.pathname = "/book";

      }
    })
  };

  const gridOfbooks = async () => {
    const data = await fetchBookData();
    const grid = document.querySelector('.card-grid');
    const arrayOfBooks = Array.isArray(data) ? data.map((book) => (
      `<div class="single-card" id="book-${book._id}" style="cursor:pointer">
        <img src="${book.bookImageUrl}" alt="Book 1 cover" class="card-image">
        <div class="card-details">
          <h3 class="card-title">${book.title}</h3>
          <p class="card-meta">Author: ${book.author}<br>Category: ${book.booktype}</p>
          <p class="card-description">${book.bookDescription}</p>
        </div>
      </div>`
    )) : [];

    grid.innerHTML = arrayOfBooks.slice(arrayOfBooks.length - 6, arrayOfBooks.length).join('');
    grid.addEventListener('click', (event) => {
      const clickedItem = event.target.closest('.single-card');
      if (clickedItem && clickedItem.id.startsWith('book-')) {
        const bookId = clickedItem.id.split('-')[1];
        bookIdSaved(bookId);
        window.location.pathname = "/book";

      }
  })
  };

  const carouselUsers = async () => {
    const response = await fetch("https://bookify-l8ec.onrender.com/api/findUsers");
    const data = await response.json();
    if (!response.ok) {
      return showNotification("red", data.message)
    }
    const carousel = document.querySelector("#users-all");
    const bottonTrass = document.querySelector("#bottom-trass");

    const arrayOfUsers = Array.isArray(data) ? data.map((user) => (
      `<div class="profile-card" id="user-${user._id}">
        <img src="${user.userProfilePicture || ''}" alt="User 1" class="profile-image">
        <p class="username">${[user.firstname, user.middlename, user.lastname].filter(name => name).join(' ')}</p>
      </div>`
    )) : [];
    carousel.innerHTML = arrayOfUsers.join('');

    document.querySelectorAll('.profile-card').forEach(card => {
      const userId = card.id.split('-')[1];
      card.addEventListener('click', () =>{ idSaved(userId)
        window.location.pathname="/user";
      });
    });

    const bookdata = await fetchBookData();
    const bookarray = Array.isArray(bookdata) ? bookdata.map((book) => (
      `<div class="book-1 onlyOne" id="book-${book._id}">
        <img src="${book.bookImageUrl}" alt="Another Book cover" class="book-image" style="border-top-left-radius: 1rem; border-top-right-radius: 1rem;">
        <h1 style="text-align: center; font-weight: 900;">${book.title}</h1>
      </div>`
    )) : [];

    const randomNumber1 = Math.floor(Math.random() * bookarray.length);
    const randomNumber2 = Math.floor(Math.random() * arrayOfUsers.length);

    let newHtmlForRandom2 = `
      <div class="book-1 tras-container" id="user-${data[randomNumber2]._id}" style="border-radius: 50%; justify-content: center;">
        <img src="${data[randomNumber2].userProfilePicture}" alt="user" class="book-image tras">
      </div>`;

    bottonTrass.innerHTML = bookarray[randomNumber1] + newHtmlForRandom2;

    const userIdPop = document.querySelector(".tras-container");
    const bookIdPop = document.querySelector(".onlyOne");
    if (bookIdPop){
      const idGot = bookIdPop.id.split('-')[1];
      userIdPop.addEventListener('click', () => {
        bookIdSaved(idGot)
        window.location.pathname="/book";
      });
    }
    if (userIdPop) {
      const idGot = userIdPop.id.split('-')[1];
      userIdPop.addEventListener('click', () =>{ idSaved(idGot) ;
        window.location.pathname="/user";
      });
    } else {
      console.warn("Element with .tras-container not found");
    }
  };
  const realBooksOnly = async () => {
    const data = await fetchBookData();
    for (const item of data) {
      if (!item?.title || (!item?.bookPdfFileUrl && !item?.bookContent) || !item?.bookImageUrl) {
        try {
          if (item?._id) {  
            const response = await fetch(`https://bookify-l8ec.onrender.com/api/deleteBook/${item._id}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json"
              }
            });

            if (!response.ok) throw new Error(`Failed to delete book with ID ${item._id}`);

            const result = await response.json();
            console.log(`Deleted book with ID ${item._id}:`, result);
          } else {
            console.error("Item ID is missing, cannot delete:", item);
          }
        } catch (error) {
          console.error("Error:", error.message);
        }
      }
    }
  };

  realBooksOnly();
  carouselBookes();
  popBooks();
  gridOfbooks();
  carouselUsers();
});
