import { Box } from '@chakra-ui/react';
import {ChatState} from '../Context/ChatProivder';
import SideDrawer from '../components/Miscellaneous/SideDrawer';
import MyChats from '../components/Miscellaneous/MyChats';
import ChatBox from '../components/Miscellaneous/ChatBox';
//import axios from "axios";

const Chatpage = () => {

const {user}=ChatState()

  return (
    <div style={{width:"100%"}}>

     {user && <SideDrawer/>}

     <Box d="flex" justifyContent="space-betwen" w="100" h="91.5vh" p="10px">
       {user && <MyChats/>}
       {user && <ChatBox/>}
     </Box>

    </div>
  )
}

export default Chatpage