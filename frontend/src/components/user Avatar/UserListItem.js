import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";

//this was causing error
//import { ChatState } from "../../Context/ChatProivder";

const UserListItem = ({ handleFunction,user }) => {
  

  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
      display="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >

    {/* the avatar of the user is displayed here */}
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
      />

      
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {user.email}
          {console.log(user.email)}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;

//Code review Done