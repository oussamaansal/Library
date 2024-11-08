// Global variables to store fetched Data
let genresData = [];
let selectedGenres = [];

document.getElementById("adminBarBooks").addEventListener("click", function () {
  changeModalItems("books");
  allBooks();
});
document
  .getElementById("adminBarAuthors")
  .addEventListener("click", function () {
    changeModalItems("authors");
    allAuthors();
  });
document
  .getElementById("adminBarGenres")
  .addEventListener("click", function () {
    changeModalItems("genre");
    allGenres();
  });
/// Fetch Functions
function allBooks() {
  fetch("api/books/allBooks/")
    .then((response) => response.json())
    .then((data) => {
      displayAdminBooks(data);
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

/// Function to fill select options with genres
function getSelectGenres() {
  fetch("/genres/")
    .then((response) => response.json())
    .then((data) => {
      genresData = data; //fill Genres fetched data
      const selectElement = document.getElementById("genre");

      selectElement.innerHTML =
        '<option value="" disabled>Select genres</option>';

      data.forEach((genre) => {
        const option = document.createElement("option");
        option.value = genre.id;
        option.textContent = genre.name;
        selectElement.appendChild(option);
      });
    });
}
/// Display Function For List of Cards of Books,authors...
function displayAdminBooks(books) {
  const booksList = document.getElementById("content");
  booksList.innerHTML = "";
  books.forEach((book) => {
    const genres = book.genre.map((g) => g.name);
    const bookelement = document.createElement("div");
    bookelement.className = "card adminBooks";
    bookelement.innerHTML = `<div class="card-image">
      <img src="${book.image}" alt="Card Image">
  </div>
  <div class="card-details">
      <h6>${book.title} </h6>
      <span >${book.author}</span>
  </div>
  <div class="card-buttons">
      <button class="btnEdit" id='btnEdit' onclick='show_details(${book.id})'>Edit</button>
      <button class="btnDelete">Delete</button>
  </div>`;
    booksList.appendChild(bookelement);
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
        <div class="button-group">
            <button class="btn btn-danger btn-sm" onclick="deleteGenre('${data.name}')">Delete</button>
            <button class="btn btn-primary btn-sm" onclick="showGenreDetails('${data.id}')">Edit</button>
        </div>
    </div>`;

    genreList.appendChild(dataElement);
  });
}
function displayCardAuthor(data) {
  const authorList = document.getElementById("content");
  authorList.innerHTML = "";

  data.forEach((author) => {
    const dataElement = document.createElement("div");
    dataElement.className = "card card-adminAuthor";
    dataElement.innerHTML = `
          <img src="${author.imageAuthor}" class="card-img" alt="${author.name}" />
          <div class="card-img-overlay"></div>
          <div class="card-body">
              <h4 class="card-title">${author.name}</h4>
              <div class="button-group">
                  <button class="btn btn-primary btn-edit" onclick="showAuthorDetails('${author.id}')">Edit</button>
                  <button class="btn btn-danger btn-delete" onclick="deleteAuthor('${author.id}')">Delete</button>
              </div>
          </div>`;

    authorList.appendChild(dataElement);
  });
}

/// functions of showing details
function show_details(bookId) {
  getSelectGenres();
  let selectElement = document.getElementById("genre");

  fetch(`/api/books/${bookId}/`)
    .then((response) => response.json())
    .then((book) => {
      // Set modal content
      document.getElementById("title").value = book.title;
      document.getElementById("author").value = book.author;
      let selectedGenres = book.genre.map((g) => g.name);
      /// Loop through options and select matching ones
      Array.from(selectElement.options).forEach((option) => {
        if (selectedGenres.includes(option.value)) {
          option.selected = true;
        }
      });
      updateGenreInput();

      document.getElementById("image").value = book.image;

      // Set download link and action button
      document.getElementById("pdfFile").innerHTML = book.pdf;
      //Set save function
      document.getElementById("saveButton").onclick = () => saveBook(book.id);

      // Show the modal
      const modal = new bootstrap.Modal(document.getElementById("adminModal"));
      modal.show();
    })
    .catch((error) => {
      console.error("Error fetching book details:", error);
    });
}
function showGenreDetails(genreId) {
  fetch(`/genres/${genreId}/`)
    .then((response) => response.json())
    .then((genre) => {
      document.getElementById("nameGenre").value = genre.name;
      document.getElementById("imageGenre").value = genre.imageGenre;
      document.getElementById("saveButton").onclick = () => saveGenre(genre.id);
      const modal = new bootstrap.Modal(document.getElementById("adminModal"));
      modal.show();
    });
}
function showAuthorDetails(authorId) {
  fetch(`/authors/${authorId}/`)
    .then((response) => response.json())
    .then((author) => {
      document.getElementById("nameAuthor").value = author.name;
      document.getElementById("imageAuthor").value = author.imageAuthor;
      document.getElementById("saveButton").onclick = saveAuthor();
      const modal = new bootstrap.Modal(document.getElementById("adminModal"));
      modal.show();
    });
}
/// Functions inside the modal for editing
function updateGenreInput() {
  const selectElement = document.getElementById("genre");
  const selectedGenreIds = Array.from(selectElement.selectedOptions).map(
    (option) => parseInt(option.value) // Get selected genre IDs
  );

  // Create an array of full genre objects
   selectedGenres = selectedGenreIds.map((id) =>
    genresData.find((genre) => genre.id === id) // Find the full genre object
  );
  const selectedGenreNames = Array.from(selectElement.selectedOptions).map(
    (option) => option.textContent // Get selected genre IDs
  );

  
  const genresString = selectedGenreNames.join("/");

  document.getElementById("selected-genres").value = genresString; // Set the input value
}

/// Change modal for different utilites
function changeModalItems(type) {
  const formModal = document.getElementById("bookForm");

  if (type == "books") {
    formModal.innerHTML = ` <div class="form-group">
                      <label for="title">Title:</label>
                      <input type="text" class="form-control" id="title" name="title" required>
                  </div>
                  <div class="form-group">
                      <label for="author">Author:</label>
                      <input type="text" class="form-control" id="author" name="author" readonly required>
                  </div>
                  <div class="form-group">
                      <label for="image">Image URL:</label>
                      <input type="url" class="form-control" id="image" name="image">
                  </div>
                  <div class="form-group">
                    <label for="genre">Genre:</label>
                    <select class="form-control" id="genre" name="genre" multiple required onchange="updateGenreInput()">
                       
                    </select>
                </div>
                <div class="form-group">
                    <label for="selected-genres">Selected Genres:</label>
                    <input type="text" class="form-control" id="selected-genres" name="selected-genres" readonly>
                </div>
                  <div class="form-group">
                      <label for="pdf">PDF File:</label>
                      <span id ='pdfFile'></span>
                      <input type="file" class="form-control-file" id="pdf" name="pdf">
                  </div>`;
  }
  if (type == "genre") {
    console.log();
    formModal.innerHTML = ` <div class="form-group">
                      <label for="title">Name of Genre:</label>
                      <input type="text" class="form-control" id="nameGenre" name="title" required>
                  </div>
                  <div class="form-group">
                      <label for="author">Image of Genre:</label>
                       <input type="url" class="form-control" id="imageGenre" name="image" required>
                  </div>
                  `;
  }
  if (type == "authors") {
    formModal.innerHTML = ` <div class="form-group">
                      <label for="title">Name of Author:</label>
                      <input type="text" class="form-control" id="nameAuthor" name="title" required>
                  </div>
                  <div class="form-group">
                      <label for="author">Image of Author:</label>
                       <input type="url" class="form-control" id="imageAuthor" name="image" required>
                  </div>
                  `;
  }
}

///Saving Functions
function saveBook(bookId) {
  
  
  console.log(selectedGenres);
  const updatedData = {
    title: document.getElementById("title").value,
    author: document.getElementById("author").value,
    genre: selectedGenres,
    image: document.getElementById("image").value,
    pdf: document.getElementById("pdf").value,
    read_count: 0,
    favorite_count: 0,
  };
  const csrftoken = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");
  // Make the PUT request to update the book
  fetch(`/api/books/${bookId}/update/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify(updatedData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Book updated successfully:", data);
    })
    .catch((error) => {
      console.error("There was a problem with the update operation:", error);
    });
}
function saveGenre(genreId) {
  const updatedData = {
    name: document.getElementById("nameGenre").value,
    imageGenre: document.getElementById("imageGenre").value,
  };
  const csrftoken = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");
  // Make the PUT request to update the Genre
  fetch(`/api/genres/${genreId}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify(updatedData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Genre updated successfully:", data);
    })
    .catch((error) => {
      console.error("There was a problem with the update operation:", error);
    });
}
