import axios from "axios";
import {BaseUrl} from "./BaseUrl";

const request = async (path = "", method = "GET", data = {}) => {
  const token = "";
  const token_client = "";
  let headers = {};
  try {
    if (data instanceof FormData) {
      // ✅ For FormData, don't set Content-Type manually
      // Let axios handle it with the boundary parameter
      headers = {
        Authorization: token ? "Bearer " + token : "",
      };
    } else {
      headers = {
        "Content-Type": "application/json",
        Authorization: token
          ? "Bearer " + token
          : token_client
            ? "Bearer " + token_client
            : "",
      };
    }
    const res = await axios({
      method,
      url: BaseUrl + path,
      data,
      headers,
    });

    const statusCode = res.status;

    if (statusCode === 401) {
      // 🔴 Unauthorized case

      window.location.href = "/login"; // redirect user
      throw new Error("Unauthorized. Please login again.");
    }

    if (statusCode < 200 || statusCode >= 300) {
      throw new Error(`Request failed with status code ${statusCode}`);
    }

    if (res.data.status === "error") {
      throw new Error(res.data.message);
    }

    if (res.data.status === "fail") {
      throw new Error(res.data.message);
    }

    if (res.data.status === "success") {
      return res.data;
    }

    return res.data;
  } catch (error) {
    console.log(error);

    // 🔴 handle axios error response (important for 401 from server)
    if (error?.response?.status === 401) {
      window.location.href = "/login";
      throw new Error("Unauthorized. Please login again.");
    }

    throw error;
  }
};

export default request;
