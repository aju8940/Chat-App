import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { Stack } from 'react-bootstrap'
import avatar from '../../assets/avatar.svg'
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";

const UserChat = ({ chat, user }) => {
    const { recipientUser } = useFetchRecipientUser(chat, user)
    const { onlineUsers } = useContext(ChatContext)

    return (
        <Stack direction="horizontal" gap={3} className="user-card align-items-center p-2 justify-content-between"
            role="button">
            <div className="d-flex">
                <div className="me-2"> <img src={avatar} height='35px' alt="avatar" /> </div>
                <div className="text-content">
                    <div className="name">{recipientUser?.name}</div>
                    <div className="text">Text Messages</div>
                </div>
            </div>
            <div className="d-flex flex-columnalign-items-center">
                <div className="date">
                    01/01/2023
                </div>
                <div className="this-user-notifications">
                    2
                </div>
                { onlineUsers.some((onlineUser) => onlineUser.userId === recipientUser?._id) && <span className="user-online"></span> }
            </div>
        </Stack>)
}

export default UserChat;