# Questions

## `Balance` interface

### `type: BalanceType`
Conflicting information as to what the possible values should be.  Is it an enum of `LEDGER`, `AVAILABLE`, `OVERDRAFT`, `CREDIT_LIMIT`?  
If so what do `InterimAvailable` and `InterimBooked` refer to?

## `Product` interface

### `typeCode: ???`
Should this come from an enum?  What are the possible values?

### `sourceSystemCode: ???`
Should this come from an enum?  What are the possible values?

What does this mean "Hard coded to 020 for internal fulfilment call"?

### `baseCurrencyCode: ???`
- Should this come from an enum?  What are the possible values?
- *Or* should this just be a `Currency` - i.e. GBP, USD, EUR, etc.

## `AccountStatus` type
### `code: ???`
Should this come from an enum?  What are the possible values?

E.g. `CLOSED`, `OPEN`, `INACTIVE`, `DORMANT`, etc.

## `Account` interface
### `identifier: ???`
- Does this exist for *all* accounts; current, credit, savings, etc?
- What data type is it?

### `name: String`
Does this exist for *all* accounts; current, credit, savings, etc?

## `SterlingCurrentAccount` type
Validate nomenclature against EDD.  Should this be `DomesticRPS`?

## `NonSterlingCurrentAccount` type
Validate nomenclature against EDD.  Should this be `NonDomesticRPS`, `InternationalRPS`, something else?

## `SavingsAccount` type
Validate nomenclature against EDD.  What is this called in HSBC parlance?

## `LoanAccount`, `IsaAccount`, etc. types
Are these out of scope?  If so, where will Open Banking get the data from?

## `CreditCardAccount` type
Validate nomenclature against EDD.  What is this called in HSBC parlance?

### `identifier: ???`
- Is this the card number?
- What data format
- Should there be a separate `number` field, in the format `XXXX-XXXX-XXXX-XXXX`?

## `Currency` enum
Provide list of possible values.

## `Transaction` interface
Should we have a `TransactionType` enum, e.g. `CREDIT_CARD`, `DEBIT_CARD`, `REMITTANCE`, etc.

### `amount: CurrencyAmount`
Can this be either a positive or negative amount?  Or do we need another indicator for CR vs DR

## `RemittanceTransactionInformation`
What data should this contain?

## `CurrencyExchange` type
### `unitCurrency: ???`
What is this for?  Is is a `Float` or `Currency`?

### `instructed: CurrencyAmount`
What exactly is this?  We have source and target currency data already

## `CardTransaction` interface
### `cardInstrumentIdentification: ???`
- What is this?  Does it apply to just credit card transactions, or debit card transactions also?
- Is there _any_ difference between a credit card and a debit card transaction?

## `MerchantTransaction` interface
We will presumably have merchant data for credit/debit card transactions.  Are there other transactions that we will have this information for?  If not can be merged into `[Credit]CardTransaction`

## `MerchantCategoryCode` enum
What are the possible values?

## `CreditorAccountData` interface
Does this just apply for remittance?

### `creditorAccountIdentification: ???`
What type of data should this be?