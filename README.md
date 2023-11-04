# isreal-palestine-calculator

## What is this?

1. Landing page explaining what this is
2. Connect your bank account
3. Pull transactions ~ (Monthly)
4. We need an open source comprehensive list of all Isreal supporting companies & same for Palestine.
5. Go through each transaction and see is it pro Palestine or Isreal or neither.
   5a. We need some logic here to figure out to group it / partial string match, etc.
6. Feed that data to data viz lib, and show a pie chart.
7. Allow users to export a screenshot of their piechart and directly share to their story/post.

### Summary

_In summary, users can connect their bank account to see a pie chart of how much money they're spending monthly that supports Isreal vs Palestine and then share it to social media_

## How we build this MVP?

1. As a user, I can click a connect bank account button that triggers Plaid API on the clientside to generate the access token & connect my bank account.
2. A route on the BE to pull transactions
3. [Yaz] We need a list of companies that support Isreal and Palestine
4. A function to bucket each transactions and return the buckets (figure out shape of data later)
5. We need a data viz lib to show the pie chart. Ex: https://react-chartjs-2.js.org/
6. Implement share feature, probably just using social media platform special URLs.
7. [Find people who can share this]
