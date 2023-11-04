import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import InstagramIcon from "@mui/icons-material/Instagram";

import { usePlaidLink, PlaidLinkOnSuccess } from "react-plaid-link";
import { Box, Button, Collapse, IconButton, Typography } from "@mui/material";
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

  const handleOpenInstagram = () => {
    window.open("https://www.instagram.com/boycotttracker", "_blank");
  };

  // get link_token from your server when component mounts
  useEffect(() => {
    const createLinkToken = async () => {
      const res = await axios.post(
        "https://boycott-tracker-server-905a00b98cf6.herokuapp.com/plaid/link",
        {
          client_id,
          secret,
          client_name: "calculator app",
          country_codes: ["US"],
          language: "en",
          products: ["auth"],
        }
      );
      console.log("res:", res);
      if (res.data?.linkToken) {
        setToken(res.data.linkToken);
      }
    };
    createLinkToken();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.post(
          "https://boycott-tracker-server-905a00b98cf6.herokuapp.com/plaid/transactions",
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
      const res = await axios.post(
        "https://boycott-tracker-server-905a00b98cf6.herokuapp.com/plaid/exchange",
        {
          // @ts-ignore
          public_token: metadata.public_token,
        }
      );
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
      "https://i.ibb.co/LNvJ4wj/Instagram-story-1-1-1.png".toString()
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
    <Box
      m="3em auto"
      textAlign={"center"}
      maxWidth={transactions.length > 0 ? "100vw" : "60em"}
    >
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
              Share to Instagram
            </Button>
            <Box mt={4}>
              <Typography
                gutterBottom
                className="connect"
                variant="body1"
                textAlign={"center"}
              >
                Connect with us
              </Typography>
              <IconButton onClick={handleOpenInstagram}>
                <InstagramIcon />
              </IconButton>
            </Box>
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
            <Typography mx={2} variant="body1" textAlign={"center"} mb={4}>
              After securely establishing a connection with your bank account
              through the reputable provider, Plaid, we retrieve your monthly
              transactions and meticulously scrutinize each one to identify any
              affiliations with{" "}
              <a
                target="_blank"
                href="https://som.yale.edu/story/2023/list-companies-have-condemned-hamas-terrorist-attack-israel"
              >
                companies
              </a>{" "}
              openly endorsing <strong>Isreal</strong>. It is imperative to
              emphasize that we do not retain any stored data.
            </Typography>
          </Collapse>
        </>
      )}
    </Box>
  );
};

export default Connect;
