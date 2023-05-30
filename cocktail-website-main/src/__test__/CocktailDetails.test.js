import React from 'react'
import RandomCocktail from '../CocktailDetails'
import {act, render, screen, waitFor, cleanup, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('Cocktail Details',()=>{
    afterEach(cleanup)
    
    test('Cocktail name appears as header if component is rendered on homepage',()=>{
        //setup
        const mockCocktailObj = {
            "idDrink": "11147",
            "strDrink": "Bourbon Sour",
            "strDrinkAlternate": null,
            "strTags": null,
            "strVideo": null,
            "strCategory": "Ordinary Drink",
            "strIBA": null,
            "strAlcoholic": "Alcoholic",
            "strGlass": "Whiskey sour glass",
            "strInstructions": "In a shaker half-filled with ice cubes, combine the bourbon, lemon juice, and sugar. Shake well. Strain into a whiskey sour glass, garnish with the orange slice and cherry.",
            "strInstructionsES": null,
            "strInstructionsDE": "In einem Shaker, der halb mit Eiswürfeln gefüllt ist, Bourbon, Zitronensaft und Zucker vermengen. Gut schütteln. In ein Whiskey Sour Glas abseihen, mit der Orangenscheibe und der Kirsche garnieren.",
            "strInstructionsFR": null,
            "strInstructionsIT": "In uno shaker riempito a metà con cubetti di ghiaccio, unisci il bourbon, il succo di limone e lo zucchero. Filtrare in un bicchiere da whisky sour, guarnire con la fetta d'arancia e la ciliegia. Agitare bene.",
            "strInstructionsZH-HANS": null,
            "strInstructionsZH-HANT": null,
            "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/dms3io1504366318.jpg",
            "strIngredient1": "Bourbon",
            "strIngredient2": "Lemon juice",
            "strIngredient3": "Sugar",
            "strIngredient4": "Orange",
            "strIngredient5": "Maraschino cherry",
            "strIngredient6": null,
            "strIngredient7": null,
            "strIngredient8": null,
            "strIngredient9": null,
            "strIngredient10": null,
            "strIngredient11": null,
            "strIngredient12": null,
            "strIngredient13": null,
            "strIngredient14": null,
            "strIngredient15": null,
            "strMeasure1": "2 oz ",
            "strMeasure2": "1 oz ",
            "strMeasure3": "1/2 tsp superfine ",
            "strMeasure4": "1 ",
            "strMeasure5": "1 ",
            "strMeasure6": null,
            "strMeasure7": null,
            "strMeasure8": null,
            "strMeasure9": null,
            "strMeasure10": null,
            "strMeasure11": null,
            "strMeasure12": null,
            "strMeasure13": null,
            "strMeasure14": null,
            "strMeasure15": null,
            "strImageSource": null,
            "strImageAttribution": null,
            "strCreativeCommonsConfirmed": "No",
            "dateModified": "2017-09-02 16:31:58"
        }

        //act
        render(<RandomCocktail cocktail={mockCocktailObj} homepage={true} popup={true} error={false}/>)

        //expect
        expect(screen.getByText('Bourbon Sour')).toBeInTheDocument();
    })

    test('Cocktail name DOES NOT appear as header if component is not rendered on homepage',()=>{
        //setup
        const mockCocktailObj = {
            "idDrink": "178311",
            "strDrink": "Broadside",
            "strDrinkAlternate": null,
            "strTags": null,
            "strVideo": null,
            "strCategory": "Cocktail",
            "strIBA": null,
            "strAlcoholic": "Alcoholic",
            "strGlass": "Highball glass",
            "strInstructions": "Half fill the glass with ice cubes. Crush the wormwood and add to ice. Pour rum, scotch and butters, then serve!",
            "strInstructionsES": null,
            "strInstructionsDE": null,
            "strInstructionsFR": null,
            "strInstructionsIT": "Riempire a metà il bicchiere con cubetti di ghiaccio. Schiacciare l'assenzio e aggiungerlo al ghiaccio. Versare rum, scotch e burro, quindi servire!",
            "strInstructionsZH-HANS": null,
            "strInstructionsZH-HANT": null,
            "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/l2o6xu1582476870.jpg",
            "strIngredient1": "151 proof rum",
            "strIngredient2": "Scotch",
            "strIngredient3": "Bitters",
            "strIngredient4": "Wormwood",
            "strIngredient5": "Ice",
            "strIngredient6": null,
            "strIngredient7": null,
            "strIngredient8": null,
            "strIngredient9": null,
            "strIngredient10": null,
            "strIngredient11": null,
            "strIngredient12": null,
            "strIngredient13": null,
            "strIngredient14": null,
            "strIngredient15": null,
            "strMeasure1": "1 shot",
            "strMeasure2": "1/2 shot",
            "strMeasure3": "3 drops",
            "strMeasure4": "1 Fresh",
            "strMeasure5": "cubes",
            "strMeasure6": "",
            "strMeasure7": "",
            "strMeasure8": null,
            "strMeasure9": null,
            "strMeasure10": null,
            "strMeasure11": null,
            "strMeasure12": null,
            "strMeasure13": null,
            "strMeasure14": null,
            "strMeasure15": null,
            "strImageSource": null,
            "strImageAttribution": null,
            "strCreativeCommonsConfirmed": "Yes",
            "dateModified": null
        }

        //act
        render(<RandomCocktail cocktail={mockCocktailObj} homepage={false} popup={true} error={false}/>)

        //expect
        expect(screen.queryByText('Broadside')).not.toBeInTheDocument();
    })

    test('div has className drink-details-popup when props.pop passed as true',()=>{
        //setup
        const mockCocktailObj = {
            "idDrink": "11369",
            "strDrink": "Flying Scotchman",
            "strDrinkAlternate": null,
            "strTags": null,
            "strVideo": null,
            "strCategory": "Ordinary Drink",
            "strIBA": null,
            "strAlcoholic": "Alcoholic",
            "strGlass": "Cocktail glass",
            "strInstructions": "Shake all ingredients with ice, strain into a cocktail glass, and serve.",
            "strInstructionsES": null,
            "strInstructionsDE": "Alle Zutaten mit Eis schütteln, in ein Cocktailglas abseihen und servieren.",
            "strInstructionsFR": null,
            "strInstructionsIT": "Shakerare tutti gli ingredienti con ghiaccio, filtrare in una coppetta da cocktail e servire.",
            "strInstructionsZH-HANS": null,
            "strInstructionsZH-HANT": null,
            "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/q53l911582482518.jpg",
            "strIngredient1": "Scotch",
            "strIngredient2": "Sweet Vermouth",
            "strIngredient3": "Bitters",
            "strIngredient4": "Sugar syrup",
            "strIngredient5": null,
            "strIngredient6": null,
            "strIngredient7": null,
            "strIngredient8": null,
            "strIngredient9": null,
            "strIngredient10": null,
            "strIngredient11": null,
            "strIngredient12": null,
            "strIngredient13": null,
            "strIngredient14": null,
            "strIngredient15": null,
            "strMeasure1": "1 oz ",
            "strMeasure2": "1 oz ",
            "strMeasure3": "1 dash ",
            "strMeasure4": "1/4 tsp ",
            "strMeasure5": null,
            "strMeasure6": null,
            "strMeasure7": null,
            "strMeasure8": null,
            "strMeasure9": null,
            "strMeasure10": null,
            "strMeasure11": null,
            "strMeasure12": null,
            "strMeasure13": null,
            "strMeasure14": null,
            "strMeasure15": null,
            "strImageSource": null,
            "strImageAttribution": null,
            "strCreativeCommonsConfirmed": "Yes",
            "dateModified": "2017-09-04 11:14:00"
        }

        //act
        render(<RandomCocktail cocktail={mockCocktailObj} homepage={true} popup={true} error={false}/>)

        //expect
        expect(screen.getByTestId("drink-details")).toHaveClass("drink-details-popup")
    })

    test('cocktail details appear on the sreen in the correct format',()=>{
        //setup
        const mockCocktailObj = {
            "idDrink": "17826",
            "strDrink": "The Jimmy Conway",
            "strDrinkAlternate": null,
            "strTags": null,
            "strVideo": null,
            "strCategory": "Cocktail",
            "strIBA": null,
            "strAlcoholic": "Alcoholic",
            "strGlass": "Whiskey sour glass",
            "strInstructions": "Fill glass with ice\r\nPour in The Irishman and Disaronno\r\nFill to the top with Cranberry Juice\r\nGarnish with a slice of lemon…Enjoy!",
            "strInstructionsES": null,
            "strInstructionsDE": "Glas mit Eis füllen. Gießen Sie den Iren und Disaronno ein. Bis zum Anschlag mit Preiselbeersaft füllen.Mit einer Scheibe Zitrone garnieren. Viel Spaß! ",
            "strInstructionsFR": null,
            "strInstructionsIT": "Riempire il bicchiere con ghiaccio Versare The Irishman e Disaronno Riempire fino in cima con succo di mirtillo rosso Guarnire con una fetta di limone… Buon divertimento!",
            "strInstructionsZH-HANS": null,
            "strInstructionsZH-HANT": null,
            "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/wbcvyo1535794478.jpg",
            "strIngredient1": "Irish Whiskey",
            "strIngredient2": "Amaretto",
            "strIngredient3": "Cranberry Juice",
            "strIngredient4": null,
            "strIngredient5": null,
            "strIngredient6": null,
            "strIngredient7": null,
            "strIngredient8": null,
            "strIngredient9": null,
            "strIngredient10": null,
            "strIngredient11": null,
            "strIngredient12": null,
            "strIngredient13": null,
            "strIngredient14": null,
            "strIngredient15": null,
            "strMeasure1": "50 ml",
            "strMeasure2": "50 ml",
            "strMeasure3": "4 oz",
            "strMeasure4": null,
            "strMeasure5": null,
            "strMeasure6": null,
            "strMeasure7": null,
            "strMeasure8": null,
            "strMeasure9": null,
            "strMeasure10": null,
            "strMeasure11": null,
            "strMeasure12": null,
            "strMeasure13": null,
            "strMeasure14": null,
            "strMeasure15": null,
            "strImageSource": null,
            "strImageAttribution": null,
            "strCreativeCommonsConfirmed": "No",
            "dateModified": "2018-09-01 10:34:38"
        }

        //act
        render(<RandomCocktail cocktail={mockCocktailObj} homepage={true} popup={true} error={false}/>)

        //expect
        expect(screen.getByText(mockCocktailObj.strDrink)).toBeInTheDocument();
        expect(screen.getByTestId("drink-ingredients")).toHaveTextContent(mockCocktailObj.strIngredient1)
        expect(screen.getByTestId("drink-ingredients")).toHaveTextContent(mockCocktailObj.strIngredient2)
        expect(screen.getByTestId("drink-ingredients")).toHaveTextContent(mockCocktailObj.strIngredient3)
        expect(screen.getByTestId("drink-ingredients")).toHaveTextContent(mockCocktailObj.strMeasure1)
        expect(screen.getByTestId("drink-ingredients")).toHaveTextContent(mockCocktailObj.strMeasure2)
        expect(screen.getByTestId("drink-ingredients")).toHaveTextContent(mockCocktailObj.strMeasure3)
        expect(screen.getByTestId("instructions")).toHaveTextContent(mockCocktailObj.strInstructions.replace(/\r\n/g,' '))
    })

    test('error text shown if error has occurred',()=>{
        //setup
        const mockCocktailObj = {
            "idDrink": "11528",
            "strDrink": "Irish Spring",
            "strDrinkAlternate": null,
            "strTags": null,
            "strVideo": null,
            "strCategory": "Ordinary Drink",
            "strIBA": null,
            "strAlcoholic": "Alcoholic",
            "strGlass": "Collins glass",
            "strInstructions": "Pour all ingredients (except orange slice and cherry) into a collins glass over ice cubes. Garnish with the slice of orange, add the cherry on top, and serve.",
            "strInstructionsES": null,
            "strInstructionsDE": "Alle Zutaten (außer Orangenscheibe und Kirsche) in ein Collins-Glas über Eiswürfel gießen. Mit der Orangenscheibe garnieren, die Kirsche darüber geben und servieren.",
            "strInstructionsFR": null,
            "strInstructionsIT": "Versare tutti gli ingredienti (tranne la fetta d'arancia e la ciliegia) in un bicchiere Collins con cubetti di ghiaccio. Guarnire con la fetta d'arancia, aggiungere la ciliegina sulla torta e servire.",
            "strInstructionsZH-HANS": null,
            "strInstructionsZH-HANT": null,
            "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/sot8v41504884783.jpg",
            "strIngredient1": "Irish whiskey",
            "strIngredient2": "Peach brandy",
            "strIngredient3": "Orange juice",
            "strIngredient4": "Sweet and sour",
            "strIngredient5": "Orange",
            "strIngredient6": "Cherry",
            "strIngredient7": null,
            "strIngredient8": null,
            "strIngredient9": null,
            "strIngredient10": null,
            "strIngredient11": null,
            "strIngredient12": null,
            "strIngredient13": null,
            "strIngredient14": null,
            "strIngredient15": null,
            "strMeasure1": "1 oz ",
            "strMeasure2": "1/2 oz ",
            "strMeasure3": "1 oz ",
            "strMeasure4": "1 oz ",
            "strMeasure5": "1 slice ",
            "strMeasure6": "1 ",
            "strMeasure7": null,
            "strMeasure8": null,
            "strMeasure9": null,
            "strMeasure10": null,
            "strMeasure11": null,
            "strMeasure12": null,
            "strMeasure13": null,
            "strMeasure14": null,
            "strMeasure15": null,
            "strImageSource": null,
            "strImageAttribution": null,
            "strCreativeCommonsConfirmed": "No",
            "dateModified": "2017-09-08 16:33:03"
        }

        //act
        render(<RandomCocktail cocktail={mockCocktailObj} homepage={false} popup={true} error={true}/>)

        //expect
        expect(screen.getByText("Oops! Something went wrong")).toBeInTheDocument()
    })
})