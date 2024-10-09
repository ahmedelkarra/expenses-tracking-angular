import { GraphQLFloat, GraphQLObjectType, GraphQLString } from "graphql";
import { } from "graphql";


const expenseType = new GraphQLObjectType({
    name: 'ExpenseType',
    fields: {
        _id: { type: GraphQLString },
        title: { type: GraphQLString },
        status: { type: GraphQLString },
        amount: { type: GraphQLFloat },
        authorId: { type: GraphQLString },
        createdAt: { type: GraphQLString },
    }
})

export default expenseType