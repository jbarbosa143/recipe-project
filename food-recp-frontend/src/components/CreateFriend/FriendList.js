import React, { Component } from "react";
import { toast } from "react-toastify";
import Axios from "../utils/Axios";

export class FriendList extends Component {
  state = {
    toggle: false,
    firstName: "",
    lastName: "",
    mobileNumber: "",
  };

  handleToggle = () => {
    this.setState((prevState) => {
      return {
        toggle: !prevState.toggle,
      };
    });
  };

  handleUpdateFriendChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleUpdateClick = async (id) => {
    try {
      let updatedFriend = await Axios.put(
        `/api/friend/update-friend-by-id/${id}`,
        {
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          mobileNumber: this.state.mobileNumber,
        }
      );

      this.props.handleUpdatedFriendData(updatedFriend.data.payload);
      this.handleToggle();
    } catch (e) {
      toast.error(e.response.data.payload);
    }
  };

  handleDeleteClick = async (id) => {
    try {
      let deletedFriend = await Axios.delete(
        `/api/friend/delete-friend-by-id/${id}`
      );

      console.log(deletedFriend);

      this.props.handleDeleteByFriend(deletedFriend.data.payload);
    } catch (e) {
      toast.error(e.response.data.payload);
    }
  };

  render() {
    const { friend } = this.props;
    const { toggle } = this.state;
    return (
      <tr key={friend._id}>
        {toggle ? (
          <>
            <td>
              <input
                name="firstName"
                onChange={this.handleUpdateFriendChange}
                defaultValue={friend.firstName}
              />
            </td>
            <td>
              <input
                name="lastName"
                onChange={this.handleUpdateFriendChange}
                defaultValue={friend.lastName}
              />
            </td>
            <td>
              <input
                name="mobileNumber"
                onChange={this.handleUpdateFriendChange}
                defaultValue={friend.mobileNumber}
              />
            </td>
          </>
        ) : (
          <>
            <td>{friend.firstName} </td>
            <td>{friend.lastName} </td>
            <td>{friend.mobileNumber}</td>
          </>
        )}

        {toggle ? (
          <td onClick={() => this.handleUpdateClick(friend._id)}>update</td>
        ) : (
          <td onClick={this.handleToggle}>Edit</td>
        )}

        <td onClick={() => this.handleDeleteClick(friend._id)}>Delete</td>
      </tr>
    );
  }
}

export default FriendList;
