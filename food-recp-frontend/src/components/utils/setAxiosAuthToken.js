import axios from "axios";
import Axios from "./Axios";

const setAxiosAuthToken = (jwtToken) => {
  if (jwtToken) {
    Axios.defaults.headers.common["Authorization"] = `Bearer ${jwtToken}`;
  } else {
    delete Axios.defaults.headers.common["Authorization"];
  }
};

export default setAxiosAuthToken;
