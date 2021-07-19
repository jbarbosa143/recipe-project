import React, { Component } from "react";
import { toast } from "react-toastify";

import Axios from "../utils/Axios";

export class UpdateProfile extends Component {
  state = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
  };

  componentDidMount() {
    this.handleFetchUserInfo();
  }

  handleFetchUserInfo = async () => {
    try {
      let fetchedUserInfo = await Axios.get("/api/user/get-user-info");

      this.setState({
        firstName: fetchedUserInfo.data.payload.firstName,
        lastName: fetchedUserInfo.data.payload.lastName,
        username: fetchedUserInfo.data.payload.username,
        email: fetchedUserInfo.data.payload.email,
      });
    } catch (e) {
      toast.error(e.response.data.payload);
    }
  };

  handleUserInputOnChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleUserUpdateSubmit = async (event) => {
    event.preventDefault();

    try {
      let updatedUserProfile = await Axios.put(
        "/api/user/update-user-profile",
        {
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          username: this.state.username,
          password: this.state.password,
        }
      );

      if (updatedUserProfile.status === 202) {
        console.log(this.props);
        this.props.handleUserLogout();
        this.props.history.push("/login");
      } else {
        this.setState({
          firstName: updatedUserProfile.data.payload.firstName,
          lastName: updatedUserProfile.data.payload.lastName,
          username: updatedUserProfile.data.payload.username,
        });
      }

      toast.success("Profile Updated");
    } catch (e) {
      toast.error(e.response.data.payload);
    }
  };

  render() {
    return (
      <div className="update-container">
        <h3>Update Profile</h3>
        <form onSubmit={this.handleUserUpdateSubmit}>
          <div className="input-div">
            <input
              placeholder="first name"
              value={this.state.firstName}
              name="firstName"
              onChange={this.handleUserInputOnChange}
            />
          </div>

          <div className="input-div">
            <input
              placeholder="last name"
              value={this.state.lastName}
              name="lastName"
              onChange={this.handleUserInputOnChange}
            />
          </div>

          <div className="input-div">
            <input
              placeholder="username"
              value={this.state.username}
              name="username"
              onChange={this.handleUserInputOnChange}
            />
          </div>

          <div className="input-div">
            <input
              placeholder="email"
              defaultValue={this.state.email}
              disabled={true}
            />
          </div>

          <div className="input-div">
            <input
              placeholder="password"
              name="password"
              onChange={this.handleUserInputOnChange}
            />
          </div>
          <div className="button-div">
            <button>Update</button>
          </div>
        </form>
      </div>
    );
  }
}

export default UpdateProfile;
