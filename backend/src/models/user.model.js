import mongoose, { Mongoose, Schema } from "mongoose";

const userSchema = new Schema(
    {
        name:{
            type: String,
            require: true
        },
        userName:{
            type: String,
            require: true,
            unique: true
        },
        password:{
            type : String,
            require: true,
        },
        token:{
            type : String
        }
    }
)
const USer = mongoose.model("User", userSchema);
export { USer};