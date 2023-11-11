import React,{useState} from 'react';
import {  Button,Input,FormControl,FormLabel, VStack, InputGroup, InputRightElement } from '@chakra-ui/react'


const Login = () => {
   
    const [email,setEmail]=useState();
    const [password,setPassword]=useState();
    const [show,setShow]=useState(false)
   
    const handleClick=()=>setShow(!show);
   
    const postDetails=(pics)=>{
   
    }
   
    const submitHandler=()=>{}
   
   
   
     return (
       <VStack spacing="5px" color="black">
           
   
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
   

   
           <Button
           colorScheme="blue"
           width="100%"
           style={{ marginTop: 15 }}
           onClick={submitHandler}
           
         >
           Sign Up
         </Button>

         <Button
           variant="solid"
           colorScheme="red"
           width="100%"
          
           onClick={()=>{
            setEmail("gues@example.com");
            setPassword("123456")
           }           
           }
           
         >
           Get Guest User Credentials
         </Button>
   
   
       </VStack>
     )
}

export default Login