import mongoose, { connection } from "mongoose";

export async function connect() {
    try {
        mongoose.connect(process.env.MONGO_URI!);
        const connection = mongoose.connection;

        connection.once('connected', () => {
            console.log("Connected to database");
        })

        connection.on('error', (err) => {
            console.log("Error connecting to database"+ err);
            process.exit();
        })
    } catch (error) {
        console.log("Error connecting to database", error);
    }
}