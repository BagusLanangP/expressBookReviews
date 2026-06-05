const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    
    // Asumsi fungsi isValid ada di auth_users.js dan mengecek keberadaan user
    if (!isValid(username)) { 
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(400).json({ message: "User already exists!" });
    }
});

// Task 1: Get all books
public_users.get('/', function (req, res) {
  res.send(JSON.stringify({books}, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn], null, 4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const filtered_books = Object.values(books).filter(book => book.author === author);
    res.send(JSON.stringify({booksbyauthor: filtered_books}, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const filtered_books = Object.values(books).filter(book => book.title === title);
    res.send(JSON.stringify({booksbytitle: filtered_books}, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;
getBooks();
getByISBN(1);