import React,{useState} from 'react';
import {  Button,Input,FormControl,FormLabel, VStack, InputGroup, InputRightElement } from '@chakra-ui/react'

const Signup = () => {
 const [name,setName]=useState();
 const [email,setEmail]=useState();
 const [password,setPassword]=useState();
 const [confirmpassword,setConfirmpassword]=useState();
 const [pic,setPic]=useState();
 const [show,setShow]=useState(false)

 const handleClick=()=>setShow(!show);

 const postDetails=(pics)=>{

 }

 const submitHandler=()=>{}



  return (
    <VStack spacing="5px" color="black">
        <FormControl id="first-name">
            <FormLabel>
            Name
            </FormLabel>
            <Input
              placeholder="Enter Your Name"
              onChange={(e)=>{setName(e.target.value)}} />
        </FormControl>

        <FormControl id="email">
            <FormLabel>
            Email
            </FormLabel>
            <Input
              placeholder="Enter Your Email"
              onChange={(e)=>{setEmail(e.target.value)}} />
        </FormControl>

        <FormControl id="password" isRequired>
            <FormLabel>
            Password
            </FormLabel>
            <InputGroup>
                <Input
                type={show?"text":"password"}
                placeholder="Enter Your Email"
                onChange={(e)=>{setPassword(e.target.value)}} />

            <InputRightElement width="4.5rem">
               <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
               </Button>

            </InputRightElement>
            </InputGroup> 
        </FormControl>

        <FormControl id="password" isRequired>
            <FormLabel>
            Confirm Password
            </FormLabel>
            <InputGroup>
                <Input
                type={show?"text":"password"}
                placeholder="Enter Your Email"
                onChange={(e)=>{setConfirmpassword(e.target.value)}} />

            <InputRightElement width="4.5rem">
               <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
               </Button>

            </InputRightElement>
            </InputGroup> 
        </FormControl>

        <FormControl id="pic">
            <FormLabel>
            Uplad your Picture
            </FormLabel>
            <Input
              type="file"
              onChange={(e)=>postDetails(e.target.value)} 
              p={1.5}
              accept="image/*"
              />
              
        </FormControl>

        <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        
      >
        Sign Up
      </Button>


    </VStack>
  )
}

export default Signup