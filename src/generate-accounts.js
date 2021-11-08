const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet("123456789", 8);

const { loremIpsum } = require("lorem-ipsum");

const GENERATE_TRANSACTION_MULTIPLIER = 30;
const GENERATE_VALUE_MULTIPLIER = 150;

const generateAccountVariants = () => [
  generateAccount("ACCOUNT_VARIANT_ONE", "actVariantOneField"),
  generateAccount("ACCOUNT_VARIANT_TWO", "actVariantTwoField"),
];
const generateAccount = (variantType, variantField) => ({
  identifier: nanoid(),
  type: variantType,
  transactions: generateTransactionVariants(),
  [variantField]: loremIpsum(),
});

const generateTransactionVariants = () => [
  ...generateTransactions("TRANSACTION_VARIANT_ONE", "txnVariantOneField"),
  ...generateTransactions("TRANSACTION_VARIANT_TWO", "txnVariantTwoField"),
  ...generateTransactions("TRANSACTION_VARIANT_THREE", "txnVariantThreeField"),
];

const generateTransactions = (variantType, variantField) => {
  const length = Math.round(Math.random() * GENERATE_TRANSACTION_MULTIPLIER);
  return Array.apply(null, Array(length)).map(() => ({
    type: variantType,
    id: nanoid(),
    time: randomTime(),
    value: randomValue(),
    [variantField]: loremIpsum(),
  }));
};

const randomTime = () => {
  const start = new Date(2021, 01, 01);
  const end = new Date();
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

const randomValue = () =>
  (Math.random() * GENERATE_VALUE_MULTIPLIER).toFixed(2);

const data = generateAccountVariants();
console.log(JSON.stringify(data, null, 4));
