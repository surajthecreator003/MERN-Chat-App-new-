import { Box, Button, Menu, MenuButton, Text, Tooltip , Avatar, MenuList, MenuItem, MenuDivider, Drawer,useDisclosure, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Input, useToast, Spinner } from "@chakra-ui/react";
import React, { useState } from "react";
import {BellIcon,ChevronDownIcon} from  "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProivder";
import ProfileModal from "./ProfileModel";
import { useHistory } from "react-router-dom";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "../user Avatar/UserListItem";
import { getSender } from "../../config/ChatLogics";



//This SideDrawer Component acts like a Header and renders  the Search feature
//along with the Bell icon and the Profile Icon
//SHOULD SEPAREATE HEADER IN FUTURE AND MAKE IT A DIFFERENT COMPONENT
const SideDrawer=()=>{




    const [search,setSearch]=useState("");
    const [searchResult,setSearchResult]=useState([]);
    const [loading,setLoading]=useState(false);
    const [loadingChat,setLoadingChat]=useState();

   //const [color,setColor]=useState();

    //this setSelectedChat will upodate the MyChats Component when chats is selected
    const {user,setSelectedChat,chats,setChats,notifications,setNotifications}=ChatState();
    const history=useHistory();
    const {isOpen,onClose,onOpen}=useDisclosure();

    const logoutHandler=()=>{
        localStorage.removeItem("userInfo");
        history.push("/");
    }

    const toast=useToast();

    //WIll help us search all the users depending upon the input int the search box
    const handleSearch = async () => {
        if (!search) {
          toast({
            title: "Please Enter something in search",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top-left",
          });
          return;
        }
    
        try {
          setLoading(true);
    
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
    
          const { data } = await axios.get(`/api/user?search=${search}`, config);
    
          setLoading(false);
          setSearchResult(data);
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: "Failed to Load the Search Results",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
        }
      };

    

      //accessChat will help initialize the First chat after finding the users
      //from the search bar and clicking it for the first time
      const accessChat = async (userId) => {
        //userid is the user ID we are logged in  with
        console.log(userId);
    
        try {
          setLoadingChat(true);// as initially it will take a few miliseconds to fetch chats so
          //we will show a Loading Animation
          const config = {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.post(`/api/chat`, { userId }, config);
    
          if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
          console.log(chats)
          
          setSelectedChat(data);//this will rerender if the data changes
          setLoadingChat(false);
          onClose();
        } catch (error) {
          toast({
            title: "Error fetching the chat",
            description: error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
        }
      };
    


      //const eventhandler=()=>{console.log("got clicked")}

    return <div>
        {/*The Box is the MAIN Component that encompasses everything from Header to CHat Box and Users Search */}
        {/* SHOULD TRY TO REMOVE ONCLICK FROM THE BOX BELOW AS IT IS TRIGGERING  */}
        <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px">
 
            {/* SEARCH USERS component*/}
            <Tooltip label="Search users to Chat" hasArrow  placement="bottom-end">
                <Button variant="ghost" onClick={onOpen}>
                <i className="fas fa-search"></i>
                <Text display={{base:"none",md:"flex"}} px="4">Search User</Text>
                </Button>
            </Tooltip>

            {/*MAIN NAME of App */}
            <Text fontSize="2xl" fontFamily="Work sans">
            Talk-A-Tive
            </Text>


            {/* contains the BELL and PROFILE COMPONENT */}
            <div>

                <Menu>{/* Bell Icon */}
                  <MenuButton p={1}>

                  
                  
                  <BellIcon fontSize="2xl" m={1} />
                  {notifications.length ?  notifications.length :0}

                  
   
                  </MenuButton>

                  <MenuList pl={2}>
                    {!notifications.length && "No New Messages"}

                    {notifications.map((notif) => {
                      console.log("notif=",notif);
                      return (
                      
                    <MenuItem
                      key={notif._id}
                      onClick={() => {
                        setSelectedChat(notif.chat);//this is not triggering to change the SingleChats
                        setNotifications(notifications.filter((n) => n !== notif));
                    }}

                  >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                  </MenuItem>

                  )})}

                  
                  </MenuList>
                </Menu>


                
                <Menu>
                  <MenuButton as={Button} rightIcon ={<ChevronDownIcon />}>
                      <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
                  </MenuButton>

                  <MenuList>
                            <ProfileModal user={user} >
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                     
                            <MenuDivider />
                            
                            <MenuItem onClick={logoutHandler}>Log Out</MenuItem>                    
                  </MenuList>
                </Menu>

            </div>
        </Box>



        {/* this is the SEARCH BAR MODAL that will open after clicking Search User*/}
        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              
              {/* the Search Input Field inside the Modal */}
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <Button onClick={handleSearch}>Go</Button>

            </Box>


            {/* the Search Results that will be displayed after clicking Go */}
            {loading ? (
              <ChatLoading />
            ) : (
                
              searchResult?.map((user) => 
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              )
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>

    </div>
}

export default SideDrawer;


//Fully COde reviewed this component