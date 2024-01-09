import { Box } from '@chakra-ui/react';
import {ChatState} from '../Context/ChatProivder';
import SideDrawer from '../components/Miscellaneous/SideDrawer';
import MyChats from '../components/Miscellaneous/MyChats';
import ChatBox from '../components/Miscellaneous/ChatBox';
import { useState } from 'react';
//import axios from "axios";


//Chatpage will render the whole Page after login and signup and
//will render Chats and searchbar and the Header
const Chatpage = () => {

const {user}=ChatState();//will get the user that logged in from the context provider

//fetchChat and setFetchChat are gonna be the one that will 
//connect MyChats and ChatBox Component
const[fetchAgain,setFetchAgain]=useState(false);
//fetchAgain and setFetchAgain are going through prop drilling 
//should add these two to Chat Context Provider

  return (
    <div style={{width:"100%"}}>

     {user && <SideDrawer/>}

     <Box display="flex" justifyContent="space-betwen" w="100" h="91.5vh" p="10px">

       {user && <MyChats 
                  fetchAgain={fetchAgain}
                     
                  />
        }

       {
       user && <ChatBox
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
                />
       }
     </Box>

    </div>
  )
}

export default Chatpage