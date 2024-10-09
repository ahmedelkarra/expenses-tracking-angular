import bcrypt from 'bcrypt'
import User from '../../models/UserScheama'
import tokenSign from '../../utils/tokenSign'
import { GraphQLError } from 'graphql'


const loginResolve = async (username: string, password: string) => {
    try {
        const user = await User.findOne({ username: username })
        if (!user) {
            throw new GraphQLError('Wrong username or password', { extensions: { code: 'Wrong username or password', http: 400 } })
        }
        const statusPass = bcrypt.compareSync(password, user?.password as string)
        if (!statusPass) {
            throw new GraphQLError('Wrong username or password', { extensions: { code: 'Wrong username or password', http: 400 } })
        }
        const token = tokenSign({ id: user._id })
        return { message: `Welcome ${user.first_name} ${user.last_name}`, token: token }
    } catch (error) {
        throw new GraphQLError('Wrong username or password', { extensions: { code: 'Wrong username or password', http: 400 } })
    }
}


export default loginResolve