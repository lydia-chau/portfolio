import React from 'react';
import Liquor from '../Liquor';
import '@testing-library/jest-dom'
import {act, render, screen, waitFor, cleanup, findAllByLabelText} from '@testing-library/react';
import axios from "axios";

jest.mock("axios")
jest.mock('../Popup.js',()=>'div')

describe('Liquor test',()=>{
    afterEach(()=>cleanup);

    beforeEach(()=>{
      window.scrollTo = jest.fn();
      jest.clearAllMocks();

    })

    test('Heading shows type of liquor that is passed to props',()=>{
      //setup
      axios.all = jest.fn().mockReturnValue(new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve('mockData');
        }, 300);
      }));
      axios.spread = jest.fn();

      //act
      render(<Liquor alcohol = "Tequila"/>)

      //expect
      expect(screen.getByText('Tequila')).toBeInTheDocument();
    })

    test('error message shown if no drinks are retrieved',async()=>{
      //setup

      axios.all.mockReturnValue(Promise.reject('mockData'));

      //act
      await act(async ()=>render(<Liquor alcohol = "Brandy"/>))

      //expect
      expect(screen.getByText("Oops! We weren't able to grab some of the drinks you were looking for.")).toBeInTheDocument();

    })

    test('renders cocktail list when API call succeeds', async () => {
      //setup
        const mockData = [
            {
                "data": {
                    "drinks": [
                        {
                            "strDrink": "110 in the shade",
                            "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/xxyywq1454511117.jpg",
                            "idDrink": "15423"
                        },
                        {
                            "strDrink": "3-Mile Long Island Iced Tea",
                            "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/rrtssw1472668972.jpg",
                            "idDrink": "15300"
                        },
                        {
                            "strDrink": "Adam Bomb",
                            "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/tpxurs1454513016.jpg",
                            "idDrink": "16333"
                        },
                        {
                            "strDrink": "Amaretto Stone Sour Alternative",
                            "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/wutxqr1472720012.jpg",
                            "idDrink": "16100"
                        },
                        {
                            "strDrink": "Apple Grande",
                            "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/wqrptx1472668622.jpg",
                            "idDrink": "16289"
                        },
                        {
                            "strDrink": "Bloody Maria",
                            "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/yz0j6z1504389461.jpg",
                            "idDrink": "11112"
                        },
                        {
                            "strDrink": "Blue Margarita",
                            "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/bry4qh1582751040.jpg",
                            "idDrink": "11118"
                        },
                        {
                            "strDrink": "Brave Bull Shooter",
                            "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/yrtypx1473344625.jpg",
                            "idDrink": "13068"
                        },
                        {
                            "strDrink": "Cherry Electric Lemonade",
                            "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/tquyyt1451299548.jpg",
                            "idDrink": "17174"
                        },
                        {
                            "strDrink": "Downshift",
                            "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/y36z8c1503563911.jpg",
                            "idDrink": "16991"
                        },
                        {
                            "strDrink": "Long Island Iced Tea",
                            "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/wx7hsg1504370510.jpg",
                            "idDrink": "17204"
                        },
                        {
                            "strDrink": "Margarita",
                            "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/5noda61589575158.jpg",
                            "idDrink": "11007"
                        },
                        {
                            "strDrink": "Moranguito",
                            "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/urpsyq1475667335.jpg",
                            "idDrink": "16196"
                        },
                        {
                            "strDrink": "Paloma",
                            "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/samm5j1513706393.jpg",
                            "idDrink": "17253"
                        },
                        {
                            "strDrink": "Pineapple Paloma",
                            "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/pg8iw31593351601.jpg",
                            "idDrink": "178327"
                        },
                        {
                            "strDrink": "Radioactive Long Island Iced Tea",
                            "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/rdvqmh1503563512.jpg",
                            "idDrink": "16984"
                        },
                        {
                            "strDrink": "Strawberry Margarita",
                            "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/tqyrpw1439905311.jpg",
                            "idDrink": "12322"
                        },
                        {
                            "strDrink": "Tequila Fizz",
                            "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/2bcase1504889637.jpg",
                            "idDrink": "12362"
                        },
                        {
                            "strDrink": "Tequila Slammer",
                            "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/43uhr51551451311.jpg",
                            "idDrink": "178307"
                        },
                        {
                            "strDrink": "Tequila Sour",
                            "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/ek0mlq1504820601.jpg",
                            "idDrink": "12370"
                        },
                        {
                            "strDrink": "Tequila Sunrise",
                            "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/quqyqp1480879103.jpg",
                            "idDrink": "13621"
                        },
                        {
                            "strDrink": "Tequila Surprise",
                            "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/8189p51504735581.jpg",
                            "idDrink": "14602"
                        },
                        {
                            "strDrink": "Tommy's Margarita",
                            "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/loezxn1504373874.jpg",
                            "idDrink": "17216"
                        },
                        {
                            "strDrink": "Vampiro",
                            "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/yfhn371504374246.jpg",
                            "idDrink": "17217"
                        },
                        {
                            "strDrink": "Whitecap Margarita",
                            "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/srpxxp1441209622.jpg",
                            "idDrink": "16158"
                        },
                        {
                            "strDrink": "Winter Paloma",
                            "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/u5f0pz1614007748.jpg",
                            "idDrink": "178348"
                        },
                        {
                            "strDrink": "Winter Rita",
                            "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/fwpd0v1614006733.jpg",
                            "idDrink": "178347"
                        }
                    ]
                },
                "status": 200
            },
            {
                "data":{
                    "drinks":[{
                        "strDrink": "110 in the shade",
                        "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/xxyywq1454511117.jpg",
                        "idDrink": "15423"
                    }]
                },
                "status": 200
            }
        ]
        let mockReturnList = [
            {
              strDrink: '110 in the shade',
              strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/xxyywq1454511117.jpg',
              idDrink: '15423'
            },
            {
              strDrink: '3-Mile Long Island Iced Tea',
              strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/rrtssw1472668972.jpg',
              idDrink: '15300'
            },
            {
              strDrink: 'Adam Bomb',
              strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/tpxurs1454513016.jpg',
              idDrink: '16333'
            },
            {
              strDrink: 'Amaretto Stone Sour Alternative',
              strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/wutxqr1472720012.jpg',
              idDrink: '16100'
            },
            {
              strDrink: 'Apple Grande',
              strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/wqrptx1472668622.jpg',
              idDrink: '16289'
            },
            {
              strDrink: 'Bloody Maria',
              strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/yz0j6z1504389461.jpg',
              idDrink: '11112'
            },
            {
              strDrink: 'Blue Margarita',
              strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/bry4qh1582751040.jpg',
              idDrink: '11118'
            },
            {
              strDrink: 'Brave Bull Shooter',
              strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/yrtypx1473344625.jpg',
              idDrink: '13068'
            },
            {
              strDrink: 'Cherry Electric Lemonade',
              strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/tquyyt1451299548.jpg',
              idDrink: '17174'
            },
            {
              strDrink: 'Downshift',
              strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/y36z8c1503563911.jpg',
              idDrink: '16991'
            },
            {
              strDrink: 'Long Island Iced Tea',
              strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/wx7hsg1504370510.jpg',
              idDrink: '17204'
            },
            {
              strDrink: 'Margarita',
              strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/5noda61589575158.jpg',
              idDrink: '11007'
            },
            {
              strDrink: 'Moranguito',
              strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/urpsyq1475667335.jpg',
              idDrink: '16196'
            },
            {
              strDrink: 'Paloma',
              strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/samm5j1513706393.jpg',
              idDrink: '17253'
            },
            {
              strDrink: 'Pineapple Paloma',
              strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/pg8iw31593351601.jpg',
              idDrink: '178327'
            },
            {
              strDrink: 'Radioactive Long Island Iced Tea',
              strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/rdvqmh1503563512.jpg',
              idDrink: '16984'
            },
            {
              strDrink: 'Strawberry Margarita',
              strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/tqyrpw1439905311.jpg',
              idDrink: '12322'
            },
            {
              strDrink: 'Tequila Fizz',
              strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/2bcase1504889637.jpg',
              idDrink: '12362'
            },
            {
              strDrink: 'Tequila Slammer',
              strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/43uhr51551451311.jpg',
              idDrink: '178307'
            },
            {
              strDrink: 'Tequila Sour',
              strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/ek0mlq1504820601.jpg',
              idDrink: '12370'
            },
            {
              strDrink: 'Tequila Sunrise',
              strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/quqyqp1480879103.jpg',
              idDrink: '13621'
            },
            {
              strDrink: 'Tequila Surprise',
              strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/8189p51504735581.jpg',
              idDrink: '14602'
            },
            {
              strDrink: "Tommy's Margarita",
              strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/loezxn1504373874.jpg',
              idDrink: '17216'
            },
            {
              strDrink: 'Vampiro',
              strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/yfhn371504374246.jpg',
              idDrink: '17217'
            },
            {
              strDrink: 'Whitecap Margarita',
              strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/srpxxp1441209622.jpg',
              idDrink: '16158'
            },
            {
              strDrink: 'Winter Paloma',
              strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/u5f0pz1614007748.jpg',
              idDrink: '178348'
            },
            {
              strDrink: 'Winter Rita',
              strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/fwpd0v1614006733.jpg',
              idDrink: '178347'
            },
            {
              strDrink: '110 in the shade',
              strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/xxyywq1454511117.jpg',
              idDrink: '15423'
            }
        ]
        axios.get.mockResolvedValueOnce(mockData);
        axios.all = jest.fn().mockImplementation(()=>{
          return Promise.resolve(mockData);
        })
        axios.spread = jest.fn().mockImplementation(()=>{
          setState(mockReturnList)
        })

        const setState = jest.fn();
        const useStateSpy = jest.spyOn(React, 'useState')
        useStateSpy.mockImplementation((init) => [init, setState]);
        
        //act
        await act(async ()=>{render(<Liquor alcohol="Tequila"/>)})

        //expect
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Tequila`);
        expect(axios.all).toHaveBeenCalledTimes(1);
        expect(axios.spread).toHaveBeenCalledTimes(1);
        await waitFor(() => expect(setState).toHaveBeenCalledTimes(3));
        await waitFor(() => expect (setState).toHaveBeenCalledWith(mockReturnList))
    })
})