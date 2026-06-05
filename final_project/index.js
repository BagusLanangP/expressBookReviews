const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    // 1. Periksa apakah session memiliki data otorisasi
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];

        // 2. Verifikasi token menggunakan secret key
        // Pastikan 'access' adalah string yang sama dengan yang digunakan saat proses login
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                // Jika token valid, simpan informasi user ke dalam objek request
                req.user = user;
                next(); // Lanjutkan ke rute tujuan
            } else {
                // Jika token tidak valid atau kadaluwarsa
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        // 3. Jika tidak ada session atau token sama sekali
        return res.status(403).json({ message: "User not logged in" });
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
