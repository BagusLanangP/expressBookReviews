const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Fungsi untuk memeriksa apakah username valid (tidak ada duplikat)
const isValid = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    return userswithsamename.length > 0;
};

// Fungsi untuk memeriksa apakah username dan password cocok di database
const authenticatedUser = (username, password) => {
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    return validusers.length > 0;
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        // Membuat JWT Token
        let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });
        
        // Simpan token dan username ke session
        req.session.authorization = { accessToken, username };
        return res.status(200).json({ message: "User successfully logged in" });
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;

    if (books[isbn]) {
        let book = books[isbn];
        book.reviews[username] = review; // Menambahkan atau memperbarui ulasan
        return res.status(200).json({ message: `The review for the book with ISBN ${isbn} has been added/updated.` });
    } else {
        return res.status(404).json({ message: `ISBN ${isbn} not found` });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;