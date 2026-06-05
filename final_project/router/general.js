const axios = require('axios');
const express = require('express');
let books = require("./booksdb.js");
let { isValid, users } = require("./auth_users.js");
const public_users = express.Router();

// Register new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    
    if (!isValid(username)) { 
        users.push({ "username": username, "password": password });
        return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
        return res.status(400).json({ message: "User already exists!" });
    }
});

// Task 1: Get all books
public_users.get('/', function (req, res) {
  // Gunakan variabel 'books' (dari booksdb.js), bukan {books}
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn], null, 4));
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const filtered_books = Object.values(books).filter(book => book.author === author);
    res.send(JSON.stringify({booksbyauthor: filtered_books}, null, 4));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const filtered_books = Object.values(books).filter(book => book.title === title);
    res.send(JSON.stringify({booksbytitle: filtered_books}, null, 4));
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    // Cek apakah buku dan review ada
    if (books[isbn]) {
        res.send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

// --- IMPLEMENTASI FUNGSI CLIENT-SIDE MENGGUNAKAN AXIOS ---

// 1. Get All Books
const getBooks = async () => {
    try {
        const response = await axios.get('http://localhost:5000/');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 2. Get Books by ISBN
const getBookByISBN = async (isbn) => {
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 3. Get Books by Author
const getBooksByAuthor = async (author) => {
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 4. Get Books by Title
const getBooksByTitle = async (title) => {
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

module.exports.general = public_users;

