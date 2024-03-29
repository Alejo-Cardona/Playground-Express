import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const userCollection = 'users'

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    age: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false,
    }
})

export default mongoose.model(userCollection, userSchema)