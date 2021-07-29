import React from "react";
import { Link } from "react-router-dom";
import "./RecipeList.css";

function RecipeList(props) {
  // console.log(props)
  return props.recipeArray.map((item) => {
    // console.log('recipelist:',item.id)
    return (
      <div className="foods"
        key={item.image}
        style={{ width: 100, height: 100, marginRight: 10, marginBottom: 100 }}
      >
        <Link
          to={{
            pathname: `/recipe-detail/${item.id}`,
            //search: `?t=${item.Title}`, //?minPrice=20&maxPrice=59&color=white&size=10
          }}
        >
          <div>
            <img src={item.image} alt={item.title} />
          </div>
          <div>
            <ul>
              <li>Recipe: {item.title} </li>
              {/* <hr></hr> */}
              <li>Servings: {item.servings}  </li>
            </ul>
            
          </div>
        </Link>
      </div>
    );
  });
}

export default RecipeList;
