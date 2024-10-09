import Joi from "joi"
import Expense from "../../models/ExpenseScheama"
import User from "../../models/UserScheama"
import tokenVerify, { IPayload } from "../../utils/tokenVerify"
import { GraphQLError } from "graphql";

interface IUserInputs {
    title: string;
    status: string;
    amount: number;
    token: string;
    task_id: string;
}

const editExpenseResolve = async (title: string, status: string, amount: number, task_id: string, token: string) => {
    const querySchema = Joi.object({
        task_id: Joi.string().required().label('Task ID is required'),
        token: Joi.string().required().label('Token is required'),
        title: Joi.string().required().label('Title is required').max(30),
        status: Joi.string().required().label('Status is required').max(10),
        amount: Joi.number().required().label('Amount is required').max(100000000),
    })
    const validateStatus = querySchema.validate({ title, status, amount, task_id, token })
    const { error, value } = validateStatus
    const errorValue = error?.details[0].message
    const valueInputs = value as IUserInputs

    if (errorValue) {
        return errorValue
    }

    const { id } = tokenVerify(token) as IPayload
    const user = await User.findById(id)

    if (!user) {
        throw new GraphQLError('Invalid or expired token', { extensions: { code: 'Invalid or expired token', http: 401 } })
    }

    try {
        const expense = await Expense.findById(task_id)
        if (expense) {
            if (expense?.authorId.toString() === user._id.toString()) {
                await expense.updateOne(valueInputs)
                return 'Expense has been edited'
            } else {
                throw new GraphQLError('Invalid or expired token', { extensions: { code: 'Invalid or expired token', http: 401 } })
            }
        } else {
            throw new GraphQLError('Expense not found', { extensions: { code: 'Expense not found', http: 404 } })
        }
    } catch (error) {
        console.log(error);
        throw new GraphQLError('Expense not found', { extensions: { code: 'Expense not found', http: 404 } })
    }
}


export default editExpenseResolve