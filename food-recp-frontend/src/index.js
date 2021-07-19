import React from "react";
import ReactDOM from "react-dom";

import "react-toastify/dist/ReactToastify.css";

import App from "./App";

import "./_base.css";
import "./index.css";
console.log(process.env.NODE_ENV);
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
