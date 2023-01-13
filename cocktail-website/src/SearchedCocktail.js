import React from 'react'
import './CocktailDetails.css'
import './SearchedCocktail.css'
import {useLocation} from "react-router-dom";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom';

export default function RandomCocktail(props) {
    let location = useLocation();
    const cocktail=location.state.cocktail
    const ingredientsObject={};
    const portionsArray=[]
    const navigate = useNavigate();

    //returns all keys that have strMeasure e.g strMeasure1 
    const portionsKey=Object.keys(cocktail).filter((string)=>{
        return string.includes('strMeasure') && cocktail[string]!=null
    })

    const portionsList=portionsKey.map((item, i, arr)=>{
        //cocktail[strMeasure1]= 1/2 tsp something like that
            return cocktail[item];
        }
    )

    //push all measurements e.g. 1tsp, 2tbp.... onto protionsArray that is []
    portionsList.forEach((key)=>{
        portionsArray.push(key);
    })

    const ingredientsKey=Object.keys(cocktail).filter((string)=>{
        return string.includes('strIngredient') && cocktail[string]!=null
    })
    
    //returns ingredients e.g. Vodka, Gin, Triplesec
    const ingredientsList = ingredientsKey.map((item, i, arr) => {
      return cocktail[item];
    });

    //creates object, {vodka: 1tsp} and so on
    ingredientsList.forEach((key,i)=>{
        if (portionsArray[i]===undefined){
            ingredientsObject[key]='';

        }else{
            ingredientsObject[key]=portionsArray[i]
        }
    })

    function clickedBack(){
        if(location.state.prevPath ==='/all' && location.state.search){
            navigate('/all',{state:{filteredCocktails: location.state.filteredCocktails, search:location.state.search}});
        }else{
            navigate('/');
        }
    }


    return (
      <>
        <button onClick={() => clickedBack()} className="back-to-search">
          <ArrowBackIosIcon />
          {location.state.prevPath === "/all" && location.state.search
            ? "Search Results"
            : "Home"}
        </button>
        <div className="random-cocktail">
          <img
            alt="cocktail"
            className="cocktail-image"
            src={cocktail.strDrinkThumb}
          ></img>

          <div className='search-card'>
            {/* {location.state.homepage && (
                    <CloseIcon
                    className="close-icon"
                    onClick={() => props.setRandomHidden(true)}
                    />
                )} */}

            {/* {location.state.homepage && <h1>{cocktail.strDrink}</h1>} */}
            <h1 className="cocktail-detail-name">{cocktail.strDrink}</h1>

            <div className="drink-details">
              <ul className="drink-ingredients">
                {Object.keys(ingredientsObject).map((key, index) => {
                  return (
                    <li key={index}>{ingredientsObject[key] + " " + key}</li>
                  );
                })}
              </ul>
              <br />

              <div className="instructions">{cocktail.strInstructions}</div>
            </div>
          </div>
        </div>
      </>
    );
}
