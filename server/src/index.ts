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

dotenv.config()


const PORT = process.env.PORT || 8000;
const mongoURI = process.env.MONGO_URI || "";

const app = express();

app.use(cors({
    origin: "https://project-ecom-frontend.vercel.app",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['X-CSRF-Token', 'X-Requested-With', 'Accept', 'Accept-Version', 'Content-Length', 'Content-MD5', 'Content-Type', 'Date', 'X-Api-Version']
}));
app.use(cookieParser())
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// api routes 
app.use("/api/v1/user", UserRoutes);
app.use("/api/v1/product", ProductRoutes);
app.use("/api/v1/order", OrderRoutes);
app.use("/api/v1", AnalyticsRoute)
// connection to database 
connectDB(mongoURI);

// error middleware 
app.use(errorMiddleware);

// server 
app.listen(PORT, () => {
    console.log("Server is running at " + `${PORT}`);
});

