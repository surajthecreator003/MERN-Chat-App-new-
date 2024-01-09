import { Box } from "@chakra-ui/layout";
import { ChatState } from "../../Context/ChatProivder";
import SingleChat from "../SingleChat";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  //selectedChat will help in making the ChatBox and SideDrawer Component responsive
  // and conditionally render it


  //show the Chat Box when chat is selected  and hide the SideDrware Component
  // and show the SideDrawer when chat is not selected and hide the ChatBox Component
  //to make it device flexible
  return (    
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} >
      </SingleChat>
    </Box>
  );
};

export default Chatbox;