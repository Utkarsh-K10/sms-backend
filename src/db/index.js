import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDb = async() => {
    try {
        const connectionInstacne = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log(`\n mongodb connected to host: ${connectionInstacne.connection.host}`);
    } catch (error) {
        console.log(`Mongodb Error, Conection faild: ${error.message}`);
        process.exit(1);
        
    }
}

export default connectDb;