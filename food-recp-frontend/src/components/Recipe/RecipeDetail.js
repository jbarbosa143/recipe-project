import React, { Component } from "react";
import axios from "axios";
import Axios from "../utils/Axios";

export class RecipeDetail extends Component {
  state = {
    title: "",
    dishTypes: "",
    extendedIngredients: "",
    readInMinutes: "",
    spoontacularScore: "",
    aggregateLikes: [],
    image: "",
    isLoading: true,
    telInput: "",
    textareaIput: "",
    friendsArray: [],
    selectedFriendFirstName: "",
    selectedFriendLastName: "",
    selectedFriendID: "",
    selectedFriendMobileNumber: "",
    friendMessage: "",
    originalMessage: "",
  };

  async componentDidMount() {
    this.fetchRecipe();
    this.fetchAllFriends();
  }

  fetchAllFriends = async () => {
    try {
      let allFriends = await Axios.get("/api/friend/get-all-friends");

      this.setState({
        friendsArray: allFriends.data.friends,
      });
    } catch (e) {
      console.log(e);
    }
  };

  fetchRecipe = async () => {
    console.log('RecipeDetails:',this.props.match.params.recipeName)
    try {
      
      let result = await axios.get(
        `https://api.spoonacular.com/recipes/${this.props.match.params.recipeName}/information&?apiKey=${process.env.REACT_APP_COOKING_API}`
      );

      this.setState(
        {
            aggregateLikes: result.data.aggregateLikes,
            extendedIngredients: result.data.extendedIngredients,
            dishTypes: result.data.dishTypes,
            readInMinutes: result.data.readInMinutes,
            servings: result.data.servings,
            spoontacularScore: result.data.spoontacularScore,
            Ratings: result.data.Ratings,
            title: result.data.title,
            image: result.data.image,
            isLoading: false,
        },
        () => {
          this.setState({
            friendMessage: `I think this Dish is delicious. ${this.state.title}`,
          });
        }
      );
    } catch (e) {
      console.log(e);
    }
  };

  showRecipeDetail = () => {
    return (
      <div style={{ display: "flex" }}>
        <div>
          <img src={this.state.image} alt={this.state.title} />
        </div>
        <div>
        <div>Serving Size: {this.state.servings}</div>  
          <div>Ready in: {this.state.readInMinutes} Minutes</div>
          <div>Dish Type: {this.state.dishTypes}</div>
          <div>Likes: {this.state.aggregateLikes}</div>
          <div>Rated: {this.state.spoontacularScore}</div>
          <div>
            Ratings:{" "}
            {this.state.Ratings.map((item) => {
              return (
                <span key={item.Source}>
                  {item.Source} {item.Value}
                </span>
              );
            })}
          </div>
          <div>Recipe/Prep: {this.state.extendedIngredients}</div>
        </div>
      </div>
    );
  };

  handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      let message = this.state.friendMessage;

      let result = await Axios.post("/api/twilio/send-sms", {
        to: this.state.selectedFriendMobileNumber,
        message: message,
      });

      console.log(result);
    } catch (e) {
      console.log(e.response);
    }
  };

  handleSelectChange = (event) => {
    // console.log(JSON.parse(event.target.value));
    // console.log(event.target.value);

    let selectedUser = JSON.parse(event.target.value);

    this.setState({
      selectedFriendFirstName: selectedUser.firstName,
      selectedFriendLastName: selectedUser.lastName,
      selectedFriendID: selectedUser._id,
      selectedFriendMobileNumber: selectedUser.mobileNumber,
      friendMessage: `Hey ${selectedUser.firstName}, ${this.state.originalMessage}`,
    });
  };

  render() {
    console.log(this.state);
    return (
      <div>
        {this.state.isLoading ? (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            ...Loading
          </div>
        ) : (
          <div>
            {this.showRecipeDetail()}

            <div style={{ width: 250, margin: "0 auto", textAlign: "center" }}>
              <select onChange={this.handleSelectChange}>
                <option>Select a friend</option>
                {this.state.friendsArray.map((friend) => {
                  return (
                    <option key={friend._id} value={JSON.stringify(friend)}>
                      {friend.firstName} {friend.lastName}
                    </option>
                  );
                })}
              </select>
              <textarea
                col="50"
                rows="20"
                defaultValue={this.state.friendMessage}
              />
              <br />
              <button onClick={this.handleFormSubmit}>Submit</button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default RecipeDetail;