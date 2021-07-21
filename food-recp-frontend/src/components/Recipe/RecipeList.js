import React from "react";
import { Link } from "react-router-dom";

function RecipeList(props) {
  console.log(props)
  return props.recipeArray.map((item) => {
    console.log('recipelist:',item.id)
    return (
      <div
        key={item.image}
        style={{ width: 100, height: 100, marginRight: 25, marginBottom: 100 }}
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
              <li>Recipe: {item.title}</li>
              <li>Servings: {item.servings} </li>
            </ul>
            
          </div>
        </Link>
      </div>
    );
  });
}

export default RecipeList;
