import { createContext, useCallback, useEffect, useState } from 'react'
import { baseUrl, getRequest, postRequest } from '../utils/services'

export const ChatContext = createContext()

export const ChatContextProvider = ({ children, user }) => {
    const [userChats, setUserChats] = useState(null)
    const [isUserChatsLoading, setUserChatsLoading] = useState(null)
    const [userChatsError, setUserChatsError] = useState(null)
    const [potentialChats, setPotentialChats] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [messages, setMessages] = useState(null)
    const [isMessageLoading, setMessageLoading] = useState(null)
    const [messageError, setMessageError] = useState(null)
    const [sendTextMessageError, setSendTextMessageError] = useState(null)
    const [newMessage, setNewMessage] = useState(null)


    // CHECK THE POTENTIAL USER TO CHAT 
    useEffect(() => {
        const getUSer = async () => {
            const response = await getRequest(`${baseUrl}/users`)

            if (response.error) {
                return console.log("Error Fetching Users", response);
            }
            const pChats = response.filter((u) => {
                let isChatCreated = false

                // CHECK IF A USER IS NOT THE CURRENT USER 
                if (user?._id === u._id) return false;

                // CHECKS IF A CHAT HAS NOT ALREADY BEEN CREATED WITH THAT USER
                if (userChats) {
                    isChatCreated = userChats?.some((chat) => {
                        return chat.members[0] === u._id || chat.members[1] === u._id
                    })
                }
                return !isChatCreated
            })
            setPotentialChats(pChats)
        }
        getUSer()
    }, [userChats])


    // GET USER CHATS 
    useEffect(() => {
        const getUserChats = async () => {
            if (user?._id) {
                setUserChatsLoading(true)
                setUserChatsError(null)

                const response = await getRequest(`${baseUrl}/chats/${user._id}`)
                setUserChatsLoading(false)

                if (response.error) {
                    return setUserChatsError(response)
                }
                return setUserChats(response)
            }
        }
        getUserChats()
    }, [user])


    // GET MESSAGES 
    useEffect(() => {
        const getMEssages = async () => {
            setMessageLoading(true)
            setMessageError(null)

            const response = await getRequest(`${baseUrl}/messages/${currentChat?._id}`)
            setMessageLoading(false)

            if (response.error) {
                return setMessageError(response)
            }
            return setMessages(response)
        }
        getMEssages()
    }, [currentChat])


    // UPDATE CHAT 
    const updateCurrentChat = useCallback((chat) => {
        setCurrentChat(chat);
    }, []);


    // CREATE CHAT 
    const createChat = useCallback(async (firstId, secondId) => {
        const response = await postRequest(`${baseUrl}/chats`, JSON.stringify({
            firstId, secondId
        }))

        if (response.error) {
            return console.log("Error creating Chat", response);
        }
        setUserChats((prev) => [...prev, response])
    }, [])


    // SEND MESSAGE 
    const sendMessage = useCallback(async (textMessage, sender, currentChatId, setTextMessage) => {
        if (!textMessage) return console.log("Type Something to send");

        const response = await postRequest(`${baseUrl}/messages`, JSON.stringify(
            {
                chatId: currentChatId,
                senderId: sender._id,
                text: textMessage
            }))

        if (response.error) {
            console.log("Error sending Message", response);
            return setSendTextMessageError(response)
        }

        setNewMessage(response)
        setMessages((prev) => [...prev, response])
        setTextMessage('')
    }, [])


    return <ChatContext.Provider value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        potentialChats,
        createChat,
        updateCurrentChat,
        messages,
        isMessageLoading,
        messageError,
        currentChat,
        sendMessage
    }}>
        {children}
    </ChatContext.Provider>
}