import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
export const postData = async (url, formData, method = "POST") => {
  try {
    const response = await fetch(apiUrl + url, {
      method,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const errorData = await response.json();
      return errorData;
    }
  } catch (error) {
    console.error("Error:", error);
    return { error: "An unexpected error occurred." };
  }
};

export const patchDataLatest = async (url, data = null) => {
  try {
    const isFormData = data instanceof FormData;
    const headers = isFormData
      ? {}
      : data
      ? { "Content-Type": "application/json" }
      : {};
    const body = isFormData ? data : data ? JSON.stringify(data) : undefined;

    const response = await fetch(apiUrl + url, {
      method: "PATCH",
      headers,
      body,
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log("Patch Response:", responseData);
      return responseData;
    } else {
      const errorData = await response.json();
      console.log("Patch Error response:", errorData);
      return errorData;
    }
  } catch (error) {
    console.error("patchData error:", error);
    throw error;
  }
};

export const patchData = async (url) => {
  try {
    const response = await fetch(apiUrl + url, {
      method: "PATCH",
    });
    if (response.ok) {
      const data = await response.json();
      console.log("Patch Response:", data);
      return data;
    } else {
      const errorData = await response.json();
      console.log("Patch Error response:", errorData);
      return errorData;
    }
  } catch (error) {
    console.error("patchData error:", error);
    throw error;
  }
};

export const fetchDataFromApi = async (url) => {
  try {
    const params = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Include your API key in the Authorization header
        "Content-Type": "application/json", // Adjust the content type as needed
      },
    };

    const { data } = await axios.get(apiUrl + url, params);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const uploadImage = async (url, updatedData) => {
  const params = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Include your API key in the Authorization header
      "Content-Type": "multipart/form-data", // Adjust the content type as needed
    },
  };

  var response;
  await axios.put(apiUrl + url, updatedData, params).then((res) => {
    response = res;
  });
  return response;
};

export const uploadImages = async (url, formData) => {
  const params = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Include your API key in the Authorization header
      "Content-Type": "multipart/form-data", // Adjust the content type as needed
    },
  };

  var response;
  await axios.post(apiUrl + url, formData, params).then((res) => {
    response = res;
  });
  return response;
};

export const editDataCommon = async (url, updatedData) => {
  try {
    const response = await axios.put(`${apiUrl}${url}`, updatedData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    });
    return response.data; // Return the actual data from Axios response
  } catch (error) {
    console.error("Edit API error:", error);
    throw error.response?.data || error; // Throw the error response or error object
  }
};

export const editData = async (url, updatedData) => {
  const params = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Include your API key in the Authorization header
      "Content-Type": "application/json", // Adjust the content type as needed
    },
  };

  var response;
  await axios.put(apiUrl + url, updatedData, params).then((res) => {
    response = res;
  });
  return response;
};

export const deleteImages = async (url, image) => {
  const params = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Include your API key in the Authorization header
      "Content-Type": "application/json", // Adjust the content type as needed
    },
  };
  const { res } = await axios.delete(apiUrl + url, params);
  return res;
};

export const deleteData = async (url) => {
  const params = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Include your API key in the Authorization header
      "Content-Type": "application/json", // Adjust the content type as needed
    },
  };
  const { res } = await axios.delete(apiUrl + url, params);
  return res;
};

export const deleteDataCommon = async (url) => {
  try {
    const response = await fetch(`${apiUrl}${url}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Adjust if using auth
      },
    });
    const data = await response.json(); // Parse the JSON response
    return data; // Return the parsed data
  } catch (error) {
    console.error("Delete API error:", error);
    throw error; // Re-throw to be caught in .catch()
  }
};

export const deleteMultipleData = async (url, data) => {
  const params = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Include your API key in the Authorization header
      "Content-Type": "application/json", // Adjust the content type as needed
    },
  };
  const { res } = await axios.delete(apiUrl + url, data, params);
  return res;
};
