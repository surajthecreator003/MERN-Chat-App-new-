import React from 'react'
import { ChatState } from '../Context/ChatProivder';
import { Box, IconButton, Text } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModal from './Miscellaneous/ProfileModel';

const SingleChat = ({fetchAgain,setFetchAgain}) => {


    //whatever user we clicked on the My Chats becomes the selectedChat
const {user,selectedChat,setSelectedChat}=ChatState();

  return (
    <>
    {selectedChat ? 
        <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            allignItems="center">
           

           {/*this IconButton will display a Back Arow button when device is small*/}
           {/*setSelectedChat() will set the selected chat empty that will force you to go back */}
           <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />

            {/*if selectedChat is  groupchat then make the GROUP CHAT NAME CAPITAL */}
            {/*else display the name of the user you are chatting with in CAPITAL*/}
            {!selectedChat.isGroupChat ?
                    <>
                    {getSender(user,selectedChat.users)}

                    {/*Profile Modal will display the profile of the user you are chatting with */}
                    <ProfileModal user={getSenderFull(user,selectedChat.users)}/>

                    </> 
                    :
                    <>
                    {selectedChat.chatName.toUpperCase()}
                    </>
            }


            {/*UpdatedGroupChatModel */}

        </Text> 
        :

          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >

          </Box>
    }
    </>
  )
}

export default SingleChat