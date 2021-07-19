import React, { Component } from "react";

import UpdateProfile from "./UpdateProfile";

import "./Profile.css";

function Profile({ handleUserLogout, history }) {
  return (
    <UpdateProfile handleUserLogout={handleUserLogout} history={history} />
  );
}

export default Profile;
