import { Box, Button, Menu, MenuButton, Text, Tooltip , Avatar, MenuList, MenuItem, MenuDivider } from "@chakra-ui/react";
import React, { useState } from "react";
import {BellIcon,ChevronDownIcon} from  "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProivder";


const SideDrawer=()=>{

    const [search,setSearch]=useState("");
    const [searchResult,setSearchResult]=useState([]);
    const [loading,setLoading]=useState(false);
    const [loadingChat,setLoadingChat]=useState();


    const {user}=ChatState()

    return <div>
        
        <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px">
            <Tooltip label="Search users to Chat" hasArrow  placement="bottom-end">
                <Button variant="ghost"><i className="fas fa-search"></i>
                   <Text d={{base:"none",md:"flex"}} px="4">Search User</Text>
                </Button>
            </Tooltip>

            {/*CHANGE THIS TO CHANGE APP NAME */}
            <Text fontSize="2xl" fontFamily="Work sans">
            Talk-A-Tive
            </Text>

            <div>
                <Menu>
                  <MenuButton p={1}>

                  <BellIcon fontSize="2xl" m={1} />

                     
                  </MenuButton>
                </Menu>

                <Menu>
                  <MenuButton as={Button} rightIcon ={<ChevronDownIcon />}>
                      <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
                  </MenuButton>

                  <MenuList>
                     <MenuItem>My Profile</MenuItem>
                     <MenuDivider />
                     <MenuItem>Log Out</MenuItem>
                  </MenuList>
                </Menu>
            </div>
        </Box>


    </div>
}

export default SideDrawer;