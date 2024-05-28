import mongoose from "mongoose";

import { useRuntimeConfig } from '#imports'


//Trying to connect to database, get's called twice ? We want to just connect once to database at the
//start and then be able to use throughout, check the module and plugin setup.
//Is it preferred to open close connections, or have just one open ?
//This actually works now, just needs some tweaks, 
//Did it work because before setting up mongoose in the modules folders is treated 
// seperately, so that imported mongoose was like a new instance, and not accessible to server?
export async function ConnectDB(){
    try {
        mongoose.Promise = global.Promise;
        mongoose.set("strictQuery", false);
        await mongoose.connect(useRuntimeConfig().mongoose.uri);
        console.log("Database connected");
    
      } catch (error) {
        console.error("Database connection error:", error);
      }
}