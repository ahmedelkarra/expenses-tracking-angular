import { GraphQLError } from "graphql"
import User from "../../models/UserScheama"
import tokenVerify, { IPayload } from "../../utils/tokenVerify"
import bcrypt from 'bcrypt'



const deleteUserResolve = async (token: string, password: string) => {
    try {
        const { id } = tokenVerify(token) as IPayload
        const user = await User.findById(id)
        if (user) {
            const statusPass = bcrypt.compareSync(password, user?.password as string)
            if (statusPass) {
                await user.deleteOne()
                return 'User has been deleted'
            } else {
                throw new GraphQLError('Wrong email or password', { extensions: { code: 'Wrong email or password', http: 404 } })
            }
        } else {
            throw new GraphQLError('Invalid or expired token', { extensions: { code: 'Invalid or expired token', http: 401 } })
        }
    } catch (error: any) {
        console.log(error);
        throw new GraphQLError(error.message, { extensions: { code: error, http: 400 } })
    }
}

export default deleteUserResolve