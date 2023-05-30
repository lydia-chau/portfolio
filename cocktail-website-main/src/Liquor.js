import React, { useEffect } from "react";
import Axios from "axios";
import "./css/Cocktails.css";
import Popup from './Popup.js'
import {sortList} from "./utils"

export default function Liquor(props) {
  const [liquorList, setList] = React.useState([]);
  const [isHidden, setLiquorHidden] = React.useState(true);
  const [cocktail, setCocktail] = React.useState('')
  const [error, setError] = React.useState(false);

  const cocktailClicked = (cocktail) => {
    setCocktail(cocktail);
    setLiquorHidden(false);
}
  
  function getUrl(alcohol){
    switch (alcohol){
      case "Vodka":
        return [
          Axios.get("https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Vodka"),
          Axios.get("https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Peach_vodka"),
          Axios.get("https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Lemon_vodka")
        ]
      case "Gin":
        return [
          Axios.get("https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Gin"),
          Axios.get('https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Sloe_gin')
        ]
      case "Tequila":
        return [Axios.get('https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Tequila')]

      case "Whiskey":
        return [
          Axios.get("https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Whiskey"),
          Axios.get("https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Blended_whiskey"),
          Axios.get("https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Bourbon"),
          Axios.get("https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=scotch"),
          Axios.get("https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Irish_whiskey"),
        ]

      case "Brandy":
        return [
          Axios.get("https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Brandy"),
          Axios.get("https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Apricot_brandy"),
          Axios.get("https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Cognac"),
          Axios.get("https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Apple_brandy"),
          Axios.get("https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Cherry_brandy"),
          Axios.get("https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Coffee_brandy"),
          Axios.get("https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Blackberry_brandy"),
        ]

      case "Rum":
        return [
          Axios.get("https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Rum"),
          Axios.get('https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Light_rum'),
          Axios.get('https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Dark_rum'),
          Axios.get('https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Spiced_rum')
        ]

      case "Vermouth":
        return [
          Axios.get("https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Dry_vermouth"),
          Axios.get('https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Sweet_vermouth')
        ]

      default:
        return [Axios.get('https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Tequila')]

    }
  }

  //maybe use useMemo for getUrl!!
  useEffect(() => {
    window.scrollTo(0, 0);
    setLiquorHidden(true);
    setError(false);
    
    function getCocktailApi(){
      Axios.all(getUrl(props.alcohol))
      .then(
        Axios.spread((...response) => {
          var oldList = [];
          for (const dataObj of Object.values(response)) {
            if(dataObj.data.drinks){
              oldList = oldList.concat(dataObj.data.drinks);
            }else{
              setError(true)
            }
          }
          setList(oldList);
        })
      )
      .catch(function (error) {
        setError(true);
        if (error.response) {
          console.log(error.response);
        }
        return []
      });
    }

    getCocktailApi();

  }, [props.alcohol]);
  

  return (
    <div>
      <h1 className="cocktail-heading">{props.alcohol}</h1>
      <h1 className="cocktail-heading"> Cocktails</h1>

      <Popup cocktail={cocktail} isHidden={isHidden} setHidden={setLiquorHidden}/>
      {liquorList.length>0 && <ul className="cocktail-list">
        {sortList(liquorList).map((item, index) => {
          return <button onClick={()=>cocktailClicked(item.strDrink)} className='cocktail-name' key={index}> {item.strDrink}</button>;
        })}
      </ul>}
      {!error && liquorList.length===0 && <h1 className="cocktail-heading">Loading... </h1>}

      {error && <h1 className="cocktail-heading">Oops! We weren't able to grab some of the drinks you were looking for. </h1>}
    </div>
  );
}
