import { BrowserRouter as Router,Routes, Route} from "react-router-dom";
import Navbar from "./Navbar.js";
import Home from "./Home.js";
import AllCocktails from "./AllCocktails";
import SearchedCocktail from './SearchedCocktail'
import Liquor from "./Liquor";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/all" element={<AllCocktails />} />
            <Route path='/searched' element={<SearchedCocktail />} />
            <Route path="/vodka" element={<Liquor alcohol="Vodka" />} />
            <Route path="/gin" element={<Liquor alcohol="Gin" />} />
            <Route path="/tequila" element={<Liquor alcohol="Tequila" />} />
            <Route path="/whiskey" element={<Liquor alcohol="Whiskey" />} />
            <Route path="/brandy" element={<Liquor alcohol="Brandy" />} />
            <Route path="/rum" element={<Liquor alcohol="Rum"/>} />
            <Route path="/vermouth" element={<Liquor alcohol="Vermouth" />} />
            {/* <Route element={<PageNotFound />} /> */}

          </Routes>
      </Router>
    </>
  );
}

export default App;
