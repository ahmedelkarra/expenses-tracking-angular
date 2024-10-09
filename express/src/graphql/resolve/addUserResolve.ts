import Joi from "joi"
import tokenSign from "../../utils/tokenSign"
import User from "../../models/UserScheama";
import bcrypt from 'bcrypt'
import { GraphQLError } from "graphql";

interface IUserInputs {
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    password: string;
    confirm_password: string;
}


const addUserResolve = async (first_name: string, last_name: string, email: string, username: string, password: string, confirm_password: string) => {
    const querySchema = Joi.object({
        first_name: Joi.string().required().label('First name is required'),
        last_name: Joi.string().required().label('Last name is required'),
        email: Joi.string().email().required(),
        username: Joi.string().required().label('Username is required'),
        password: Joi.string().required().label('Password is required').min(7),
        confirm_password: Joi.ref('password', {})
    })
    const validateStatus = querySchema.validate({ first_name, last_name, email, username, password, confirm_password })
    const { error, value } = validateStatus
    const errorValue = error?.details[0].message
    const valueInputs = value as IUserInputs

    if (errorValue?.includes('"confirm_password" must be [ref:password]')) {
        throw new GraphQLError('Your password not match', { extensions: { code: 'Your password not match', http: 403 } })
    } else if (error) {
        console.log(error);
        throw new GraphQLError('Somthing went wrong', { extensions: { code: 'Somthing went wrong', http: 400 } })
    }

    try {
        const hashPassword = bcrypt.hashSync(valueInputs.password, 12)
        const user = await User.create({ ...valueInputs, password: hashPassword })
        const token = tokenSign({ id: user._id })
        return { message: 'User has been created', token: token }
    } catch (error) {
        const errorValue = error as { errorResponse: { errmsg: string } }
        if (errorValue.errorResponse.errmsg.includes('duplicate') && errorValue.errorResponse.errmsg.includes('email')) {
            throw new GraphQLError('Email is already used', { extensions: { code: 'Email is already used', http: 403 } })
        } else if (errorValue.errorResponse.errmsg.includes('duplicate') && errorValue.errorResponse.errmsg.includes('username')) {
            throw new GraphQLError('Username is already used', { extensions: { code: 'Username is already used', http: 403 } })
        } else {
            throw new GraphQLError('Error to create user', { extensions: { code: 'Error to create user', http: 403 } })
        }
    }
}

export default addUserResolve