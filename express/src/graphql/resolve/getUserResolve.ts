import { GraphQLError } from "graphql";
import User from "../../models/UserScheama";
import tokenVerify, { IPayload } from "../../utils/tokenVerify";



const getUserResolve = async (token: string) => {
    if (!token) {
        throw new GraphQLError('You have to have token', { extensions: { code: 'You have to have token', http: 401 } })
    }

    try {
        const { id } = tokenVerify(token) as IPayload
        const user = await User.findById(id)
        return user
    } catch (error) {
        console.log(error);
        throw new GraphQLError('Something went wrong', { extensions: { code: 'Something went wrong', http: 400 } })
    }
}


export default getUserResolve