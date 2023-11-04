import fuzzy from "fuzzy";
import { companies } from "./companies";

// Function to find matching companies in transactions
export function findMatchingCompanies(transactions: any[]): {
  totalAmount: number;
  companyNames: string[];
} {
  let totalAmount = 0;
  const matchedCompanies: string[] = [];

  for (const transaction of transactions) {
    for (const counterparty of transaction.counterparties) {
      const transactionDescription = counterparty.name;

      // Iterate through the list of company names and find the closest match
      const bestMatch = fuzzy.filter(transactionDescription, companies);
      if (bestMatch.length > 0 && bestMatch[0].score >= 70) {
        const matchedCompany = bestMatch[0].string;
        matchedCompanies.push(matchedCompany);

        // Assuming you have transaction amounts associated with each transaction
        // You would need to extract the amount from the transaction data
        // For this example, we'll use the transaction amount from the transaction object
        const transactionAmount = transaction.amount; // Assuming amount field is present in the transaction

        totalAmount += transactionAmount;
      }
    }
  }

  return { totalAmount: Math.abs(totalAmount), companyNames: matchedCompanies };
}
