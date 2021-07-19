import React, { Component } from "react";
import FriendList from "./FriendList";

export class Friend extends Component {
  render() {
    return (
      <div className="update-container">
        <table id="friends">
          <thead>
            <tr id="tr">
              <th>first name</th>
              <th>last name</th>
              <th>mobile number</th>
              <th>edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {this.props.friendArray.map((friend) => {
              return (
                <FriendList
                  handleUpdatedFriendData={this.props.handleUpdatedFriendData}
                  handleDeleteByFriend={this.props.handleDeleteByFriend}
                  key={friend._id}
                  friend={friend}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Friend;
