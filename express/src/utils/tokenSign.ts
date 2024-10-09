import { GraphQLError } from 'graphql'
import { GraphQLErrorOptions } from 'graphql'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'


const tokenSign = (payload: { id: mongoose.Types.ObjectId }) => {
    if (payload.id) {
        const secret = process.env.SECRET_JWT as string
        const token = jwt.sign(payload, secret, { expiresIn: '1d', algorithm: 'HS256' })
        return token
    } else {
        throw new GraphQLError('Please check your inputs', {
            extensions: {
                code: 'Please check your inputs',
                http: { status: 401 },
            },
        } as GraphQLErrorOptions)
    }
}


export default tokenSign