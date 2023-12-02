import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
    const [userChats, setUserChats] = useState(null);
    const [isUserChatsLoading, setUserChatsLoading] = useState(null);
    const [userChatsError, setUserChatsError] = useState(null);
    const [potentialChats, setPotentialChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState(null);
    const [isMessageLoading, setMessageLoading] = useState(null);
    const [messageError, setMessageError] = useState(null);
    const [sendTextMessageError, setSendTextMessageError] = useState(null);
    const [newMessage, setNewMessage] = useState(null);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);


    ///////////////       SOCKET.IO      ////////////////

    // Initialising
    useEffect(() => {
        const newSocket = io("http://localhost:5000");
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [user]);


    // Triggering Event
    useEffect(() => {
        if (socket === null) return;

        socket.emit("addNewUser", user?._id);
        socket.on("getOnlineUsers", (res) => {
            setOnlineUsers(res);
        });

        return () => {
            socket.off("getOnlineUsers");
        };
    }, [socket]);


    // Sending Message
    useEffect(() => {
        if (socket === null) return;

        const recipientId = currentChat?.members?.find((id) => id !== user?._id);

        socket.emit("sendMessage", { ...newMessage, recipientId });
    }, [newMessage]);


    // Recieve message
    useEffect(() => {
        if (socket === null) return;

        socket.on("getMessage", (res) => {
            if (currentChat?._id !== res.chatId) return;
            setMessages((prev) => [...prev, res]);
        });

        return () => {
            socket.off("getMessage");
        };
    }, [socket, currentChat]);


    ////////////////////     CHAT - USER  /////////////////////////

    // Check the potential user to chat
    useEffect(() => {
        const getUSer = async () => {
            const response = await getRequest(`${baseUrl}/users`);

            if (response.error) {
                return console.log("Error Fetching Users", response);
            }
            const pChats = response.filter((u) => {
                let isChatCreated = false;

                // CHECK IF A USER IS NOT THE CURRENT USER
                if (user?._id === u._id) return false;

                // CHECKS IF A CHAT HAS NOT ALREADY BEEN CREATED WITH THAT USER
                if (userChats) {
                    isChatCreated = userChats?.some((chat) => {
                        return chat.members[0] === u._id || chat.members[1] === u._id;
                    });
                }
                return !isChatCreated;
            });
            setPotentialChats(pChats);
        };
        getUSer();
    }, [userChats]);


    // Get user chats
    useEffect(() => {
        const getUserChats = async () => {
            if (user?._id) {
                setUserChatsLoading(true);
                setUserChatsError(null);

                const response = await getRequest(`${baseUrl}/chats/${user._id}`);
                setUserChatsLoading(false);

                if (response.error) {
                    return setUserChatsError(response);
                }
                return setUserChats(response);
            }
        };
        getUserChats();
    }, [user]);


    // Update chat
    const updateCurrentChat = useCallback((chat) => {
        setCurrentChat(chat);
    }, []);


    // Create chat
    const createChat = useCallback(async (firstId, secondId) => {
        const response = await postRequest(
            `${baseUrl}/chats`,
            JSON.stringify({
                firstId,
                secondId,
            })
        );

        if (response.error) {
            return console.log("Error creating Chat", response);
        }
        setUserChats((prev) => [...prev, response]);
    }, []);


    ////////////////////     MESSAGES    ///////////////////

    // Get messages
    useEffect(() => {
        const getMEssages = async () => {
            setMessageLoading(true);
            setMessageError(null);

            const response = await getRequest(
                `${baseUrl}/messages/${currentChat?._id}`
            );
            setMessageLoading(false);

            if (response.error) {
                return setMessageError(response);
            }
            return setMessages(response);
        };
        getMEssages();
    }, [currentChat]);


    // Send message
    const sendMessage = useCallback(
        async (textMessage, sender, receiver, currentChatId, setTextMessage) => {
            if (!textMessage) return console.log("Type Something to send");

            const response = await postRequest(
                `${baseUrl}/messages`,
                JSON.stringify({
                    chatId: currentChatId,
                    senderId: sender._id,
                    text: textMessage,
                })
            );

            if (response.error) {
                console.log("Error sending Message", response);
                return setSendTextMessageError(response);
            }

            setNewMessage(response);
            setMessages((prev) => [...prev, response]);
            setTextMessage("");
        },
        []
    );

    return (
        <ChatContext.Provider
            value={{
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
                sendMessage,
                onlineUsers,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};
