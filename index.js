const { ApolloServer, gql } = require("apollo-server");
const fs = require("fs");

const accounts = require("./accounts.json");

const typeDefs = fs.readFileSync("schema.graphqls").toString();

const resolvers = {
  Query: {
    getAggregatedTransactions: (_, { accountIdentifier, transactionTypes }) => {
      const account = accounts.find(
        (account) => account.identifier === accountIdentifier
      );
      const findTransactionsByType = (transactionType) => ({
        type: transactionType,
        details: account.transactions.filter(
          (transaction) => transaction.type === transactionType
        ),
      });
      const results = transactionTypes.map(findTransactionsByType);
      return results;
    },
    getAccount: (_, { accountIdentifier }) =>
      accounts.find((account) => account.identifier === accountIdentifier),
  },
  Account: {
    __resolveType({ type }) {
      switch (type) {
        case "ACCOUNT_VARIANT_ONE":
          return "AccountVariantOne";
        case "ACCOUNT_VARIANT_TWO":
          return "AccountVariantTwo";
      }
      return null;
    },
  },
  Transaction: {
    __resolveType({ type }) {
      switch (type) {
        case "TRANSACTION_VARIANT_ONE":
          return "TransactionVariantOne";
        case "TRANSACTION_VARIANT_TWO":
          return "TransactionVariantTwo";
        case "TRANSACTION_VARIANT_THREE":
          return "TransactionVariantThree";
      }
      return null;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
