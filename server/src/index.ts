import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from 'dotenv'
import express, { Request, Response } from "express";
import { errorMiddleware } from "./middleware/error.js";
import AnalyticsRoute from "./routes/analytics.js";
import OrderRoutes from "./routes/order.js";
import ProductRoutes from "./routes/products.js";
import UserRoutes from "./routes/user.js";
import { connectDB } from "./utils/feature.js";
import { v2 as cloudinary } from "cloudinary";

dotenv.config()


const PORT = process.env.PORT || 8000;
const mongoURI = process.env.MONGO_URI || "";
const api_key = process.env.api_key;
const api_secret = process.env.api_secret;
const cloud_name = process.env.cloud_name;

cloudinary.config({
    api_key,
    api_secret,
    cloud_name
})

const app = express();

app.use(cors({
    origin: "https://project-ecom-frontend.vercel.app",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['X-CSRF-Token', 'X-Requested-With', 'Accept', 'Accept-Version', 'Content-Length', 'Content-MD5', 'Content-Type', 'Date', 'X-Api-Version']
}));
// app.use(cors({
//     origin: "http://localhost:5173",
//     credentials: true,

// }));
app.use(cookieParser())
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use("/api/v1/user", UserRoutes);
app.use("/api/v1/product", ProductRoutes);
app.use("/api/v1/order", OrderRoutes);
app.use("/api/v1", AnalyticsRoute)

connectDB(mongoURI);


app.use(errorMiddleware);


app.listen(PORT, () => {
    console.log("Server is running at " + `${PORT}`);
});

