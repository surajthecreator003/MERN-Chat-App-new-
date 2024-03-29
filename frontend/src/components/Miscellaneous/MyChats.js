import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/ChatProivder'
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { getSender } from '../../config/ChatLogics';
import GroupChatModal from './GroupChatModal';


//My Chats will show all the users of One and One and Group Chats with latest messages
const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  console.log("selectedChat=", selectedChat);

  const toast = useToast();


  //fetchChats is gonna fetch all the one on one and group chats names 
  //along with the latest messages
  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      console.log("Inside MyChats Component => Fetched Chats=",data);

      setChats(data);

    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {

    console.log("useEffect Triggered inside MyChats Component")

    //stores the user (extracting from JWT token) in the localstorage of browser
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));

    fetchChats();
    
    //eslint-disable-next-line
  }, [fetchAgain]);//fetchAgain is in ChatPage(The Mother Component)

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      allignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >

    {/* the header of the box shows the text's MY Chats and New Group Chat +*/}
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      {/* the box below shows the list of chats of both One to One and Group Chat */}
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          // Stack component is used to display the chats in a stack
          <Stack overflowY="scroll">

            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >

                <Text>{/* if it is a group chat then display the chat name else display the single user*/}
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {/* if there are no latest message and the chat is initial after you click then there would be no latest message shown*/}
                {chat.latestMessage && (
                  <Text fontSize="xs">
                  {/* if the latest message is more than 50 characters then display only 50 characters else display the whole message*/}
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          //show Loaading if chats is not present take long to render
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats


//the fetch returns the data in latest order depending upon the time so
//in the MyChat Component we see the chats from latest to oldest in order
//Code revirew Completed