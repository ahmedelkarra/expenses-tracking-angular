import Joi from "joi"
import tokenVerify, { IPayload } from "../../utils/tokenVerify";
import User from "../../models/UserScheama";
import Expense from "../../models/ExpenseScheama";
import { GraphQLError } from "graphql";


interface IUserInputs {
    task_id: number;
    token: string;
}


const deleteExpenseResolve = async (token: string, task_id: string) => {
    const querySchema = Joi.object({
        task_id: Joi.string().required().label('Task ID is required'),
        token: Joi.string().required().label('Token is required'),
    })
    const validateStatus = querySchema.validate({ task_id, token })
    const { error, value } = validateStatus
    const errorValue = error?.details[0].message

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
                await expense.deleteOne()
                return 'Expense has been deleted'
            } else {
                throw new GraphQLError('Invalid or expired token', { extensions: { code: 'Invalid or expired token', http: 401 } })
            }
        } else {
            throw new GraphQLError('Expense not found', { extensions: { code: 'Expense not found', http: 404 } })
        }
    } catch (error) {
        console.log(error)
        throw new GraphQLError('Expense not found', { extensions: { code: 'Expense not found', http: 404 } })
    }
}

export default deleteExpenseResolve