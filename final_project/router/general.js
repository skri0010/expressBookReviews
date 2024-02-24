const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here

  let isbn = req.params.isbn;
  let book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  let author = req.params.author;
  let books_filtered = Object.values(books).filter((book) => {
    return book.author === author;
  });
  if (books_filtered) {
    return res.status(200).json(books_filtered);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  let title = req.params.title;
  let books_filtered = Object.values(books).filter((book) => {
    return book.title === title;
  });
  if (books_filtered) {
    return res.status(200).json(books_filtered);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;

/*
Code section to implement tasks 10-13 using promises or callbacks with axios
*/

async function getBookList() {
  try {
    const response = await axios.get("http://localhost:5000");
    const books = response.data;
    return books;
  } catch (error) {
    console.error("Error fetching list of books:", error);
  }
}

function fetchBookDetails(isbn) {
  return new Promise((resolve, reject) => {
    axios
      .get(`http://localhost:5000/isbn/${isbn}`)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

function fetchBookByAuthor(author) {
  return new Promise((resolve, reject) => {
    axios
      .get(`http://localhost:5000/author/${author}`)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

function fetchBookByTitle(title) {
  return new Promise((resolve, reject) => {
    axios
      .get(`http://localhost:5000/title/${title}`)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}
(async () => {
  try {
    const books = await fetchBookByTitle("Things Fall Apart");
    console.log(books); // This will log the books fetched from the API
  } catch (error) {
    console.error("Error fetching list of books:", error);
  }
})();
