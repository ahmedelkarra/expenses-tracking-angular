import mongoose from "mongoose";


interface IUser {
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    password: string;
}

const UserScheama = new mongoose.Schema<IUser>({
    first_name: { type: String, required: true, maxlength: 30 },
    last_name: { type: String, required: true, maxlength: 30 },
    email: { type: String, required: true, maxlength: 30, unique: true },
    username: { type: String, required: true, maxlength: 30, unique: true },
    password: { type: String, required: true},
},
    { timestamps: true }
)

const User = mongoose.model('User', UserScheama)

export default User