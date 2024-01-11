//RULES for the chat logics

//messages   will have all the messages ,
//m   will have the single message object
//i   will be the index of the object
//userId   is youeself the person w ho is logged in
//m   will have the single object in map


//will adda  little space after the Avatar icon  
export const isSameSenderMargin = (messages, m, i, userId) => {
    

    if (//this will allign the mesage before the next same message of the sender as the avatar will take 33px
      i < messages.length - 1 &&
      messages[i + 1].sender._id === m.sender._id &&
      messages[i].sender._id !== userId
    )
      return 33;
    else if (//this will help the message to allign beside the avatar with no spacing
      (i < messages.length - 1 &&
        messages[i + 1].sender._id !== m.sender._id &&
        messages[i].sender._id !== userId) ||
      (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
      return 0;//this is the margin after the AVATAR ICON
    else return "auto";//this will put the messages that you are sending to the right side of the screen
  };
  


  //checks if the message is not the last message and also the message is not 
  export const isSameSender = (messages, m, i, userId) => {
    return (//returns boolean
      i < messages.length - 1 //cheks if the message is not the lsat message
      &&

      
      (messages[i + 1].sender._id !== m.sender._id ||  //checks if the messsage id is not equal to the message id of next one
        messages[i + 1].sender._id === undefined)      // or the message id is undefined 
      &&//this will cause error so we need 
      //(isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id))among one to satisy one true for both last message and to render AVATAR Component


      messages[i].sender._id !== userId//if this becoms false here then the isLastMessage gets triggered to true if the second  && condition in isLastMessage  becomes true
    );
  };
  

  //checks if the messsage is the last message 
  export const isLastMessage = (messages, i, userId) => {
    return (
      i === messages.length - 1
       &&
      messages[messages.length - 1].sender._id !== userId //this will cause the Avatar to render if the message id is not the same as logged in user
      &&
      messages[messages.length - 1].sender._id//sends the last message id of the message array
    );
  };
  


  //will check if the user is same then will ADD A SPACE  if not then dont add space as its gonna be on the other side
  export const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
  };
  
  export const getSender = (loggedUser, users) => {
    //checks the logged user is same or different and returns the sender name at index 1
    // and remember the logged user is always at 0 index in the schema
    //thats whybnreturn 1 index or if not then return 0 index rather than returning nothing
    return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
  };
  
  export const getSenderFull = (loggedUser, users) => {
    //does the same as getSender but this one returns the whole user object at index 1 or thesender
    //rather than only name of the user
    return users[0]._id === loggedUser._id ? users[1] : users[0];
  };