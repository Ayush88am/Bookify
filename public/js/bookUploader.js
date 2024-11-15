document.addEventListener("DOMContentLoaded", function () {
  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }
  const token = getCookie("token");
  if (!token) {
    window.location.pathname = '/login';
  }
  const steps = document.querySelectorAll("li");


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

  function markStepActive(index) {
    steps.forEach((step, idx) => {
      const icon = step.querySelector(".icons");
      const label = step.querySelector(".label");
      const stepCircle = step.querySelector(".step");
      const checkmark = stepCircle.querySelector(".awesome");

      if (idx <= index) {
        stepCircle.classList.add("complete");
        stepCircle.style.backgroundColor = "gold";
        icon.style.color = "gold";
        label.style.color = "gold";
        checkmark.style.color = "black";
        checkmark.style.display = "block";
      } else {
        stepCircle.classList.remove("complete");
        stepCircle.style.backgroundColor = "#8e44ad";
        icon.style.color = "#8e44ad";
        label.style.color = "white";
        checkmark.style.color = "#fff";
        checkmark.style.display = "none";
      }
    });
  }

  const alertMessage = (id, color, Alertmessage) => {
    const message = document.querySelector(`#${id}`);
    message.classList.remove("hide");
    message.innerText = Alertmessage;
    message.style.color = color;
    setTimeout(() => {
      message.classList.add("hide");
    }, 3000);
  };
   document.querySelector(".go-back").addEventListener("click",()=>{
      window.location.pathname="/home";
   })
  let bookId = "";

  const handleBookDetails = () => {
    const container = document.querySelector("#cont-1");
    container.classList.remove("hide");
     document.querySelector("#cont-2").classList.add('hide');
    document.querySelector("#cont-3").classList.add('hide');
    document.querySelector("#book-submit").addEventListener("click", async (e) => {
      e.preventDefault();


      const bookInfo = document.querySelector("#bookInfo");

      if (!bookInfo.checkValidity()) {
        bookInfo.reportValidity();
        return;
      }

      const formData = new FormData(bookInfo);
      const formObj = {
        title: formData.get("BookTitle"),
        booktype: formData.get("BookType"),
        price: parseFloat(formData.get("BookPrice")),
        author: formData.get("BookAuthor"),
        bookDescription: formData.get("bookDescription"),
        uploadedBy: formData.get("uploaderName"),
      };

      try {
        const response = await fetch("http://localhost:3000/api/uploadAnBook", {
          method: "POST",
          body: JSON.stringify(formObj),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await response.json();
        if (!response.ok) {
          showNotification("red", data.message || data.error || data.result);

          bookInfo.reset();
        } else {
          markStepActive(0);
          container.classList.add("hide");
          bookId = data.book._id;
          handleBookContent();
        }
      } catch (error) {
        showNotification("red", data.message || data.error || data.result);

      }
    });
  };

  const handleBookContent = () => {
    const container = document.querySelector("#cont-2");
    container.classList.remove("hide");
    document.getElementById("upload-cont").addEventListener("click", async (e) => {
      e.preventDefault();
      
      const bookInfo = document.querySelector("#form-submit-data");
      const formData = new FormData(bookInfo);
      const data1= document.querySelector("#BookContent").value;
      const data2=document.querySelector("#myfile").value;
      if(!data1 && !data2){
        showNotification("red", "fill atleast one field");
        return;
      }


      formData.append("bookId", bookId );
      if (!formData.get("myfile")) {
        formData.append("bookContent", document.getElementById("BookContent").value);
      }

      try {
        const response = await fetch("http://localhost:3000/api/uploadBookPdf", {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        const data = await response.json();
        if (!response.ok) {
          showNotification("red", data.message || data.error || data.result);
          bookInfo.reset();
        } else {
          markStepActive(1);
          container.classList.add("hide");
          handleBookThumbnail();
        }
      } catch (error) {
        
        showNotification("red", "Failed to upload book content.");
        
      }
    });
  };
const handleBookThumbnail=()=>{
  const container = document.querySelector("#cont-3");
  container.classList.remove("hide");
  document.querySelector("#thumbnail-sub").addEventListener('click',async(e)=>{
    e.preventDefault();

    const bookThumbnailform=document.querySelector('#thumbnail-upload');
    if (!bookThumbnailform.checkValidity()) {
      bookInfo.reportValidity();
      return;
    }
   
    const form = new FormData(bookThumbnailform);
    form.append("bookId", bookId);
    try {
      const response = await fetch("https://bookify-l8ec.onrender.com/api/uploadBookThumbnail",{
      method:"POST",
      body:form,
      credentials:"include"
    })
    const data = await response.json();
    if (!response.ok) {
      showNotification("red",data.message || data.error || data.result);
    } else {
      markStepActive(2);
      bookInfo.reset();
      window.location.pathname="/home";

    }
  } catch (error) {
    showNotification("red", data.message || data.error || data.result);

  }
  })

}

  handleBookDetails();

});