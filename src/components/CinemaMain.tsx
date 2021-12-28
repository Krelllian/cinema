import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './CinemaMain.scss';
function CinemaMain() {

    const [movies, setMovies] = useState([])
    const [inputValue, setInputValue] = useState('')
    const [searchValue, setSearchValue] = useState('girls')
    useEffect(() => {
        async function getMovies() {
            try {
                const response = await axios.get(`https://api.tvmaze.com/search/shows?&q=${searchValue}`);
                setMovies(response.data)
            } catch (error) {
                console.error(error);
            }
        }
        getMovies()
        console.log('загрузил фильмы')
    }, [])

    const inputHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setInputValue(e.target.value)
    }

    console.log("films", movies)
    console.log(inputValue)



    return (
        <>
            <div>
                <input value={inputValue} onChange={inputHandler}></input>
            </div >
            <div className='movies'>{movies.map((movie: any) => <div className='movie' key={Math.random() + Date.now()} >
                <div>{movie.score}</div>
                <img src={movie.show.image?.medium} />
            </div>
            )}</div>
        </>
    )
}

export default CinemaMain
