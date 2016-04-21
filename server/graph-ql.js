import {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLID,
    GraphQLList } from 'graphql';
import graphqlHTTP from 'express-graphql';

export default function factory(store) {
    const postType = new GraphQLObjectType({
        name: 'Post',
        fields: {
            id: { type: GraphQLID },
            postType: { type: GraphQLString },
            content: { type: GraphQLString },
            user: { type: GraphQLString },
            likes: { type: new GraphQLList(GraphQLString) },
            dislikes: { type: new GraphQLList(GraphQLString) }
        }
    });

    const sessionType = new GraphQLObjectType({
        name: 'Session',
        fields: {
            id: { type: GraphQLID },
            name: { type: GraphQLString },
            posts: { type: new GraphQLList(postType) }
        }
    });

    const schema = new GraphQLSchema({
        query: new GraphQLObjectType({
            name: 'Query',
            fields: {
                session: {
                    type: sessionType,
                    args: {
                        id: { type: GraphQLString }
                    },
                    resolve: (_, args) => store.get(args.id)
                }
            }
        })
    });

    return graphqlHTTP({ schema, pretty: true });
}
