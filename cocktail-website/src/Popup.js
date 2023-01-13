import React,{useEffect,useState} from 'react'
import CloseIcon from '@mui/icons-material/Close';
import './Popup.css'
import Axios from 'axios';
import RandomCocktail from './CocktailDetails';

export default function Popup(props) {
    const [cocktailDetails, setDetails]=useState([])
    const [close, setClose]=useState(false)

    function closeIconClicked(){
        setClose(!close)
        props.setHidden(true)
    }

    useEffect(()=>{
        Axios.get('https://www.thecocktaildb.com/api/json/v1/1/search.php?s='+props.cocktail.replace(/ /g,"_")).then((response)=>{
            // console.log(response.data.drinks[0])
            setDetails(response.data.drinks[0]);
        })
    },[props.cocktail])

    return (
        <>
        

        <div className={props.isHidden && close ? 'popup-box slideout ' : props.isHidden? 'popup-box hidden' : 'popup-box slidein'}>
            <CloseIcon className='close-icon-popup' onClick={()=>closeIconClicked()}/>
            
            <div className='popup-header'>{props.cocktail}
            {/* <br />
            <img 
            alt='cocktail' 
            className ='popup-image'
            // className ='cocktail-image-home'
            // className={props.isHidden && close ? 'popup-box slideout ' : props.isHidden? 'popup-box hidden' : 'popup-box slidein'}
            src={cocktailDetails.strDrinkThumb}></img> */}
            </div>
            
            <RandomCocktail cocktail={cocktailDetails} homepage={false} popup={true}/>
        </div>
        </>
    )
}
