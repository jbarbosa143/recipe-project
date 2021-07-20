import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import RecipeList from "./RecipeList";

export class Recipe extends Component {
  state = {
    recipe: "",
    recipeArray: [],
    recipeArray2: [],
    recipeArray3: [],
    totalCount: 0,
    totalPage: 0,
    perPage: 10,
    currentPage: 1,
    maxPageLimit: 10,
    minPageLimit: 0,
    pageArray: [],
  };

  getTotalPages = (totalResults, perPage) => {
    let pages = [];

    for (let i = 1; i <= Math.ceil(totalResults / perPage); i++) {
      pages.push(i);
    }

    return pages;
  };

  async componentDidMount() {
    try {
      //check for session storage
      let searchedRecipeNameSessionStorage =
        window.sessionStorage.getItem("searchedRecipeName");

      if (searchedRecipeNameSessionStorage) {
        let result = await this.handleSearchRecipe(
          searchedRecipeNameSessionStorage
        );

        let totalPageArray = this.getTotalPages(
          +result.data.totalResults,
          this.state.perPage
        );

        this.setState({
          recipe: searchedRecipeNameSessionStorage,
          recipeArray: result.data.Search,
          totalPage: +result.data.totalResults, 
          pageArray: totalPageArray,
        });
      } else {
        let results = await this.handleRandomRecipes();
        this.setState({
          recipeArray: results.data.recipes
        });
        let randomRecipeName = this.handleRandomRecipe();
        let result = await this.handleSearchRecipe(randomRecipeName);
        console.log('result:',result)
        let totalPageArray = this.getTotalPages(
          +result.data.totalResults,
          this.state.perPage
        );

        this.setState({
          recipe: randomRecipeName,
          recipeArray2: result.data.Search,
          totalPage: +result.data.totalResults, 
          pageArray: totalPageArray, 
        });
      }
    } catch (e) {}
  }

  handleRandomRecipe = () => {
    let randomRecipeArray = [
      "Berry Banana Breakfast Smoothie",
      "Homemade Garlic and Basil French Fries",
      "Chicken Tortilla Soup (Slow Cooker)",
      "Cauliflower, Brown Rice, and Vegetable Fried Ricer",
      "Slow Cooker Beef Stew",
      "Broccoli and Chickpea Rice Salad",
      "Red Kidney Bean Jambalaya",
    ];
    let randomSelectedRecipeIndex = Math.floor(
      Math.random() * randomRecipeArray.length
    );
    return randomRecipeArray[randomSelectedRecipeIndex];
  };

  handleSearchRecipe = async (recipeName) => {
    try {
      //https://api.spoonacular.com/recipes/random?number=1&tags=vegetarian,dessert
      let randomRecipeData = await axios.get(
        `https://api.spoonacular.com/recipes/complexSearch?&apiKey=${process.env.REACT_APP_COOKING_API}`
      );

      return randomRecipeData;
    } catch (e) {
      return e;
    }
  };

  handleRandomRecipes = async ()=>{
    try{
      let results = await axios.get(`https://api.spoonacular.com/recipes/random?number=10&tags=vegetarian,desert&apiKey=${process.env.REACT_APP_COOKING_API}`);
      console.log(results)
      return results;
    }catch (e) {
      return e;
    }
  };

  handleOnChange = (event) => {
    this.setState({
      recipe: event.target.value,
    });
  };

  onSubmit = async (event) => {
    try {
      let result = await this.handleSearchRecipe(this.state.recipe);

      window.sessionStorage.setItem("searchedRecipeName", this.state.recipe);

      let totalPageArray = this.getTotalPages(
        +result.data.totalResults,
        this.state.perPage
      );

      console.log(result);

      this.setState({
        recipeArray: result.data.Search,
        totalPage: +result.data.totalResults,
        pageArray: totalPageArray,
      });
    } catch (e) {
      console.log(e);
    }
  };

  showpagination = () => {
    let totalPages = this.state.totalPage; //440
    let perPage = this.state.perPage; //10
    let currentPage = this.state.currentPage; //1
    let maxPageLimit = this.state.maxPageLimit; // 10
    let minPageLimit = this.state.minPageLimit; // 0

    const buildPagination = () => {
      return (
        <>
          {this.state.pageArray.map((number) => {
            if (number < maxPageLimit + 1 && number > minPageLimit) {
              return (
                <span
                  onClick={() => this.handleGoToPage(number)}
                  style={{
                    marginLeft: 15,
                    marginRight: 15,
                    color: currentPage === number ? "red" : "black",
                    cursor: "pointer",
                  }}
                  key={number}
                >
                  {number}
                </span>
              );
            }
          })}
        </>
      );
    };

    return (
      <div>
        <ul>{buildPagination()}</ul>
      </div>
    );
  };

  handleGoToPage = (number) => {
    this.setState(
      {
        currentPage: number,
      },
      async () => {
        console.log(this.state.recipe);
        let result = await this.handleSearchRecipe(this.state.recipe);

        console.log(result);

        this.setState({
          recipeArray: result.data.Search,
        });
      }
    );
  };

  nextPage = () => {
    this.setState(
      (prevState) => {
        return {
          ...prevState,
          currentPage: prevState.currentPage + 1,
        };
      },
      async () => {
        let recipe = "";

        let searchedRecipeNameSessionStorage =
          window.sessionStorage.getItem("searchedRecipeName");

        recipe = searchedRecipeNameSessionStorage
          ? window.sessionStorage.getItem("searchedRecipeName")
          : this.state.recipe;

        let result = await this.handleSearchRecipe(recipe);

        this.setState({
          recipeArray: result.data.Search,
        });
      }
    );

    if (this.state.currentPage + 1 > this.state.maxPageLimit) {
      this.setState(
        {
          maxPageLimit: this.state.maxPageLimit + this.state.perPage,
          minPageLimit: this.state.minPageLimit + this.state.perPage,
        },
        () => {
          //console.log(this.state);
        }
      );
    }
  };

  prevPage = () => {
    this.setState(
      (prevState) => {
        return {
          ...prevState,
          currentPage: prevState.currentPage - 1,
        };
      },
        async () => {
        let recipe = "";

        let searchedRecipeNameSessionStorage =
            window.sessionStorage.getItem("searchedRecipeName");

        recipe = searchedRecipeNameSessionStorage
            ? window.sessionStorage.getItem("searchedRecipeName")
            : this.state.recipe;

        let result = await this.handleSearchRecipe(recipe);

        this.setState({
            recipeArray: result.data.Search,
        });
    }
    );
    console.log(this.state);
    console.log((this.state.currentPage - 1) % this.state.perPage);
    if ((this.state.currentPage - 1) % this.state.perPage === 0) {
        this.setState({
        maxPageLimit: this.state.maxPageLimit - this.state.perPage,
        minPageLimit: this.state.minPageLimit - this.state.perPage,
        });
    }
    };

    render() {
      console.log(this.state.recipeArray)
    return (
        <div>
        <div
            style={{
            width: 500,
            margin: "0 auto",
            textAlign: "center",
            marginTop: "50px",
            }}
        >
            <input
            type="text"
            placeholder="Search something..."
            name="movie"
            onChange={this.handleOnChange}
            />
            <button onClick={this.onSubmit}>Search</button>
        </div>

        <div
            style={{
            width: 1200,
            margin: "0 auto",
            textAlign: "center",
            marginTop: "50px",
            display: "flex",
            }}
        >
          {/* {this.showMovieList()} */}

            <h3>Recipes</h3>
            <RecipeList recipeArray={this.state.recipeArray} />
        </div>

        {this.state.totalPage <= 10 ? (
            ""
        ) : (
            <div
            style={{
                width: 1200,
                margin: "0 auto",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 50,
            }}
            >
            <button
                disabled={this.state.currentPage === 1 ? true : false}
                onClick={this.prevPage}
            >
                Prev
            </button>

            {this.showpagination()}

            <button
                disabled={
                this.state.currentPage ===
                this.state.pageArray[this.state.pageArray.length - 1]
                    ? true
                    : false
                }
                onClick={this.nextPage}
            >
                Next
            </button>
            </div>
        )}

        
        </div>
    );
    }
}

export default Recipe;