import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

export const GRAPHQL_API_URL = 'https://worldagencyadmin.runasp.net/graphql';

const httpLink = createHttpLink({
    uri: GRAPHQL_API_URL,
});

export const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    packages: {
                        merge(_existing, incoming) {
                            return incoming;
                        },
                    },
                    reservations: {
                        merge(_existing, incoming) {
                            return incoming;
                        },
                    }
                }
            }
        }
    }),
});
