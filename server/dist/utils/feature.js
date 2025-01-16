import mongoose from "mongoose";
export const connectDB = (uri) => {
    mongoose.connect(uri, {
        dbName: "ECOM",
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
    }).then((connection) => console.log(`DB Connected to ${connection.connection.host}`)).catch((error) => {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    });
};
