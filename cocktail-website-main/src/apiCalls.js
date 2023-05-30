import Axios from "axios";

export async function randomCocktailApi () {
    try {
        const response = await Axios.get("https://www.thecocktaildb.com/api/json/v1/1/random.php")
        return response

    } catch (error){
        if (error.response) {
            console.log(error.response);
          }
        return []
    }
};

export async function chosenCocktailApi (cocktail) {
    try {
        const response = await Axios.get('https://www.thecocktaildb.com/api/json/v1/1/search.php?s='+cocktail.replace(/ /g,"_"));
        if(response.data.drinks==null){
            throw new Error ("no cocktail returned from chosenCocktailApi call")
        }
        return response

    } catch (error){
        console.log(error)
        return []
    }
}

