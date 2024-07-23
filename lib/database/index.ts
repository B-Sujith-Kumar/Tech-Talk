import mongoose from "mongoose";

let cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
    if (cached.conn) {
        console.log("=> using cached database instance");
        return cached.conn;
    }
    cached.promise = cached.promise || mongoose.connect(process.env.MONGODB_URI!, {
        dbName: "Tech-Talk",
        bufferCommands: false,
    })

    cached.conn = await cached.promise;
    console.log("=> New database instance");
    return cached.conn;
};