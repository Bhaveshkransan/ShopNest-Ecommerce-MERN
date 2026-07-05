const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const userRoutes = require("./routes/authRoutes");

dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
app.use(cors(
    {
        origin: process.env.FRONTEND_URL || "http://localhost:5173"
    }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth', require("./routes/authRoutes"));
app.use('/api/products', require("./routes/productRoutes"));
app.use('/api/orders', require("./routes/orderRoutes"));
app.use('/api/payments', require("./routes/paymentRoutes"));
app.use('/api/analytics', require("./routes/analyticsRoutes"));

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend/dist", "index.html"));

    });
}  else {
    app.get("/", (req, res) => {
        res.send("Shopnest API is running in Development Mode...");
    });
}

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
