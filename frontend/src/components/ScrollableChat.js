import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";

import ScrollableFeed from "react-scrollable-feed";//not part of reactor chakraUi
// but is an 3rd party npm package
//will show the profile icon on the sender inside the chats till it is disturbed or
//you the loggd in user sends  the message (just like Whasapp message ScrollableFeed) 

import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";


import { ChatState } from "../Context/ChatProivder";


//ScrollableChat will redner inside SingleChat Component
//and will be respongsible for showing all the messages for sender on right
//and for receiver on left
const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();//user stores the current loggded in user data

  console.log("ScrollableChat Component Triggered")

//Scrollable feed as its own internall messaging system ;like component did update and did mount and all lifecycyle methods with
//its internal console.log system
  return (

    //m is the chat message while i is the index of the message
    <ScrollableFeed messages={messages} >

      {messages &&
        messages.map((m, i) => (

          <div style={{ display: "flex" }} key={m._id}>

            {//isSameSender and isLastMessage will decide  the avatar will load or not for other chats rather than the logged in user
              (isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (

              //will show the user name when hovered
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )
            }
            <span 
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
            
              {m.content}
              
            </span>
          </div>
        )
        )}

    </ScrollableFeed>

  );
};



export default ScrollableChat;
//if messages are present then it will render something ore lese its blank

//USECASES during using ScrollableFeed component
//
//1st Use Cases when there is only one message either of sender or of the user sending it then
//if it is the sender then show the avatar and the message and if self user then show only the message
//isSamesender turns false and isLastMessage turns true then it justifies that the messsage