import React from 'react';
import Home from '../Home';
import {render, screen, cleanup, fireEvent, waitFor} from '@testing-library/react';
import axios from 'axios';
import '@testing-library/jest-dom/extend-expect'


describe("Home",()=>{
    afterEach(cleanup);

    const fakeRandomCocktail = {
        "data":{
            "drinks":[{
                "strDrink": "110 in the shade",
                "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/xxyywq1454511117.jpg",
                "idDrink": "15423"
            }]
        },
        "status": 200
    }
    test('renders users when API call succeeds', async () => {
        
        axios.get.mockResolvedValue(fakeRandomCocktail);
        const setState = jest.fn();
        const useStateSpy = jest.spyOn(React, 'useState')
        useStateSpy.mockImplementation((init) => [init, setState]);
        
        const {findByText, rerender} = render(<Home />)
    
        const button = screen.getByTestId("generate-button")
        fireEvent.click(button);

        await waitFor(() => expect(axios.get).toBeCalledTimes(1))
        await waitFor(() =>  expect(axios.get).toHaveBeenCalledWith("https://www.thecocktaildb.com/api/json/v1/1/random.php"))
        await waitFor(() => expect(setState).toHaveBeenCalledTimes(3));
        await waitFor(() => expect(setState).toHaveBeenCalledWith(fakeRandomCocktail.data.drinks[0]))
    })

    test('renders error when API call fails', async () => {
        const errorObject = {
            "data": "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\r\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\r\n<head>\r\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=iso-8859-1\"/>\r\n<title>404 - File or directory not found.</title>\r\n<style type=\"text/css\">\r\n<!--\r\nbody{margin:0;font-size:.7em;font-family:Verdana, Arial, Helvetica, sans-serif;background:#EEEEEE;}\r\nfieldset{padding:0 15px 10px 15px;} \r\nh1{font-size:2.4em;margin:0;color:#FFF;}\r\nh2{font-size:1.7em;margin:0;color:#CC0000;} \r\nh3{font-size:1.2em;margin:10px 0 0 0;color:#000000;} \r\n#header{width:96%;margin:0 0 0 0;padding:6px 2% 6px 2%;font-family:\"trebuchet MS\", Verdana, sans-serif;color:#FFF;\r\nbackground-color:#555555;}\r\n#content{margin:0 0 0 2%;position:relative;}\r\n.content-container{background:#FFF;width:96%;margin-top:8px;padding:10px;position:relative;}\r\n-->\r\n</style>\r\n</head>\r\n<body>\r\n<div id=\"header\"><h1>Server Error</h1></div>\r\n<div id=\"content\">\r\n <div class=\"content-container\"><fieldset>\r\n  <h2>404 - File or directory not found.</h2>\r\n  <h3>The resource you are looking for might have been removed, had its name changed, or is temporarily unavailable.</h3>\r\n </fieldset></div>\r\n</div>\r\n</body>\r\n</html>\r\n",
            "status": 404,
            "statusText": "",
            "headers": {
                "content-type": "text/html"
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
                "url": "https://www.thecocktaildb.com/api/json/v1/1/rando.php"
            },
            "request": {}
        }
        axios.get.mockImplementationOnce(() =>
      Promise.reject(new Error(errorObject)),
    );
        const setState = jest.fn();
        const useStateSpy = jest.spyOn(React, 'useState')
        useStateSpy.mockImplementation((init) => [init, setState]);

        const {getByText}= render(<Home />);
        const button = screen.getByTestId("generate-button")
        fireEvent.click(button);
        await waitFor(() => expect(setState).toHaveBeenCalledTimes(3));
        await waitFor(() => expect(setState).toHaveBeenCalledWith(true));
        await waitFor(() => expect(setState).not.toHaveBeenCalledWith(fakeRandomCocktail.data.drinks[0]))
    })
})