import React, { useState, useEffect, useRef } from "react";
import { MenuItems } from "./MenuItems.js";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from '@mui/icons-material/Close';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import "./css/Navbar.css";
import Axios from "axios";
import {sortList,alphabeticalList} from "./utils";

export default function Navbar() {
  const ref = useRef();
  const [dropdownOpened, setOpened] = useState(false);
  const [searchClicked, setClicked]=useState(false);
  const [showInput, setInput] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hamShow, setHamShow] = useState(false)
  const [finalList, setFinal] = useState([]);
  const [search, setSearch] = useState("");
  let location = useLocation();
  let navigate = useNavigate();

  const filteredCocktails =
    search.length === 0
      ? finalList
      : finalList.filter((cocktail) => {
          return cocktail.strDrink.toLowerCase().includes(search.toLowerCase());
        });


  function inputChanged(value) {
    setSearch(value);
  }

  function focusedClicked() {
    setFocused(true);
    setOpened(true);
  }
  

  // GETTING ALL 420 COCKTAILS FROM API
  //IMPORTANT!!!! CURRENTLY MISSING COCKTAILS STARTING WITH NUMBERS
  //AND ALSO BRANDY COCKTAILS, BOURBON ,SOME LONG NAMED COCKTAILS SUCH AS 'AFTER DINNER COCKTAIL'
  //ALSO SHOULD USE USEMEMO() FOR THIS!!!!!!!!!!!!!!
  useEffect(() => {
    let emptyArr = [];
    for (var i = 97; i < 123; i++) {
      emptyArr.push(
        Axios.get(
          "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=" +
            String.fromCharCode(i)
        )
      );
    }

    for (var k=0; k<10; k++){
      emptyArr.push(
        Axios.get(
          "https://www.thecocktaildb.com/api/json/v1/1/search.php?f="+k
        )
      );
    }

    Axios.all(emptyArr).then(
      Axios.spread((...responseArr) => {
        let finalArray = [];

        for (var j = 0; j < 36; j++) {
          finalArray.push(responseArr[j].data.drinks);
        }
        let anotherArray = [];
        for (var z = 0; z < 36; z++) {
          if (finalArray[z] !== null) {
            anotherArray.push(...finalArray[z]);
          }
        }
        setFinal(anotherArray.splice(0));
      })
    );
  }, []);

  // checkIfClickedOutside: CHECKING TO SEE IF CLICKED OUTSIDE FROM SEARCH DROPDOWN
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpened(false);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
  }, []);

  const formSubmit = (event) => {
    event.preventDefault();
    setFocused(false);
    setOpened(false);
    navigate("/all", {
      state: {
        filteredCocktails: alphabeticalList(
          search,
          sortList(filteredCocktails)
        ),
        search: search,
      },
    });
  };

  return (
    <>
      <nav className="navbar-menu">
        <a className="nav-head" href="/">
          Everything Cocktails
        </a>

        {/* SEARCH BAR AND DROPDOWN */}

        {/* NAV BAR LINKS */}
        <ul className="nav-items">
          <div>
            <div className="search-group">
              {/* {showInput && ( */}
                <form className="form-input" onSubmit={formSubmit}>
                  <input
                    onClick={() => focusedClicked()}
                    onBlur={() => setFocused(false)}
                    className={searchClicked && showInput? 'input-bar input-slide-in ': searchClicked ? 'input-bar input-slide-out': 'hidden'}
                    type="text"
                    placeholder="search cocktails"
                    value={search}
                    onChange={(e) => inputChanged(e.target.value)}
                  ></input>
                </form>
              {/* )}  */}

              {showInput? 
              <CloseIcon 
                className="dropdown-links"
                onClick={()=> setInput(!showInput)} />
              : 
              <SearchIcon
                className="dropdown-links"
                onClick={() => {setInput(!showInput); setClicked(true)}}
              />}

              
            </div>

            {(focused || dropdownOpened) && (
              <div ref={ref} >
                <ul className="dropdown">
                  {alphabeticalList(search, filteredCocktails).slice(0, 5)
                    .map((cocktail, i) => {
                      return (
                        <li key={i} className="dropdown-list">
                          {/* NAV LINKS TO COCKTAILS IN DROPDOWN */}
                          <NavLink
                            onClick={() => setOpened(false)}
                            to="/searched"
                            state={{
                              cocktail: cocktail,
                              prevPath: location.pathname,
                              // homepage: false,
                            }}
                            className="dropdown-links"
                          >
                            {cocktail.strDrink}
                          </NavLink>
                        </li>
                      );
                    })}

                  {/* SHOW MORE LINK */}
                  <li key={"show-more"} className="dropdown-list">
                    <NavLink
                      onClick={() => setOpened(false)}
                      className="dropdown-links"
                      to="/all"
                      state={{
                        filteredCocktails: alphabeticalList(
                          search,
                          sortList(filteredCocktails)
                        ),
                        search: search,
                      }}
                    >
                      ...show more
                    </NavLink>
                  </li>
                </ul>
              </div>
            )}
          </div>
          {MenuItems.map((item, index) => {
            return (
              <li key={index}>
                <NavLink
                  className='nav-links'
                  to={item.url}
                >
                  {item.title}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {location.pathname!=='/' && 
      <>
        <MenuBookRoundedIcon className = "hamburger-menu" onClick={()=>setHamShow(!hamShow)}/> 
        {!!hamShow && <div className = "hamburger-div">
          <ul className = "hamburger-list">
            <li><NavLink className = "nav-links active-ham" to={"/"}>Homepage</NavLink></li>
            {MenuItems.map((item, index) => {
                return (
                  <li key={index}>
                    <NavLink
                      className={`nav-links active-ham`}
                      to={item.url}
                    >
                      {item.title}
                    </NavLink>
                  </li>
                );
              })}
          </ul>
        </div>}
      </>}
    </>
  );
}
