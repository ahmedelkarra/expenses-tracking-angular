import { GraphQLObjectType, GraphQLString } from "graphql";


const loginMessageType = new GraphQLObjectType({
    name: 'LoginType',
    fields: {
        message: { type: GraphQLString },
        token: { type: GraphQLString },
    },
})

export default loginMessageType