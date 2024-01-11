import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProivder';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModal from './Miscellaneous/ProfileModel';
import UpdateGroupChatModal from './Miscellaneous/UpdateGroupChatModal';
import ScrollableChat from './ScrollableChat';
import axios from 'axios';


//Single Chats is gonna show all kinds of chats both One on One andgroup Chats
//and is gonna provide Input Box to ensend Messages
const SingleChat = ({fetchAgain,setFetchAgain}) => {


//whatever user we clicked on the My Chats becomes the selectedChat
const {user,selectedChat,setSelectedChat}=ChatState();


const [messages, setMessages] = useState([]);//messages is the entire messages or chat 
//to be rendered inside Scrollable Component

const [loading, setLoading] = useState(false);
const [newMessage, setNewMessage] = useState("");//new message will store the message we typed in the input box

const toast = useToast();


const sendMessage=async(event)=>{//sends the message and refetches the chats
  //
  if(event.key === "Enter"  && newMessage){

    try{
        const config={
          headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${user.token}`
          }
        }

        setNewMessage("");//again turns the input box message to empty
        //after sending the message

        const {data}=await axios.post("/api/message",{content:newMessage,chatId:selectedChat._id},config)
        console.log("Messages sent=",data);

        setNewMessage("");//empties the input box after sending the message

        setMessages([...messages,data])//a way to destructure and show data from oldest to newest on the bottom

        console.log("messages after updating=",messages)//this will not show the updated messages after rendnering
        //as expected as it would show after the next render
        

    }catch(error){ 
      toast({
        title: "Error Occured!",
        description: "Failed to send the Message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }


  }

};


//will fetch the seelced chats messages whether one on one or group chat
const fetchMessages = async () => {
  if (!selectedChat) return;

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    setLoading(true);

    const { data } = await axios.get(
      `/api/message/${selectedChat._id}`,
      config
    );

  console.log("Messages fetched to be shown inside ScrollableChat=",data)
  
    setMessages(data);
    setLoading(false);

    //socket.emit("join chat", selectedChat._id);
  } catch (error) {
    toast({
      title: "Error Occured!",
      description: "Failed to Load the Messages ",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  }
};



useEffect(() => {//just loadthe chat of the selected user 
  fetchMessages();
}, [selectedChat]);
//selectedChat is present in Chat provider(the global context)
//and conncts Mychats to SingleChat





const typingHandler=(e)=>{
  setNewMessage(e.target.value)
  //typing indicator logic
};

  return (
    <>
    {selectedChat ? <>
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

                    {/*Profile Modal(EYE Button inside Single Chats) will display the profile of the user you are chatting with */}
                    <ProfileModal user={getSenderFull(user,selectedChat.users)}/>

                    </> 
                    :
                    <>
                    {selectedChat.chatName.toUpperCase()}

                    {/*UpdateGroupChatModal is the EYE button inside Group*/}
                    <UpdateGroupChatModal
                        fetchAgain={fetchAgain}
                        setFetchAgain={setFetchAgain}
                        fetchMessages={fetchMessages}

                    />
                    </>
            }
        </Text> 

        {/*this Box will display the messages of the selectedChat */}
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

              {// the Messages
                loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                allignSelf="center"
                margin="auto"
              />
            ) : (
              
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>

            )
            }

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>

        </Box>
        </>

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
          {/*if no user is selected then display the text below */}
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
               
          </Box>
    }
    </>
  )
}

export default SingleChat
//almost code review done