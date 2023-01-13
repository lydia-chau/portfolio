import React from 'react'
import {NavLink} from "react-router-dom";
import {useLocation,useNavigate} from "react-router-dom";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';



export default function AllCocktails(props) {
    // let emptyArr=[];
    // const [finalList, setFinal]=useState([]);
    let location = useLocation();
    console.log(location);
    let incomingResults=location.state.filteredCocktails;
    const navigate = useNavigate();


    // function sortList(list){
    //     var sortedList=list.slice(0);
    //     sortedList.sort((a,b)=>{
    //       return a.strDrink.localeCompare(b.strDrink)
    //     })
    //     return sortedList
    // }

    // function triggered(){

        // useEffect(()=>{
        //     for (var i=97; i<123; i++){
        //         emptyArr.push(Axios.get(
        //             "https://www.thecocktaildb.com/api/json/v1/1/search.php?f="+String.fromCharCode(i)))
        //     }
            
        //     Axios.all(emptyArr).then(
        //       Axios.spread((...responseArr) => {
        //           let finalArray=[];
    
        //         for (var j=0; j<26; j++){
        //             finalArray.push(responseArr[j].data.drinks);
        //         }
        //         let anotherArray=[];
        //         for (var z=0; z<26; z++){
        //             if(finalArray[z]!==null){
        //                 anotherArray.push(...finalArray[z]);
        //             }
                   
        //         }
        //         setFinal(anotherArray.splice(0));
                
        //       })
        //     );
        // },[])
        
    // }

    function cocktailClicked(){
        console.log('cocktail clicked');
        console.log(location.state);
    }

    return (

        // NOTE: MAY HAVE TO CREATE A DUPLICATE ALL COCKTAILS, SEPERATE FROM THIS FILTERED RESULTS PAGE
        //CURRENTLY WHEN CLICK ON A COCKTAIL FROM ALL COCKTAILS LIST, ONLY GOES BACK TO HOMEPAGE
        <div>  
            <button onClick={() => navigate('/') }className='back-to-search'><ArrowBackIosIcon />
             Home
            </button>
             {location.state.search && incomingResults.length>0 && <h1 className="cocktail-heading">{incomingResults.length} Result(s) for '{location.state.search}'</h1> }

             {location.state.search && incomingResults.length===0 && <h1 className="cocktail-heading">
                 Bummer! 0 Results for '{location.state.search}'. Try searching for cocktails by categories :)
            </h1>}

             {!location.state.search && <h1 className="cocktail-heading">All Cocktails</h1>}

             <ul className ='cocktail-list'>
                {incomingResults.length > 0 ? 
                incomingResults.map((item,index)=>{
                    return(
                        <NavLink to="/searched"
                            state={{cocktail:item, prevPath: location.pathname, filteredCocktails:incomingResults, search: location.state.search, }}
                            // state={{cocktail:item, prevPath: location.pathname}}
                            onClick={()=>cocktailClicked()}
                            className='cocktail-name'
                            key={index}>
                            {item.strDrink}
                        </NavLink>
                    )
                }) : <></>}
                
             </ul>
            {/* <button onClick={()=>triggered()}>BUTTON HERE</button> */}
        </div>
    )
}

