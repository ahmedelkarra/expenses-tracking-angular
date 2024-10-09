import { GraphQLObjectType, GraphQLString } from "graphql";


const addUserType = new GraphQLObjectType({
    name: 'MessageUserType',
    fields: {
        message: { type: GraphQLString },
        token: { type: GraphQLString },
    }
})


export default addUserType