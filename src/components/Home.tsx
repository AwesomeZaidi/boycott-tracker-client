import { Box, Button, IconButton, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import InstagramIcon from "@mui/icons-material/Instagram";
const Home = () => {
  const handleOpenInstagram = () => {
    window.open("https://www.instagram.com/boycotttracker", "_blank");
  };

  return (
    <Box
      m="3em auto"
      textAlign={"center"}
      width={"100vw"}
      height="80vh"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Box>
        <Typography
          gutterBottom
          variant="h4"
          textAlign={"center"}
          className="title"
        >
          Financial boycotting
        </Typography>
        <Typography mx={2} variant="body1" textAlign={"center"} mb={4}>
          Find out how much you’ve been spending towards the following:
        </Typography>

        <Link to={`israel`}>
          <Button className="primary_btn">Israel</Button>
        </Link>
      </Box>
      <Box>
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
  );
};

export default Home;
