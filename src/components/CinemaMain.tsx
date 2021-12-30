import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CinemaMain.scss';
import { CSSTransition, Transition, TransitionGroup } from 'react-transition-group';


function CinemaMain() {

    const [movies, setMovies] = useState([])
    const [inputValue, setInputValue] = useState('')
    const [searchValue, setSearchValue] = useState('documentary')
    const [error, setError] = useState(false)
    const [forceRerender, setForceRerender] = useState(0)

    const re = new RegExp('<p>|</p>|<b>|</b>|<i>|</i>', 'ig');


    useEffect(() => {
        async function getMovies() {
            setError(false)
            try {
                const response = await axios.get(`https://api.tvmaze.com/search/shows?&q=${searchValue}`);
                setMovies(response.data)
            } catch (error) {
                console.log('error: ', error);
                setError(true)
            }
        }
        getMovies()
    }, [searchValue])

    const inputHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setInputValue(e.target.value)
    }
    const popUpHandler: React.MouseEventHandler<HTMLDivElement> = (e) => {
        e.currentTarget.nextElementSibling?.classList.toggle("active");
        document.querySelector('body')?.classList.toggle("lock")
    }
    const removePopUp: React.MouseEventHandler<HTMLDivElement> = (e) => {
        e.currentTarget.classList.toggle("active");
        document.querySelector('body')?.classList.toggle("lock")
        e.stopPropagation();
    }
    const formHandler: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        setSearchValue(inputValue);
        setInputValue('');
    }
    const sortByScoreHighLow: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        let sortedMovie = movies.sort((a: any, b: any) => b.score - a.score)
        setMovies(sortedMovie)
        setForceRerender(forceRerender + 1)
    }
    const sortByScoreLowHigh: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        let sortedMovie = movies.sort((a: any, b: any) => a.score - b.score)
        setMovies(sortedMovie)
        setForceRerender(forceRerender + 1)
    }

    return (
        <>
            <form onSubmit={formHandler}>
                <input className='cinema_input' placeholder='Search movie' value={inputValue} onChange={inputHandler}></input>
            </form >
            <div className='sort-btns'>
                <button className='sort-btn sort-btn--HighLow' onClick={sortByScoreHighLow}>Sort by score(from highest to lowest)</button>
                <button className='sort-btn sort-btn--LowHigh' onClick={sortByScoreLowHigh}>Sort by score(from lowest to highest)</button>
            </div>
            {movies?.length === 0 && <div className='error'>Movie not found, try changing your search parameters</div>}

            <div className='movies'>
                {movies.map((movie: any) => (

                    movie.show.image?.medium && <><div onClick={popUpHandler} className='movie' key={Math.floor(Math.random() * 100000) + movie.show.id} >
                        <h3 className='movie_name'>{movie.show.name}</h3>
                        {console.log(typeof movie)}
                        <div className='movie_year'> <span>{movie.show.premiered?.substring(0, 4)}</span></div>
                        <div className='movie_score'>Movie rating: <span>{(movie.score * 10).toFixed(1).replace(/.0/gi, "")}</span>/10</div>
                        <img className='movie_img' src={movie.show.image?.medium} />
                    </div>
                        <div className='movie_popup-wrapper' onClick={removePopUp} key={'PopUp' + movie.show.id}>
                            <div className='movie_popup' style={{
                                backgroundBlendMode: 'multiply',
                                backgroundImage: `url(${movie.show.image?.original})`,
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: 'cover',
                                backgroundColor: 'rgba(36, 36, 36, 0.9)',
                            }}>
                                <h3 className='movie_popup-name'>{movie.show.name}</h3>
                                {movie.show.genres.length !== 0 ? <div>Film genre: {movie.show.genres?.join(', ')}</div> : ''}
                                <div className='movie_popup-desc'>{typeof movie.show.summary === 'string' ? movie.show.summary.replace(re, "") : "No description of the film"}</div>
                            </div>
                        </div>
                    </>
                )
                )}
            </div>
        </>
    )
}

export default CinemaMain
