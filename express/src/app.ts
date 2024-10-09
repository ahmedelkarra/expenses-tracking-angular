import express from "express";
import connectDB from "./connectDB";
import { config } from "dotenv";
import { createHandler } from "graphql-http/lib/use/express";
import schema from "./graphql/schema";
import cors from 'cors'

config()


const port = process.env.PORT || 3000 as number
const app = express()

app.use(cors({ origin: '*' }))
app.use('/graphql', createHandler({ schema: schema }))

connectDB()

app.listen(port, () => {
    console.log(`http://localhost:${port}/graphql`);
})
