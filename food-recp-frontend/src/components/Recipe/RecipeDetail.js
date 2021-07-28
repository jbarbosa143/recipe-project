import React, { Component } from "react";
import axios from "axios";
import Axios from "../utils/Axios";
import "./RecipeDetails.css";

export class RecipeDetail extends Component {
  state = {
    title: "",
    dishTypes: "",
    servings: "",
    aggregateLikes: [],
    extendedIngredients:"",
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
    // console.log('RecipeDetails:',this.props.match)
    // console.log('fetching id:',this.props.match.params.recipeName)
    try {
      
      let result = await axios.get(
        `https://api.spoonacular.com/recipes/${this.props.match.params.recipeName}/information?apiKey=${process.env.REACT_APP_COOKING_API}`
      );

      this.setState(
        {
            aggregateLikes: result.data.aggregateLikes,
            ingredients: result.data.extendedIngredients,
            dishTypes: result.data.dishTypes,
            servings: result.data.servings,
            title: result.data.title,
            image: result.data.image,
            isLoading: false,
        },
        () => {
          this.setState({
            
            friendMessage: `Hey !! I think this ${this.state.title}Dish is delicious. If this Dish looks good to you give it a try!` 
          });
        }
      );
    } catch (e) {
      console.log(e);
    }
  };

  showRecipeDetail = () => {
    // console.log('thisState:',this.state.dishTypes)
    // console.log('Ingrediants:',this.state.ingredients)
    return (
      <div  style={{ display: "flex", height:'auto', width:'auto' }}>
        <div style={{height:'auto', width:'auto'}}>
          <img src={this.state.image} alt={this.state.title} />
        </div>
        <div className='ingedentContain'>
        <div>Serving Size: {this.state.servings}</div>  
          <div>Dish Type: {this.state.dishTypes + ","}</div> 
          <div>Likes: {this.state.aggregateLikes}</div> 
          <div><p>Ingredients/Recipe: </p>{this.state.ingredients.map((item)=>{
            // console.log(item)
            return (
              <div className='items'>
                <ul className="ingrediantsItems">
                  <li>*{item.nameClean} - </li>
                  <ul>
                    <li>{item.original}</li>
                  </ul>
                </ul>
              </div>
            )
          })}</div>
          
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
      friendMessage: `Hey ${selectedUser.firstName}, ${this.state.friendMessage}`,
    });
  };

  render() {
    // console.log(this.state);
    return (
      <div className="detailContainer">
        {this.state.isLoading ? (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            ...Loading
          </div>
        ) : (
          <div>
            {this.showRecipeDetail()}

            <div className='detailCon' style={{ width: 250, margin: "0 auto", textAlign: "center" }}>
              <select onChange={this.handleSelectChange}>
                <option>Select a friend</option>
                {this.state.friendsArray.map((friend) => {
                  return (
                    <option key={friend._id} value={JSON.stringify(friend)}>
                      {friend.firstName},{friend.lastName}
                    </option>
                  );
                })}
              </select >
              <textarea style={{ width: 250, height:200,margin: "0 auto", textAlign: "center" }}
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