import axios from "axios";
import { BaseUrl } from "./BaseUrl";
import {getStoreUser, removeStoreUser} from ".././localStorage/userStore";
import { useEffect } from "react";
const Request = async (path = "", method = "GET", data = {}) => {
  const token = getStoreUser();
  const token_client = "";
  let headers = {};
  try {
    if (data instanceof FormData) {
      headers = {
        Authorization: token
          ? `Bearer ${token}`
          : token_client
            ? `Bearer ${token_client}`
            : "",
      };
    } else {
      headers = {
        "Content-Type": "application/json",
        Authorization: token
          ? `Bearer ${token}`
          : token_client
            ? `Bearer ${token_client}`
            : "",
      };
    }

    const res = await axios({
      method,
      url: BaseUrl + path,
      data,
      headers,
    });
    // Axios normally throws automatically for 4xx/5xx,
    // so this handles successful responses.
    if (res.data?.status === "error") {
      throw new Error(res.data.message);
    }


    if (res.data?.status === "fail") {
      throw new Error(res.data.message);
    }

    return res.data;
  } catch (error) {
    console.error("Request Error:", error);

    if (error?.response?.status === 401) {
         removeStoreUser();

          window.location.href = "/login";

      throw new Error("Unauthorized. Please login again.");
    }

    throw error;
  }
};

export default Request;
