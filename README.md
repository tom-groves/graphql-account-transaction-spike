# Account/Transaction Spike

Quick spike to demonstrate how querying multiple account type and transaction types could work.

## Setup and Running

### Setup

`npm install`

#### Generate Data

There is already a set of data generated in [accounts.json](./accounts.json); this can be regenerated using the command `npm run generate-accounts`.

### Run

`npm start`

Then visit the GraphQL Playground at http://localhost:4000/graphql (does not work in Safari, use Chrome)

## Overview

There are two interfaces and several implementing types; review [the schema](./schema.graphqls) to understand the interface and type definitions in more depth.

### `Account`

Describes the common fields for any account. In this example these are:

- `identifier` - the account identifierd
- `transactions` - an array of [`Transaction`](#Transaction) types

There are two types implementing this interface: `AccountVariantOne` and `AccountVariantTwo` - each provide an additional field in addition to those specified by the core interface. These are oversimplified examples demonstrating that multiple implementing variants can be represented.

### `Transaction`

Describes the common feilds for any transaction. In this example these are:

- `id` - the identifier of the transaction
- `time` - an ISO-8601 offset DateTime representation of the transaction time
- `value` - the value of the transaction

There are three types implementing this interface: `TransactionVariantOne`, `TransactionVariantTwo` and `TransactionVariantThree` - each provide an additional field in addition to those specified by the core interface. These are oversimplified examples demonstrating that multiple implementing variants can be represented.

## Approach 1 - Unified Account/Transaction Querying

The optimal approach to query transactions for a given account is to query the graph as follows:

```graphql
query {
  getAccount(accountIdentifier: "28388981") {
    ... on AccountVariantOne {
      actVariantOneField
    }
    # SHOWN TO DEMONSTRATE OMISSION
    # ... on AccountVariantTwo {
    #     actVariantTwoField
    # }
    transactions {
      time
      value
      ... on TransactionVariantOne {
        txnVariantOneField
      }
      ... on TransactionVariantTwo {
        txnVariantTwoField
      }
      # SHOWN TO DEMONSTRATE OMISSION
      # ... on TransactionVariantThree {
      # 	variantThreeField
      # }
    }
  }
}
```

This would retrieve `time` and `value` for each transaction, and also `txnVariantOneField` on transactions of variant one, `txnVariantTwoField` on transactions of variant two, and _no additional data_ on transactions of variant three.

It would also retreive `actVariantOneField` for accounts of variant one, but _no additional data_ on accounts of variant two.

The resulting data would look as follows:

```json
{
  "data": {
    "getAccount": {
      "actVariantOneField": "Quis qui aliqua sint duis exercitation aute culpa nostrud.",
      "transactions": [
        {
          "time": "2021-08-11T08:33:08.721Z",
          "value": 9.73,
          "txnVariantOneField": "Anim reprehenderit ipsum esse enim nulla laboris labore incididunt."
        },
        ...
        {
          "time": "2021-03-28T04:59:36.558Z",
          "value": 135.66,
          "txnVariantTwoField": "Tempor ut dolor consequat proident culpa proident elit ullamco commodo nostrud commodo ullamco."
        },
        ...
        {
          "time": "2021-08-03T16:14:49.970Z",
          "value": 57.78
        },
        ...
      ]
    }
  }
}
```

## Approach 2 - Query by Transaction Type

In this approach a consumer could request that only transaction types for a given account _in a provided range_ are retrieved. The transactions would be split into buckets based on their type.

This is considered to be sub-optimal as it is counter to the simplicity of a graph hierarchy, and it is uncertain what use-case would justify such an approach.

An example query would be:

```graphql
query {
  getAggregatedTransactions(
    accountIdentifier: "28388981"
    transactionTypes: [TRANSACTION_VARIANT_ONE, TRANSACTION_VARIANT_THREE]
  ) {
    type
    details {
      time
      value
      ... on TransactionVariantOne {
        txnVariantOneField
      }
      ... on TransactionVariantThree {
        txnVariantThreeField
      }
    }
  }
}
```

Resulting in the following data being returned:

```json
{
  "data": {
    "getAggregatedTransactions": [
      {
        "type": "TRANSACTION_VARIANT_ONE",
        "details": [
          {
            "time": "2021-08-11T08:33:08.721Z",
            "value": 9.73,
            "txnVariantOneField": "Anim reprehenderit ipsum esse enim nulla laboris labore incididunt."
          },
          {
            "time": "2021-08-01T23:10:58.107Z",
            "value": 70.47,
            "txnVariantOneField": "Magna amet sint do ipsum deserunt veniam mollit."
          },
          ...
        ]
      },
      {
        "type": "TRANSACTION_VARIANT_THREE",
        "details": [
          {
            "time": "2021-08-03T16:14:49.970Z",
            "value": 57.78,
            "txnVariantThreeField": "Cillum proident sint amet nostrud ad labore qui anim dolor culpa adipisicing nulla."
          },
          {
            "time": "2021-03-15T08:33:06.571Z",
            "value": 45.91,
            "txnVariantThreeField": "Ullamco est adipisicing in anim veniam."
          },
          ...
        ]
      }
    ]
  }
}
```
