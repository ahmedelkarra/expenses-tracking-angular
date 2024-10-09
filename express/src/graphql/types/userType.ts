import { GraphQLObjectType, GraphQLString } from "graphql";
import { } from "graphql";


const userType = new GraphQLObjectType({
    name: 'UserType',
    fields: {
        _id: { type: GraphQLString },
        first_name: { type: GraphQLString },
        last_name: { type: GraphQLString },
        email: { type: GraphQLString },
        username: { type: GraphQLString },
    }
})

export default userType