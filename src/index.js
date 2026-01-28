import dotenv from "dotenv";
dotenv.config({
    path: "./.env"
});
import { app } from "./app.js";
import DB_CONNECTION from "./db/index.js";

DB_CONNECTION()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`🦾 Server is running on port ${process.env.PORT}`);
        })
    })
    .catch(error => {
        console.error("Error: ", error);
        process.exit(1);
    })





// import express from "express";
// const app = express();

// (async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//         app.on("error", (error) => {
//             console.error("Error: ", error);
//             throw error;
//         })

//         app.listen(process.env.PORT, () => {
//             console.log(`Server is running on port ${process.env.PORT}`);
//         })
//     } catch (error) {
//         console.error("Error: ", error);
//     }
// })()