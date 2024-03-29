import React from 'react';
import {Container,Box,Text} from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Login from "../components/Authentication/Login"
import Signup from "../components/Authentication/Signup"
import {useEffect} from "react";
import {useHistory} from "react-router-dom";


//Home page will contain Signup and Login page
const Homepage = () => {

  const history=useHistory();
  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem("userInfo"));
    
    if(!user){
        history.push("/chats")
    }
},[history])



  return (
    <Container maxW="xl" centerContent>

    <Box
    display="flex"
    justifyContent="center"
    p={3}
    bg={"white"}
    w="100%"
    m="40px 0 15px 0"
    borderRadius="lg"
    borderWidth="1px"
    >
      <Text fontSize="4xl" fontFamily="Work sans" >
        Talk-A-Tive
      </Text>
    </Box>

    <Box color="black" bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1" >
    <Tabs variant='soft-rounded' >

      <TabList>
        <Tab width="50%">Login</Tab>
        <Tab width="50%">Sign Up!</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
           <Login />
        </TabPanel>
           
        <TabPanel>
        <Signup />
        </TabPanel>
      </TabPanels>
        </Tabs>
    </Box>

    </Container>

    
  )
}

export default Homepage