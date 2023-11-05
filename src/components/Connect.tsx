import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import InstagramIcon from "@mui/icons-material/Instagram";

import { usePlaidLink, PlaidLinkOnSuccess } from "react-plaid-link";
import { Box, Button, Collapse, IconButton, Typography } from "@mui/material";
import { findMatchingCompanies } from "../utils";

const client_id = "654071b04b5732001c52f1f1";
const secret = "bc7a4a6ca8ef7ead85c8e5bc110313";

function truncateString(inputString: string) {
  if (inputString.length <= 15) {
    return inputString;
  } else {
    return inputString.slice(0, 15) + "...";
  }
}

const Connect = () => {
  const [token, setToken] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isExplainerOpen, setExplainerOpen] = useState(false);
  const [dynamicImage, setDynamicImage] = useState<any>(null);
  const { totalAmount, companyNames } = findMatchingCompanies(
    transactions || []
  );

  console.log("totalAmount:", totalAmount);
  console.log("companyNames:", companyNames);

  useEffect(() => {
    const generateDynamicImage = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Create an Image object to load the external image
      const externalImage = new Image();
      externalImage.crossOrigin = "Anonymous"; // Enable cross-origin access
      externalImage.src = "./ig-template.png";

      externalImage.onload = () => {
        // Set canvas dimensions to match the external image
        canvas.width = externalImage.width;
        canvas.height = externalImage.height;

        // Draw the external image onto the canvas
        // @ts-ignore
        ctx.drawImage(externalImage, 0, 0);

        // Add the user-specific content (company names) to the canvas
        // @ts-ignore
        ctx.fillStyle = "black"; // Set text color
        // @ts-ignore
        ctx.font = "72px black"; // Set font style
        // @ts-ignore
        ctx?.fillText(`$${totalAmount}`, 308, 755);
        // @ts-ignore
        ctx.font = "54px black"; // Set font style
        companyNames.forEach((company, index) => {
          const x = 308; // X-coordinate remains the same
          const y = 848 + index * (54 + 30);
          // @ts-ignore
          ctx.fillText(truncateString(company), x, y); // Adjust coordinates as needed
        });

        // Convert the canvas to a PNG image
        const dynamicImage = canvas.toDataURL("image/png");

        setDynamicImage(dynamicImage);
      };
    };

    generateDynamicImage();
  }, [totalAmount, companyNames]);

  const saveToDevice = () => {
    if (dynamicImage) {
      // Create an anchor element to trigger the download
      const downloadLink = document.createElement("a");
      downloadLink.href = dynamicImage;
      downloadLink.download = "Boycott-Israel.png"; // Set the filename

      // Trigger a click event on the anchor element to start the download
      downloadLink.click();
    }
  };

  const onShare = async () => {
    if (dynamicImage) {
      // Create a blob from the dynamic image data
      const blob = await fetch(dynamicImage).then((response) =>
        response.blob()
      );

      // Create a File object from the blob
      const file = new File([blob], "Boycott-Israel.png", {
        type: "image/png",
        lastModified: new Date().getTime(),
      });

      // Prepare the share data with the dynamic image
      const shareData = {
        files: [file],
      };

      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      }
    }
  };

  const toggleExplainer = () => {
    setExplainerOpen(!isExplainerOpen);
  };

  const handleOpenInstagram = () => {
    window.open("https://www.instagram.com/boycotttracker", "_blank");
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

  console.log("companyNames:", companyNames);
  console.log("totalAmount:", totalAmount);

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
        <Box m="0 auto" textAlign={"center"}>
          <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
            <img
              style={{
                height: "66vh",
                borderRadius: "13px",
                marginBottom: "2em",
              }}
              src={dynamicImage}
              alt="Dynamic Image"
            />

            <Button
              className="share_btn"
              onClick={onShare}
              variant="contained"
              style={{ marginBottom: "1em" }}
            >
              Share to Instagram
            </Button>
            <Button
              className="share_btn"
              onClick={saveToDevice}
              variant="contained"
              style={{ marginBottom: "4em" }}
            >
              Save to device
            </Button>
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
