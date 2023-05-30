import React from 'react';
import Popup from '../Popup'
import {act, render, screen, waitFor, cleanup, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from "axios";

jest.mock('axios')

describe('Popup',()=>{
    afterEach(cleanup)

    test('renders Popup correctly',()=>{
        //act
        render(<Popup cocktail = "Tequila Sunrise" isHidden = {false}/>);

        //expect
        expect(screen.getByTestId('popup-header')).toHaveTextContent('Tequila Sunrise')
    })

    test('popup disappears when close icon is clicked',async ()=>{
        //setup
        const fakeCocktail = {
            "data":{
                "drinks":[{
                    "strDrink": "110 in the shade",
                    "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/xxyywq1454511117.jpg",
                    "idDrink": "15423"
                }]
            },
            "status": 200
        }

        axios.get.mockResolvedValue(fakeCocktail);

        let setDetails = jest.fn(x => {});
        let setClose = jest.fn(x => {});
        let setError = jest.fn(x => {});
        let setHidden = jest.fn(x => {})
        React.useState = jest.fn()
                        .mockImplementationOnce(x=>[x, setDetails])
                        .mockImplementationOnce(x=>[x, setClose])
                        .mockImplementationOnce(x=>[x, setError])
                        .mockImplementationOnce(x=>[x,setHidden])

        //act
        await act( async ()=>render (<Popup cocktail = "Bloody Mary" isHidden = {false} setHidden = {setHidden}/>))
        const closeButton = screen.getByTestId('close-button');
        act(()=>{fireEvent.click(closeButton)});

        //expect
        expect(screen.getByTestId('popup-header')).toHaveTextContent('Bloody Mary')
        expect(setDetails).toHaveBeenCalledWith(fakeCocktail.data.drinks[0]);
        expect(setError).toHaveBeenCalledWith(false);
        expect(setClose).toHaveBeenCalledWith(true);
        expect(setHidden).toHaveBeenCalledWith(true);
    })

    test('axios fails sets setError to true',async ()=>{
        //setup
        let setDetails = jest.fn(x => {});
        let setClose = jest.fn(x => {});
        let setError = jest.fn(x => {});
        React.useState = jest.fn()
                        .mockImplementationOnce(x=>[x, setDetails])
                        .mockImplementationOnce(x=>[x, setClose])
                        .mockImplementationOnce(x=>[x, setError])

        axios.get.mockRejectedValueOnce();

        //act
        await act( async ()=>render (<Popup cocktail = "Bloody Mary" isHidden = {false} setHidden = {jest.fn()}/>))

        //expect
        expect(setError).toHaveBeenCalledTimes(2);
        expect(setError).toHaveBeenCalledWith(false);
        expect(setError).toHaveBeenCalledWith(true);
    })
})