import {randomCocktailApi, chosenCocktailApi} from '../apiCalls';
import axios from 'axios';
import '@testing-library/jest-dom/extend-expect'

jest.mock('axios')
describe('testing api calls',()=>{
    test ('receives a random cocktail upon calling randomCocktailApi',async ()=>{
        //setup
        const randomCocktail = {
            "data": {
                "drinks": [
                    {
                        "idDrink": "15849",
                        "strDrink": "Apricot punch",
                        "strDrinkAlternate": null,
                        "strTags": null,
                        "strVideo": null,
                        "strCategory": "Punch / Party Drink",
                        "strIBA": null,
                        "strAlcoholic": "Alcoholic",
                        "strGlass": "Punch bowl",
                        "strInstructions": "Pour all ingrediants into a large punch bowl. Add ice and 4 oranges that are peeled and divided.",
                        "strInstructionsES": "Vierta todos los ingredientes en una ponchera grande. Agregue hielo y 4 naranjas peladas y divididas.",
                        "strInstructionsDE": "Alle Zutaten in eine große Bowle geben. Füge Eis und 4 Orangen hinzu, die geschält und geteilt sind.",
                        "strInstructionsFR": null,
                        "strInstructionsIT": "Versare tutti gli ingredienti in una grande ciotola da punch.\r\nAggiungere il ghiaccio e 4 arance sbucciate e divise.",
                        "strInstructionsZH-HANS": null,
                        "strInstructionsZH-HANT": null,
                        "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/tuxxtp1472668667.jpg",
                        "strIngredient1": "Apricot brandy",
                        "strIngredient2": "Champagne",
                        "strIngredient3": "Vodka",
                        "strIngredient4": "7-Up",
                        "strIngredient5": "Orange juice",
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
                        "strMeasure1": "1 qt ",
                        "strMeasure2": "4 fifth ",
                        "strMeasure3": "1 fifth ",
                        "strMeasure4": "4 L ",
                        "strMeasure5": "1/2 gal ",
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
                        "dateModified": "2016-08-31 19:37:47"
                    }
                ]
            },
            "status": 200,
            "statusText": "",
            "headers": {
                "content-type": "application/json"
            },
            "config": {
                "transitional": {
                    "silentJSONParsing": true,
                    "forcedJSONParsing": true,
                    "clarifyTimeoutError": false
                },
                "transformRequest": [
                    null
                ],
                "transformResponse": [
                    null
                ],
                "timeout": 0,
                "xsrfCookieName": "XSRF-TOKEN",
                "xsrfHeaderName": "X-XSRF-TOKEN",
                "maxContentLength": -1,
                "maxBodyLength": -1,
                "headers": {
                    "Accept": "application/json, text/plain, */*"
                },
                "method": "get",
                "url": "https://www.thecocktaildb.com/api/json/v1/1/random.php"
            },
            "request": {}
        }
        axios.get.mockResolvedValueOnce(randomCocktail);

        //act
        const res = await randomCocktailApi();

        //expect
        expect(res).toStrictEqual(randomCocktail)
    })

    test ('receives chosen cocktail information upon calling chosenCocktailApi', async()=>{
        //setup
        const cocktailString = "Empellón Cocina's Fat-Washed Mezcal"
        const chosenCocktail = {
            "data": {
                "drinks": [
                    {
                        "idDrink": "17246",
                        "strDrink": "Empellón Cocina's Fat-Washed Mezcal",
                        "strDrinkAlternate": null,
                        "strTags": null,
                        "strVideo": null,
                        "strCategory": "Cocktail",
                        "strIBA": null,
                        "strAlcoholic": "Alcoholic",
                        "strGlass": "Beer Glass",
                        "strInstructions": "To ensure that your pork fat is just as delicious as theirs, here’s their adobo marinade and what to do with it (you’ll also need a rack of ribs):\r\n\r\n4 ancho chiles, 8 guajillo chiles and 4 chipotle chiles, plus 4 cloves roasted garlic, half a cup of cider vinegar, a quarter teaspoon of Mexican oregano, 1 teaspoon of ground black pepper, a whole clove, a quarter teaspoon of ground cinnamon and a half teaspoon of ground cumin.\r\n\r\nToast the dried chiles and soak in water for at least an hour until they are rehydrated. Drain and discard the soaking liquid. Combine the soaked chiles with the remaining ingredients and purée until smooth.\r\n\r\nCold smoke a rack of baby back pork ribs by taking a large hotel pan with woodchips on one side and charcoal on the other. Place another, smaller, pan with pork ribs, above the charcoal/woodchip pan. Ignite the charcoal, being careful to not ignite the woodchips. Cover both pans with foil and allow to smoke for 10-15 minutes, until desired level of smoke is achieved, then coat with adobo marinade and wrap in tin foil prior to placing ribs in a 300 degree oven for 7 hours. When the ribs have cooled, strain off the fat and use for the infusion.\r\n\r\nIf you’re having a hard time coming up to the same kind of volume of fat, make up the balance with pork lard from a butcher. To get the same depth of flavor without the ribs, heat up the fat in a pot with a few spoons of the marinade.\r\n\r\nOnce you’ve got your tub of seasoned pork fat in cooled liquid form, pour equal amounts of Ilegal Joven mezcal and fat into a sealable container. Seal the container and give it a really good shake, then put it in the freezer overnight. When the whole thing is separated and congealed, pour it through a fine mesh chinoise. If you don’t have a chinoise, try a fine mesh strainer, or if you don’t have one of those, try spooning off most of the fat. There will be some beads of orange fat left in the strained mezcal: run that through a few layers of cheesecloth (or coffee filters in a pinch) to get rid of the last of it.\r\n\r\nThe mezcal is now ready for drinking, straight-up or in a cocktail. \r\n\r\nHabanero tincture\r\n\r\nSlice habaneros and add 2 ounces Ilegal Joven mezcal.\r\nAllow to sit overnight or until desired level of heat is achieved.\r\nCocktail\r\n\r\nCombine mezcal and chocolate liqueur in a mixing glass with ice and stir for 45 seconds.\r\nStrain into chilled coupe.\r\nCarefully \"sink\" the coffee liqueur down the inside of the coupe over a spoon.\r\nGarnish with 5 drops habanero tincture.",
                        "strInstructionsES": null,
                        "strInstructionsDE": "Damit Ihr Schweinefett genauso lecker ist wie ihres, gibt es hier die Adobo-Marinade und was man damit machen kann (Sie benötigen auch ein Rippchen)",
                        "strInstructionsFR": null,
                        "strInstructionsIT": "\"Per assicurarti che il tuo grasso di maiale sia delizioso come il loro, ecco la loro marinata di adobo e cosa farne (ti servirà anche un carré di costolette):\r\n\r\n4 peperoncini ancho, 8 peperoncini guajillo e 4 peperoncini chipotle, più 4 spicchi d'aglio arrostiti, mezza tazza di aceto di sidro, un quarto di cucchiaino di origano messicano, 1 cucchiaino di pepe nero macinato, uno spicchio intero, un quarto di cucchiaino di cannella in polvere e mezzo cucchiaino di cumino macinato.\r\n\r\nTostare i peperoncini secchi e metterli a bagno in acqua per almeno un'ora finché non si saranno reidratati. Scolare e gettare il liquido di ammollo. Unire i peperoncini ammollati con gli ingredienti rimanenti e ridurre in purea fino a che liscio.\r\n\r\nAffumica a freddo una griglia di costolette di maiale prendendo una grande padella  con trucioli di legno da un lato e carbone dall'altro. Posizionare un'altra padella, più piccola, con le costine di maiale, sopra la teglia per carbone / trucioli. Accendi il carbone facendo attenzione a non incendiare i trucioli. Coprire entrambe le padelle con un foglio e lasciare affumicare per 10-15 minuti, fino a raggiungere il livello di fumo desiderato, quindi rivestire con la marinata di adobo e avvolgere nella carta stagnola prima di mettere le costole in un forno a 300 gradi per 7 ore. Quando le costine si saranno raffreddate, filtrate il grasso e usatelo per l'infuso.\r\n\r\nSe hai difficoltà a raggiungere lo stesso tipo di volume di grasso, compensa con lo strutto di maiale di un macellaio. Per ottenere la stessa profondità di sapore senza le costolette, scaldare il grasso in una pentola con qualche cucchiaio di marinata.\r\n\r\nUna volta che hai la tua vasca di grasso di maiale condito in forma liquida raffreddata, versa quantità uguali di mezcal e grasso in un contenitore sigillabile. Sigilla il contenitore e scuoterlo bene, quindi mettilo nel congelatore per una notte. Quando il tutto si sarà separato e solidificato, versatelo in uno chinois a maglia fine. Se non hai un chinois, prova un colino a maglia fine, o se non ne hai uno, prova a eliminare la maggior parte del grasso con un cucchiaio. Ci saranno delle gocce di grasso arancione nel mezcal filtrato: passalo attraverso alcuni strati di garza (o filtri di caffè) per sbarazzartene dell'ultimo.\r\n\r\nIl mezcal è ora pronto per essere bevuto, puro o in un cocktail.\r\n\r\nTintura di Habanero\r\n\r\nAffetta gli habaneros e aggiungi 2 once di Ilegal Joven mezcal.\r\nLasciar riposare per una notte o finché non si raggiunge il livello di calore desiderato.\r\nCocktail\r\n\r\nUnisci il mezcal e il liquore al cioccolato in un mixing glass con ghiaccio e mescola per 45 secondi.\r\nFiltrare in un bicchiere freddo.\r\nAffondare con cura il liquore al caffè all'interno del bicchiere sopra un cucchiaio.\r\nDecorare con 5 gocce di tintura di habanero.",
                        "strInstructionsZH-HANS": null,
                        "strInstructionsZH-HANT": null,
                        "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/osgvxt1513595509.jpg",
                        "strIngredient1": "Mezcal",
                        "strIngredient2": "Chocolate liqueur",
                        "strIngredient3": "Coffee liqueur",
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
                        "strMeasure1": "2 oz",
                        "strMeasure2": "3/4 oz",
                        "strMeasure3": "1/2 oz",
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
                        "dateModified": "2017-12-18 11:11:49"
                    }
                ]
            },
            "status": 200,
            "statusText": "",
            "headers": {
                "content-type": "application/json"
            },
            "config": {
                "transitional": {
                    "silentJSONParsing": true,
                    "forcedJSONParsing": true,
                    "clarifyTimeoutError": false
                },
                "transformRequest": [
                    null
                ],
                "transformResponse": [
                    null
                ],
                "timeout": 0,
                "xsrfCookieName": "XSRF-TOKEN",
                "xsrfHeaderName": "X-XSRF-TOKEN",
                "maxContentLength": -1,
                "maxBodyLength": -1,
                "headers": {
                    "Accept": "application/json, text/plain, */*"
                },
                "method": "get",
                "url": "https://www.thecocktaildb.com/api/json/v1/1/random.php"
            },
            "request": {}
        }
        axios.get.mockResolvedValueOnce(chosenCocktail);

        //act
        const res = await chosenCocktailApi (cocktailString)

        //expect
        expect(res).toStrictEqual(chosenCocktail)
    })
})