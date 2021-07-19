import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import MovieList from "./MovieList";

export class Movie extends Component {
  state = {
    movie: "",
    movieArray: [],
    movieArray2: [],
    movieArray3: [],
    totalCount: 0,
    totalPage: 0,
    perPage: 10,
    currentPage: 1,
    maxPageLimit: 10,
    minPageLimit: 0,
    pageArray: [],
  };

  // async componentDidMount() {
  //   //console.log(this.props.location.search);

  //   //Big trouble and little china
  //   //the simpsons
  //   //Rush hour
  //   //the godfather
  //   //Luca
  //   //Pulp Fiction
  //   //The Matrix
  //   let randomMovieArray = [
  //     "Big trouble in little china",
  //     "the simpsons",
  //     "Rush hour",
  //     "the godfather",
  //     "Luca",
  //     "Pulp Fiction",
  //     "The Matrix",
  //   ];

  //   let randomSelectedMovieIndex = Math.floor(
  //     Math.random() * randomMovieArray.length
  //   );

  //   try {
  //     let randomMovieData = await axios.get(
  //       `https://omdbapi.com/?apikey=${process.env.REACT_APP_MOVIE_API}&s=${randomMovieArray[randomSelectedMovieIndex]}`
  //     );

  //     this.setState({
  //       movieArray: randomMovieData.data.Search,
  //     });
  //   } catch (e) {
  //     console.log(e);
  //   }

  //   try {
  //     let searchedMovieTitle =
  //       window.sessionStorage.getItem("searchedMovieTitle");

  //     if (searchedMovieTitle) {
  //       let result = await axios.get(
  //         `https://omdbapi.com/?apikey=${process.env.REACT_APP_MOVIE_API}&s=${searchedMovieTitle}`
  //       );

  //       this.setState({
  //         movieArray: result.data.Search,
  //       });
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

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
      let searchedMovieTitleSessionStorage =
        window.sessionStorage.getItem("searchedMovieTitle");

      if (searchedMovieTitleSessionStorage) {
        let result = await this.handleSearchMovie(
          searchedMovieTitleSessionStorage
        );

        let totalPageArray = this.getTotalPages(
          +result.data.totalResults,
          this.state.perPage
        );

        this.setState({
          movie: searchedMovieTitleSessionStorage,
          movieArray: result.data.Search,
          totalPage: +result.data.totalResults, //in batman result is 440
          pageArray: totalPageArray,
        });
      } else {
        let randomMovieTitle = this.handleRandomTitle();
        //let result = await this.handleSearchMovie(randomMovieTitle);
        let result = await this.handleSearchMovie(randomMovieTitle);

        let totalPageArray = this.getTotalPages(
          +result.data.totalResults,
          this.state.perPage
        );

        this.setState({
          movie: randomMovieTitle,
          movieArray: result.data.Search,
          totalPage: +result.data.totalResults, //in batman result is 440
          pageArray: totalPageArray, //[1,2,3,4...] all the way up to 440
        });

        // let randomMovieTitle = this.handleRandomTitle();

        // let result = this.handleSearchMovie(randomMovieTitle);

        // let result2 = this.handleSearchMovie("batman");
        // let result3 = this.handleSearchMovie("the matrix");

        // let getAllPromiseMovies = Promise.all([result, result2, result3]);

        // let resolvedMovie = await getAllPromiseMovies;

        // console.log(resolvedMovie);

        // this.setState({
        //   movieArray: resolvedMovie[0].data.Search,
        //   movieArray2: resolvedMovie[1].data.Search,
        //   movieArray3: resolvedMovie[2].data.Search,
        // });
      }
    } catch (e) {}
  }

  handleRandomTitle = () => {
    let randomMovieArray = [
      "Big trouble in little china",
      "the simpsons",
      "Rush hour",
      "the godfather",
      "Luca",
      "Pulp Fiction",
      "The Matrix",
    ];
    let randomSelectedMovieIndex = Math.floor(
      Math.random() * randomMovieArray.length
    );
    return randomMovieArray[randomSelectedMovieIndex];
  };

  handleSearchMovie = async (movieTitle) => {
    try {
      let randomMovieData = await axios.get(
        `https://omdbapi.com/?apikey=${process.env.REACT_APP_MOVIE_API}&s=${movieTitle}&page=${this.state.currentPage}`
      );

      return randomMovieData;
    } catch (e) {
      return e;
    }
  };

  handleOnChange = (event) => {
    this.setState({
      movie: event.target.value,
    });
  };

  onSubmit = async (event) => {
    try {
      let result = await this.handleSearchMovie(this.state.movie);

      window.sessionStorage.setItem("searchedMovieTitle", this.state.movie);

      let totalPageArray = this.getTotalPages(
        +result.data.totalResults,
        this.state.perPage
      );

      console.log(result);

      this.setState({
        movieArray: result.data.Search,
        totalPage: +result.data.totalResults,
        pageArray: totalPageArray,
      });
    } catch (e) {
      console.log(e);
    }
  };

  // showMovieList = () => {
  //   return this.state.movieArray.map((item) => {
  //     return (
  //       <div
  //         key={item.imdbID}
  //         style={{ width: 300, height: 300, marginRight: 25 }}
  //       >
  //         <Link
  //           to={{
  //             pathname: `/movie-detail/${item.Title}`,
  //             //search: `?t=${item.Title}`, //?minPrice=20&maxPrice=59&color=white&size=10
  //           }}
  //         >
  //           <div>
  //             <img src={item.Poster} alt={item.Title} />
  //           </div>
  //           <div>
  //             Title: {item.Title}
  //             Year: {item.Year}
  //           </div>
  //         </Link>
  //       </div>
  //     );
  //   });
  // };

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
            //[1,2,3,.....440]
            // console.log(number < maxPageLimit + 1 && number > minPageLimit);
            // console.log("number: ", number);
            // console.log("maxPageLimit + 1", maxPageLimit);

            // 1 < 21 && 1 > 10
            //11 < 21 && 11 > 10
            //12 < 21 && 12 > 10
            //maxPageLimit + 1 = 31 minPageLimit 20
            //1 < 31 && 1 > 20
            //21 < 31 && 21 > 20
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
        console.log(this.state.movie);
        let result = await this.handleSearchMovie(this.state.movie);

        console.log(result);

        this.setState({
          movieArray: result.data.Search,
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
        let movie = "";

        let searchedMovieTitleSessionStorage =
          window.sessionStorage.getItem("searchedMovieTitle");

        movie = searchedMovieTitleSessionStorage
          ? window.sessionStorage.getItem("searchedMovieTitle")
          : this.state.movie;

        let result = await this.handleSearchMovie(movie);

        this.setState({
          movieArray: result.data.Search,
        });
      }
    );
    // console.log(this.state.currentPage + 1 > this.state.maxPageLimit);
    // console.log(this.state.currentPage + 1);
    // console.log(this.state.maxPageLimit);
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
        let movie = "";

        let searchedMovieTitleSessionStorage =
          window.sessionStorage.getItem("searchedMovieTitle");

        movie = searchedMovieTitleSessionStorage
          ? window.sessionStorage.getItem("searchedMovieTitle")
          : this.state.movie;

        let result = await this.handleSearchMovie(movie);

        this.setState({
          movieArray: result.data.Search,
        });
      }
    );
    //0 % 10
    //11 - 1 = 10
    //10 % 10 === 0
    //20 - 10 = 10
    //0
    console.log(this.state);
    console.log((this.state.currentPage - 1) % this.state.perPage);
    //maxPageLimit = 20
    //minPageLimit = 10
    //maxPageLimit - 10
    //10 - 10
    //1 % 10
    if ((this.state.currentPage - 1) % this.state.perPage === 0) {
      this.setState({
        maxPageLimit: this.state.maxPageLimit - this.state.perPage,
        minPageLimit: this.state.minPageLimit - this.state.perPage,
      });
    }
  };

  render() {
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

          <h3>Coolest Movie</h3>
          <MovieList movieArray={this.state.movieArray} />
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

        {/* <div
          style={{
            width: 1200,
            margin: "0 auto",
            textAlign: "center",
            marginTop: "50px",
            display: "flex",
          }}
        >
          <h3>Latest Movie</h3>
          <MovieList movieArray={this.state.movieArray} />
        </div> */}
        {/* <div
          style={{
            width: 1200,
            margin: "0 auto",
            textAlign: "center",
            marginTop: "50px",
            display: "flex",
          }}
        >
          <h3>Fans favorite</h3>
          <MovieList movieArray={this.state.movieArray} />
        </div> */}
      </div>
    );
  }
}

export default Movie;
