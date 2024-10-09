import { GraphQLError } from "graphql"
import Expense from "../../models/ExpenseScheama"
import User from "../../models/UserScheama"
import tokenVerify, { IPayload } from "../../utils/tokenVerify"


const getExpenseResolve = async (token: string) => {

    if (!token) {
        throw new GraphQLError('You have to have token', { extensions: { code: 'You have to have token', http: 401 } })
    }

    const { id } = tokenVerify(token) as IPayload
    const user = await User.findById(id)

    if (!user) {
        throw new GraphQLError('Invalid or expired token', { extensions: { code: 'Invalid or expired token', http: 401 } })
    }

    try {
        const expense = await Expense.find({ authorId: id })
        if (expense) {
            return expense
        } else {
            throw new GraphQLError('Expense not found', { extensions: { code: 'Expense not found', http: 404 } })
        }
    } catch (error) {
        console.log(error);
        throw new GraphQLError('Expense not found', { extensions: { code: 'Expense not found', http: 404 } })
    }
}

export default getExpenseResolve