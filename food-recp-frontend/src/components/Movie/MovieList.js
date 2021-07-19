import React from "react";
import { Link } from "react-router-dom";
function MovieList(props) {
  return props.movieArray.map((item) => {
    return (
      <div
        key={item.imdbID}
        style={{ width: 100, height: 100, marginRight: 25, marginBottom: 100 }}
      >
        <Link
          to={{
            pathname: `/movie-detail/${item.Title}`,
            //search: `?t=${item.Title}`, //?minPrice=20&maxPrice=59&color=white&size=10
          }}
        >
          <div>
            <img src={item.Poster} alt={item.Title} />
          </div>
          <div>
            Title: {item.Title}
            Year: {item.Year}
          </div>
        </Link>
      </div>
    );
  });
}

export default MovieList;
