import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLNonNull, GraphQLFloat } from "graphql";
import addUserResolve from "./resolve/addUserResolve";
import getUserResolve from "./resolve/getUserResolve";
import editUserResolve from "./resolve/editUserResolve";
import getExpenseResolve from "./resolve/getExpenseResolve";
import addExpenseResolve from "./resolve/addExpenseResolve ";
import deleteExpenseResolve from "./resolve/deleteExpenseResolve";
import editExpenseResolve from "./resolve/editExpenseResolve";
import deleteUserResolve from "./resolve/deleteUserResolve";
import { GraphQLList } from "graphql";
import userType from "./types/userType";
import expenseType from "./types/expenseType";
import addUserType from "./types/addUserType";
import loginMessageType from "./types/loginMessageType";
import loginResolve from "./resolve/loginResolve";

interface IUser {
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    password: string;
}

interface IUserAdd extends IUser {
    confirm_password: string;
}

interface IUserUpdate extends IUser {
    token: string;
    new_password: string;
    confirm_new_password: string;
}

interface IExpense {
    title: string;
    status: string;
    amount: number;
    token: string;
}

interface IExpenseUpdate extends IExpense {
    task_id: string;
}

interface IUserLogin {
    username: string;
    password: string;
}

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            getUser: {
                type: userType,
                args: { token: { type: new GraphQLNonNull(GraphQLString) } },
                resolve: ((_, args) => {
                    const { token } = args as { token: string }
                    return getUserResolve(token)
                })
            },
            getExpense: {
                type: new GraphQLList(expenseType),
                args: {
                    token: { type: new GraphQLNonNull(GraphQLString) },
                },
                resolve: ((_, args) => {
                    const { token } = args as { token: string }
                    return getExpenseResolve(token)
                })
            }
        },
    }),
    mutation: new GraphQLObjectType({
        name: 'Mutation',
        fields: {
            login: {
                type: loginMessageType,
                args: {
                    username: { type: new GraphQLNonNull(GraphQLString) },
                    password: { type: new GraphQLNonNull(GraphQLString) }
                },
                resolve: ((_, args) => {
                    const { username, password } = args as IUserLogin
                    return loginResolve(username, password)
                })
            },
            addUser: {
                type: addUserType,
                args: {
                    first_name: { type: new GraphQLNonNull(GraphQLString) },
                    last_name: { type: new GraphQLNonNull(GraphQLString) },
                    email: { type: new GraphQLNonNull(GraphQLString) },
                    username: { type: new GraphQLNonNull(GraphQLString) },
                    password: { type: new GraphQLNonNull(GraphQLString) },
                    confirm_password: { type: new GraphQLNonNull(GraphQLString) },
                },
                resolve: ((_, args) => {
                    const { first_name, last_name, email, username, password, confirm_password } = args as IUserAdd
                    return addUserResolve(first_name, last_name, email, username, password, confirm_password)
                })
            },
            editUser: {
                type: GraphQLString,
                args: {
                    token: { type: new GraphQLNonNull(GraphQLString) },
                    first_name: { type: new GraphQLNonNull(GraphQLString) },
                    last_name: { type: new GraphQLNonNull(GraphQLString) },
                    email: { type: new GraphQLNonNull(GraphQLString) },
                    username: { type: new GraphQLNonNull(GraphQLString) },
                    password: { type: new GraphQLNonNull(GraphQLString) },
                    new_password: { type: GraphQLString },
                    confirm_new_password: { type: GraphQLString },
                },
                resolve: ((_, args) => {
                    const { token, first_name, last_name, email, username, password, new_password, confirm_new_password } = args as IUserUpdate
                    return editUserResolve(token, first_name, last_name, email, username, password, new_password, confirm_new_password)
                })
            },
            deleteUser: {
                type: GraphQLString,
                args: {
                    token: { type: new GraphQLNonNull(GraphQLString) },
                    password: { type: new GraphQLNonNull(GraphQLString) },
                },
                resolve: ((_, args) => {
                    const { token, password } = args as { token: string, password: string }
                    return deleteUserResolve(token, password)
                })
            },
            addExpense: {
                type: GraphQLString,
                args: {
                    token: { type: new GraphQLNonNull(GraphQLString) },
                    title: { type: new GraphQLNonNull(GraphQLString) },
                    status: { type: new GraphQLNonNull(GraphQLString) },
                    amount: { type: new GraphQLNonNull(GraphQLFloat) },
                },
                resolve: ((_, args) => {
                    const { title, status, amount, token } = args as IExpense
                    return addExpenseResolve(title, status, amount, token)
                })
            },
            editExpense: {
                type: GraphQLString,
                args: {
                    title: { type: new GraphQLNonNull(GraphQLString) },
                    status: { type: new GraphQLNonNull(GraphQLString) },
                    amount: { type: new GraphQLNonNull(GraphQLFloat) },
                    task_id: { type: new GraphQLNonNull(GraphQLString) },
                    token: { type: new GraphQLNonNull(GraphQLString) },
                },
                resolve: ((_, args) => {
                    const { title, status, amount, task_id, token } = args as IExpenseUpdate
                    return editExpenseResolve(title, status, amount, task_id, token)
                })
            },
            deleteExpense: {
                type: GraphQLString,
                args: {
                    token: { type: new GraphQLNonNull(GraphQLString) },
                    task_id: { type: new GraphQLNonNull(GraphQLString) },
                },
                resolve: ((_, args) => {
                    const { token, task_id } = args as { token: string, task_id: string }
                    return deleteExpenseResolve(token, task_id)
                })
            },
        },
    })
})

export default schema