import { app } from "./app.js";
import connectDb from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
    path: './env'
});


connectDb()
.then(
    ()=>{
        app.on("error", (error) =>{
            console.log(`Error while connecting: ${error.message}`);
            throw error;
        }
        );
        app.listen(process.env.PORT || 7000, ()=>{
            console.log(`app is running... on port ${process.env.PORT}`);
        });
    }
)
.catch((error)=>{
    console.log(`Mongodb Error: connection faild! ${error.message}`);
})

