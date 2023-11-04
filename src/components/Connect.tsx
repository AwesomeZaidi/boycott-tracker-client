import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";

import { usePlaidLink, PlaidLinkOnSuccess } from "react-plaid-link";
import { Box, Button, Collapse, Typography } from "@mui/material";
import { findMatchingCompanies } from "../utils";

const client_id = "654071b04b5732001c52f1f1";
const secret = "bc7a4a6ca8ef7ead85c8e5bc110313";

const Connect = () => {
  const [token, setToken] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isExplainerOpen, setExplainerOpen] = useState(false);

  const toggleExplainer = () => {
    setExplainerOpen(!isExplainerOpen);
  };
  // get link_token from your server when component mounts
  useEffect(() => {
    const createLinkToken = async () => {
      const res = await axios.post("http://localhost:4000/plaid/link", {
        client_id,
        secret,
        client_name: "calculator app",
        country_codes: ["US"],
        language: "en",
        products: ["auth"],
      });
      console.log("res:", res);
      if (res.data?.linkToken) {
        setToken(res.data.linkToken);
        console.log("res.data.linkToken:", res.data.linkToken);
        // const transactions = await axios.post(
        //   "http://localhost:4000/plaid/transactions",
        //   {
        //     access_token: res.data.linkToken,
        //   }
        // );
        // console.log("transactions:", transactions);
      }
    };
    createLinkToken();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.post(
          "http://localhost:4000/plaid/transactions",
          {
            accessToken,
          }
        );
        console.log("res:", res);
        setTransactions(res.data);
      } catch (e) {
        console.log("e:", e);
      }
    };

    if (accessToken) {
      fetchTransactions();
    }
  }, [accessToken]);

  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (linkToken, metadata) => {
      // send link_token to your server
      // https://plaid.com/docs/api/tokens/#token-exchange-flow
      console.log("onSuccess");
      console.log(linkToken, metadata);
      const res = await axios.post("http://localhost:4000/plaid/exchange", {
        // @ts-ignore
        public_token: metadata.public_token,
      });
      setAccessToken(res.data.accessToken);
    },
    []
  );

  const { open, ready } = usePlaidLink({
    token,
    onSuccess,
    // onEvent
    // onExit
  });

  const { totalAmount, companyNames } = findMatchingCompanies(
    transactions || []
  );
  console.log("companyNames:", companyNames);
  console.log("totalAmount:", totalAmount);

  const shareImageAsset = async () => {
    const response = await fetch(
      "https://www.oberlo.com/media/1603957802-image17-3.png?w=1824&fit=max".toString()
    );
    const blobImageAsset = await response.blob();
    const filesArray = [
      new File([blobImageAsset], `boycott.png`, {
        type: "image/png",
        lastModified: new Date().getTime(),
      }),
    ];
    const shareData = {
      title: `boycott`,
      files: filesArray,
    };

    if (navigator.canShare && navigator.canShare(shareData)) {
      await navigator.share(shareData);
    }
  };

  return (
    <Box m="3em auto" textAlign={"center"} width={"100vw"}>
      {!(transactions.length > 0) && (
        <>
          <Typography
            gutterBottom
            variant="h4"
            textAlign={"center"}
            className="title"
          >
            Find out the truth.
          </Typography>

          <Typography mx={2} variant="body1" textAlign={"center"} mb={4}>
            Connect your bank account to find out how much money you spend
            monthly towards companies that support <strong>Isreal</strong>.
          </Typography>
        </>
      )}

      {transactions.length > 0 ? (
        <Box mt={10} className="pic-bg">
          <Typography
            mx={4}
            gutterBottom
            className="small-semi"
            color="#DB0403"
          >
            Find out how much you’re spending on companies that support Isreal.
          </Typography>
          <Typography
            gutterBottom
            className="x-bold-small"
            variant="h6"
            color="#DB0403"
          >
            #BoycottIsrael
          </Typography>
          <Typography gutterBottom className="month">
            PAST 30 DAYS
          </Typography>
          <Typography gutterBottom variant="h2" color="#DB0403">
            🩸 ${totalAmount}
          </Typography>
          {companyNames.map((comp) => (
            <Typography
              gutterBottom
              className="comp-name"
              variant="h5"
              textAlign={"center"}
              color="#DB0403"
            >
              {comp.toUpperCase()}
            </Typography>
          ))}

          <Box mt={10}>
            <Button
              className="share_btn"
              onClick={shareImageAsset}
              variant="contained"
            >
              Screenshot and share on socials!
            </Button>
            <Typography mt={3}>Follow @BoycottTracker</Typography>
          </Box>
        </Box>
      ) : (
        <>
          <Button
            variant="contained"
            style={{
              backgroundColor: "#4A3AFF",
              color: "white",
            }}
            onClick={() => open()}
            disabled={!ready}
          >
            Connect bank account
          </Button>
          <Typography gutterBottom onClick={toggleExplainer} mt={6}>
            {isExplainerOpen
              ? "▲ How does this work?"
              : "▼ How does this work?"}
          </Typography>
          <Collapse in={isExplainerOpen}>
            <Typography mx={2}>
              Once you securely connect your Bank Account through the trusted
              provide, Plaid. we pull your monthly transactions and cross check
              each of your transactions to see if they’re a part of any of
              <a
                href="https://som.yale.edu/story/2023/list-companies-have-condemned-hamas-terrorist-attack-israel"
                target="_blank"
              >
                these companies
              </a>{" "}
              whom openly support Isreal. Please note: we do not store anything.
            </Typography>
          </Collapse>
        </>
      )}
    </Box>
  );
};

export default Connect;
