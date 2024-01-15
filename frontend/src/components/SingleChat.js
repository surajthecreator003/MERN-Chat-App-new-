import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProivder';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModal from './Miscellaneous/ProfileModel';
import UpdateGroupChatModal from './Miscellaneous/UpdateGroupChatModal';
import ScrollableChat from './ScrollableChat';
import axios from 'axios';
import  io from "socket.io-client";
import Lottie from "react-lottie";//Lottie package to show typing animation
import animationData from "../animation/typing.json";
//import { set } from 'mongoose';


//THIS WAS CREATING THE WHOLE ISSUE WHERE FRONTEND WAS NOT GETTING CONNECTED TO THE SOCKET.IO SERVER ON RENDER
const ENDPOINT=window.location.origin;// the server port where the socket is listening

var socket;
var selectedChatCompare;

//Single Chats is gonna show all kinds of chats both One on One andgroup Chats
//and is gonna provide Input Box to ensend Messages
const SingleChat = ({fetchAgain,setFetchAgain}) => {

  //whatever user we clicked on the My Chats becomes the selectedChat that vcontains the selected chat id
  const {user,selectedChat,setSelectedChat,notifications,setNotifications}=ChatState();
  console.log("chatid =",user);
  console.log("selectedChat =",selectedChat);
  //remember selectedChat provide the whole chat objectof that suer 


  const [messages, setMessages] = useState([]);//messages is the entire messages or chat 
  //to be rendered inside Scrollable Component

  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");//new message will store the message we typed in the input box
  const [socketConnected, setSocketConnected] = useState(false);//socketConnected will be sued in typing indicator


  const [typing, setTyping] = useState(false);//will help in indnicating typing
  const [istyping, setIsTyping] = useState(false);
  

//Lottie Typing indicator props
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };



const toast = useToast();


const sendMessage=async(event)=>{//sends the message and refetches the chats
  //
  if(event.key === "Enter"  && newMessage){


    socket.emit("stop typing", selectedChat._id);//s top the typing indicator after sending the message

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
        //console.log("Messages sent=",data);

        setNewMessage("");//empties the input box after sending the message


        console.log("new message to be emiteed=",data );


        //Most Important 
        socket.emit("new message",data);//this will update the state of the Connected sender

        setMessages([...messages,data])//destructure the previous data and add the old one

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


//will fetch the selected chats messages whether one on one or group chat
// and will also create a room 
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

    socket.emit("join chat", selectedChat._id);
    //basically will take the selected userid and join the room

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



//this will hanbdle the typing indicator
const typingHandler = (e) => {
  setNewMessage(e.target.value);

  if (!socketConnected) return;//checks if socket connection is connected or not

  if (!typing) {
    setTyping(true);
    socket.emit("typing", selectedChat._id);
  }

  //is more like a thgrottoling function than a debouncing function
  let lastTypingTime = new Date().getTime();//stores the imidiate time when the typing indicator started
  var timerLength = 3000;//3 secs

  setTimeout(() => {

    var timeNow = new Date().getTime();
    var timeDiff = timeNow - lastTypingTime;//finds the typing seconds

    if (timeDiff >= timerLength && typing) {//if still typing after 3 sconds then dont show the typing indicator 
      socket.emit("stop typing", selectedChat._id);
      setTyping(false);
    }
  }, timerLength);
};//remove this timer and it will show typing... continously


useEffect(()=>{// Creates the initial socket connection to the server
  socket=io(ENDPOINT);//is same as we do io(httpServer) on server side which provides a socket object with which we can do socket.join or anything


  //remember user is the user you are logged in with
  socket.emit("setup",user);//emitting custom event named "setup" for initial room creation that will trigger socket.join(user._id) on the server side

  socket.on("connected",()=>setSocketConnected(true))

 socket.on("typing",()=>{
   setIsTyping(true)
 })

 socket.on("stop typing",()=>{
   setIsTyping(false)
 })
// eslint-disable-next-line
},[])//this useEffect will run on the very first render of SingleChat even if no user is selected to chat and then wil attach the socket event handler to it






useEffect(() => {// just load the chat of the selected user each time you click it
  
  fetchMessages();// this has =>socket.emit("join chat", selectedChat._id); inside of it

  selectedChatCompare=selectedChat
  // eslint-disable-next-line
}, [selectedChat]);
//selectedChat is present in Chat provider(the global context)
//and connects Mychats to SingleChat




//this is the most important useEffect as this will update the sender connected to it
useEffect(()=>{
  socket.on("message received",(newMessageReceived)=>{
    

        //if in different chat then show the notification
        if(!selectedChatCompare  || selectedChatCompare._id !== newMessageReceived.chat._id){
           
          
          if (!notifications.includes(newMessageReceived)) {//if notification dosent have anything then add the newMessageReceived Object
            setNotifications([newMessageReceived, ...notifications]);
            setFetchAgain(!fetchAgain);
          }

        }
        else{//iof not in the same Chat then just update the messages
          setMessages([...messages,newMessageReceived])
        }
        // eslint-disable-next-line
  })
})
//and will also notify if the user isnot in the chat screen and is chatting with other


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

              {istyping ? (
                
                <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                
              ) : (
                <></>
              )}
              
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