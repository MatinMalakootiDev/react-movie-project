import React from 'react'

const MovieCard = ({ movie:
  { title, poster, year, country, imdb_rating } }) => {
  return (
    <div className="movie-card">
      <img src={poster} alt={title} />
      <div className="mt-4">
        <h3>{title}</h3>

        <div className="content">
          <div className="flex flex-row-reverse">
            <p className="text-white font-bold">:imdb</p>
            <p className="text-yellow-400">{imdb_rating}</p>
          </div>
          <span>●</span>
          <p className="year">{year}</p>
          <span>●</span>
          <p className='country'>{country}</p>
        </div>
      </div>
    </div>
  )
}

export default MovieCard
