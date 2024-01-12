import {createContext , useContext , useState , useEffect} from "react";
import {useHistory} from "react-router-dom";

const ChatContext=createContext();//creating the initial state of the App

const ChatProvider =({children})=>{
    const[user,setUser]=useState();
    const[selectedChat,setSelectedChat]=useState();
    const[chats,setChats]=useState([]);

    const history=useHistory();


    //need to fetch and add selectedChats inside useEffect
    useEffect(()=>{
        const userInfo=JSON.parse(localStorage.getItem("userInfo"));

        //console.log("userInfo=",userInfo);
        setUser(userInfo);

        //console.log("user=",user);

        if(!userInfo){
            history.push("/");
        }
    },[history])

    //the ChatContext we created is being used here like a component
    return(
        <ChatContext.Provider value={{user,setUser,selectedChat,setSelectedChat,chats,setChats}}>
            {children}
        </ChatContext.Provider>
    )
}


export const ChatState=()=>{

    return useContext(ChatContext);

}


export default ChatProvider;