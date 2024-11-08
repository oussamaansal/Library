
const userIsAdmin = document.querySelector('meta[name="isAdmin"]').getAttribute('content');
/// Page Loaded
document.addEventListener("DOMContentLoaded", function () {
  
  


});
///SideBar Buttons
document.getElementById("sideBarBooks").onclick = function () {
  allBooks();
};
document.getElementById("sideBarAuthors").onclick = function () {
  allAuthors();
};
document.getElementById("sideBarGenres").onclick = function () {
  allGenres();
};
document.getElementById("sideBarFavorites").onclick = function () {
  allBooks();
};
//

document.getElementById("searchButton").addEventListener("click", function () {
  query = document.getElementById("searchInput").value;
  console.log(query);
  if (query) {
    fetch(`api/books/?search=${query}`)
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        console.log(data);
        displaybooks(data);
      })
      .catch((error) => console.error("Error:", error));
  }
});

///Fetching Functions
function allBooks() {
  fetch("api/books/allBooks/")
    .then((response) => response.json())
    .then((data) => {
      
      displaybooks(data);
    });
}
function allGenres() {
  fetch("/genres/")
    .then((response) => response.json())
    .then((data) => {
     
      displayCardGenre(data);
    });
}
function allAuthors() {
  fetch("/authors/")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      displayCardAuthor(data);
    });
}
function allFavorites() {
  fetch("api/books/allBooks/")
    .then((response) => response.json())
    .then((data) => {
      displaybooks(data);
    });
}
///
/// Extra functions
function booksByGenre(genre) {
  fetch(`/api/books/genre/${genre}/`)
    .then((response) => response.json())
    .then((books) => {
      
      displaybooks(books);
     
    });
}
///

/// Display functions
function displaybooks(books) {
  const booksList = document.getElementById("content");
  booksList.innerHTML = "";
  books.forEach((book) => {
    const genres = book.genre.map((g) => g.name).join(", ");
    const bookelement = document.createElement("div");
    bookelement.className = "card-sl";
    bookelement.innerHTML = ` <div class="card-image">
            <img
                src="${book.image}" />
        </div>

        <a class="card-action" href="#"><i class="fa fa-heart"></i></a>
        <div class="card-heading">
            ${book.title}
        </div>
        <div class="card-text">
            Author : ${book.author}
        </div>
        <div class="card-text">
           Read : ${book.read_count}
        </div>
        <div class="card-text">
           Genre : ${genres}
        </div>

        <button  class="card-button" onclick='show_details(${book.id})' ><span class='cardBtnText'> Preview</span></button>
    </div> `;
    booksList.appendChild(bookelement);
  });
}
function show_details(bookId) {
  fetch(`/api/books/${bookId}/bookDetails/`)
    .then((response) => response.json())
    .then((book) => {
      // Set modal content
      document.getElementById("book-title").textContent = book.title;
      document.getElementById(
        "book-author"
      ).textContent = `Author: ${book.author}`;
      document.getElementById("book-genres").textContent = `Genres: ${book.genre
        .map((g) => g.name)
        .join(", ")}`;
      document.getElementById(
        "book-read-count"
      ).textContent = `Read Count: ${book.read_count}`;
      document.getElementById("book-image").src = book.image;

      // Set download link and action button
      document.getElementById("download-pdf-btn").href = book.pdf;

      // Show the modal
      const modal = new bootstrap.Modal(
        document.getElementById("exampleModalCenter")
      );
      modal.show();
    })
    .catch((error) => {
      console.error("Error fetching book details:", error);
    });
}
function displayCardGenre(data) {
  const genreList = document.getElementById("content");
  genreList.innerHTML = "";
  data.forEach((data) => {
    const dataElement = document.createElement("div");
    dataElement.className = "card card-genre";
    dataElement.innerHTML = `
    <img src="${data.imageGenre}" class="card-img" alt="${data.name}" />
    <div class="card-img-overlay"></div>
    <div class="card-body">
        <h4 class="card-title">${data.name}</h4>
    </div>`;
    dataElement.onclick = () =>{ booksByGenre(data.name);} 
       
    
    genreList.appendChild(dataElement);
  });
}
function displayCardAuthor(data){
  const authorList = document.getElementById("content");
  authorList.innerHTML = "";
  data.forEach((data) => {
    const dataElement = document.createElement("div");
    dataElement.className = "card card-author";
    dataElement.innerHTML = `
    <img src="${data.imageAuthor}" class="card-img" alt="${data.name}" />
    <div class="card-img-overlay"></div>
    <div class="card-body">
        <h4 class="card-title">${data.name}</h4>
    </div>`;
    dataElement.onclick = () =>{ displaybooks(data.books);} 
       
    
   
    authorList.appendChild(dataElement);
  });

}