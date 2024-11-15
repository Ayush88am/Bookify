document.addEventListener("DOMContentLoaded", () => {
  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }
  const token = getCookie("cookieToken");
  if (!token) {
    window.location.pathname = '/login';
  }
  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }
  document.querySelector(".go-back").addEventListener("click", () => {
    window.location.pathname = "/home";
  })
  function clearCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  document.querySelector(".go-back").addEventListener('click', () => {
    clearCookie('book_id');
  });

  const getUserProfile = async () => {
    const id = getCookie('book_id');
    if (!id) {
      console.log('No book ID cookie found');
      return;
    }

    const response = await fetch(`http://localhost:3000/api/findBook/${id}`);
    const item = await response.json();
    console.log(item);  // Debugging: Log the fetched item to check for bookImageUrl

    const htmlOfProfile = `
      <div class="book-details-container">
        <div class="book-thumbnail"></div>
        <div class="book-details">
          <h1>${item.title}</h1>
          <p>${item.bookDescription}</p>
          <h2><span class="price-icon">&#8377;</span> ${item.price}</h2>
          <h3>Book Author: ${item.author}</h3>
          <h3>Uploaded by: ${item.uploadedBy}</h3>
          <h3>Book Type: ${item.booktype}</h3>
          <h2>Rating: ★★★★☆</h2>
        </div>
        <div class="book-pdf-or-content">
          <iframe id="pdf-cont" src="${item.bookPdfFileUrl}"></iframe>
          <div class="book-content"> BOOK CONTENT : </br>${item.bookContent}</div>
        </div>
      </div>`;

    document.querySelector(".container").innerHTML = htmlOfProfile;
    const pdfElement=document.querySelector("#pdf-cont");
    if (!item.bookPdfFileUrl){
      pdfElement.classList.add('hide');
    }
    const bookContent = document.querySelector(".book-content");
    if (!item.bookContent) {
      bookContent.classList.add('hide');
    }
    const profileImgElement = document.querySelector(".book-thumbnail");
    if (profileImgElement) {
      console.log("Setting background image for:", item.bookImageUrl);  // Log image URL for debugging
      if (item.bookImageUrl) {
        profileImgElement.style.backgroundImage = `url('${item.bookImageUrl}')`;
      } else {
        profileImgElement.style.backgroundImage = `url('default-image.jpg')`;  // Fallback image
      }
      profileImgElement.style.backgroundSize = 'contain';
      profileImgElement.style.backgroundRepeat = 'no-repeat';


      profileImgElement.style.backgroundPosition = 'center';
      profileImgElement.style.width = 'fit';
      profileImgElement.style.height = '300px';  // Ensure height is set
    }
  };

  getUserProfile();
});
