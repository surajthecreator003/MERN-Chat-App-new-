import {createContext , useContext , useState , useEffect} from "react";
import {useHistory} from "react-router-dom";

const ChatContext=createContext();//creating the initial state of the App

const ChatProvider =({children})=>{
    const[user,setUser]=useState();

    const history=useHistory();

    useEffect(()=>{
        const userInfo=JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);

        if(!userInfo){
            history.push("/")
        }
    },[history])

    //the ChatContext we created is being used here like a component
    return(
        <ChatContext.Provider value={{user,setUser}}>
            {children}
        </ChatContext.Provider>
    )
}


export const ChatState=()=>{

    return useContext(ChatContext);

}


export default ChatProvider;