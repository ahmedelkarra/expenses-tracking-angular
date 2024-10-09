import Joi from "joi"
import User from "../../models/UserScheama";
import bcrypt from 'bcrypt'
import tokenVerify, { IPayload } from "../../utils/tokenVerify";
import { GraphQLError } from "graphql";


interface IUserInputs {
    token: string;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    password: string;
    new_password: string;
    confirm_new_password: string;
}

const editUserResolve = async (token: string, first_name: string, last_name: string, email: string, username: string, password: string, new_password: string, confirm_new_password: string) => {
    const querySchema = Joi.object({
        token: Joi.string().required(),
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        email: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().required(),
        new_password: Joi.optional(),
        confirm_new_password: Joi.ref('new_password'),
    })
    const validateStatus = querySchema.validate({ token, first_name, last_name, email, username, password, new_password, confirm_new_password })
    const { error, value } = validateStatus
    const errorValue = error?.details[0].message
    const valueInputs = value as IUserInputs


    if (errorValue?.includes("\"confirm_new_password\" must be [ref:new_password]")) {
        throw new GraphQLError('Your password not match', { extensions: { code: 'Your password not match', http: 401 } })
    } else if (error) {
        console.log(error);
        throw new GraphQLError(error.message, { extensions: { code: error.message, http: 401 } })
    }

    try {
        const { id } = tokenVerify(token) as IPayload
        const user = await User.findById(id)
        if (user) {
            const statusPass = bcrypt.compareSync(valueInputs.password, user?.password as string)
            if (statusPass) {
                if (!valueInputs.new_password) {
                    await user.updateOne({
                        first_name: valueInputs.first_name,
                        last_name: valueInputs.last_name,
                        email: valueInputs.email,
                        username: valueInputs.username,
                    })
                    return "User has been updated"
                } else {
                    const hashPassword = bcrypt.hashSync(valueInputs.new_password, 12)
                    await user.updateOne({ ...valueInputs, password: hashPassword })
                    return "User has been updated"
                }
            } else {
                throw new GraphQLError('Wrong email or password', { extensions: { code: 'Wrong email or password', http: 401 } })
            }
        } else {
            throw new GraphQLError('Invalid or expired token', { extensions: { code: 'Invalid or expired token', http: 401 } })
        }
    } catch (error: any) {
        const errorValue = error as { errorResponse: { errmsg: string } }
        if (error.extensions.code) {
            console.log(error.extensions.code);
            throw new GraphQLError(error.extensions.code, { extensions: { code: error.extensions.code, http: 403 } })
        }
        if (errorValue.errorResponse.errmsg.includes('duplicate') && errorValue.errorResponse.errmsg.includes('email')) {
            throw new GraphQLError('Email is already used', { extensions: { code: 'Email is already used', http: 403 } })
        } else if (errorValue.errorResponse.errmsg.includes('duplicate') && errorValue.errorResponse.errmsg.includes('username')) {
            throw new GraphQLError('Username is already used', { extensions: { code: 'Username is already used', http: 403 } })
        } else {
            throw new GraphQLError('Error to create user', { extensions: { code: 'Error to create user', http: 403 } })
        }
    }
}

export default editUserResolve