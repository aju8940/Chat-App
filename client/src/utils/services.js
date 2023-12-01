export const baseUrl = "http://localhost:3000/api";

// FETCHING API FOR POST REQUEST
export const postRequest = async (url, body) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

  const data = await response.json();
  if (!response) {
    let message;
    if (data?.message) {
      message = data.message;
    } else {
      message = data;
    }
    return { error: true, message };
  }
  return data;
};

// FETCHING API FOR GET REQUEST
export const getRequest = async (url) => {
  const response = await fetch(url);
  
  const data = await response.json();

  if (!response.ok) {
    let message = "An error had occured....";
    if (data?.message) {
      message = data.message;
    }
    return { error: true, message };
  }
  return data;
};
