import mongoose from "mongoose"


const connectDB = async () => {
    const url = process.env.HOST_DB_MONGO as string
    try {
        await mongoose.connect(url)
        console.log('Connected to Database')
    } catch (error) {
        console.log('Faild to connect to Database')
    }
}

export default connectDB