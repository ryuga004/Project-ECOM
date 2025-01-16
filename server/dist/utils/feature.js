import mongoose from "mongoose";
export const connectDB = (uri) => {
    mongoose.connect("mongodb+srv://ryuga:ryuga@cluster0.7nwwn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
        dbName: "ECOM",
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then((connection) => console.log(`DB Connected to ${connection.connection.host}`)).catch((error) => {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    });
};
