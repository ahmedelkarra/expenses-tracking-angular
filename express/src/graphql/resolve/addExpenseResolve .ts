import Joi from "joi"
import tokenVerify, { IPayload } from "../../utils/tokenVerify"
import User from "../../models/UserScheama";
import Expense from "../../models/ExpenseScheama";
import { GraphQLError, GraphQLErrorOptions } from "graphql";


interface IUserInputs {
    title: string;
    status: string;
    amount: number;
    token: string;
}


const addExpenseResolve = async (title: string, status: string, amount: number, token: string) => {
    const querySchema = Joi.object({
        token: Joi.string().required().label('Token is required'),
        title: Joi.string().required().label('Title is required').max(30),
        status: Joi.string().required().label('Status is required').max(10),
        amount: Joi.number().required().label('Amount is required').max(100000000),
    })
    const validateStatus = querySchema.validate({ title, status, amount, token })
    const { error, value } = validateStatus
    const errorValue = error?.details[0].message
    const valueInputs = value as IUserInputs

    if (errorValue) {
        return errorValue
    }

    const { id } = tokenVerify(token) as IPayload
    const user = await User.findById(id)

    if (!user) {
        throw new GraphQLError('Error to create your expense', { extensions: { code: 'Error to create your expense', http: 400 } })
    }

    try {
        await Expense.create({ ...valueInputs, authorId: user._id })
        return 'Expense has been created'
    } catch (error) {
        console.log(error);
        throw new GraphQLError('Error to create your expense', { extensions: { code: 'Error to create your expense', http: 400 } })
    }

}


export default addExpenseResolve 