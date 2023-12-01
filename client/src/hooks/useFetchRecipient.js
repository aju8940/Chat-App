import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";


// FIND OTHER USER IN THE CHAT 
export const useFetchRecipientUser = (chat, user) => {
  const [recipientUser, setRecipientUser] = useState(null);
  const [error, setError] = useState(null);

  const recipientId = chat?.members?.find((id) => id !== user?._id);

  useEffect(() => {
    const getUSer = async () => {
      if (!recipientId) return null;

      const response = await getRequest(`${baseUrl}/users/find/${recipientId}`);
      
      if (response.error) {
        setError(response.error);
      }
      
      setRecipientUser(response);
    }

    getUSer();
  }, [recipientId]);


  return { recipientUser, error };
};

