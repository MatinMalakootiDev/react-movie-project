import { useEffect, useState } from 'react'
import Search from './components/Search'
import Spinner from './components/spinner'
import MovieCard from './components/MovieCard'
import LoadMore from './components/LoadMore'
import { useDebounce } from 'react-use'
import { updateSearchCount, getTrendingMovies } from './appwrite'

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce the search term to prevent making too many API requests
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  }

  const fetchMovies = async (query = '', page = 1) => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const endpoint = query
        ? `https://moviesapi.ir/api/v1/movies?q=${encodeURIComponent(query)}`
        : `https://moviesapi.ir/api/v1/movies?page=${page}`

      const response = await fetch(endpoint)

      if (!response.ok) throw new Error('Failed to fetch movies')

      const data = await response.json()

      if (query) {
        setMovieList(data.data || []);
      } else {
        setMovieList((prev) => (page === 1 ? data.data : [...prev, ...data.data]));
      }

      if (query && data.data?.length > 0) {
        updateSearchCount(query, data.data[0]);
      }

    } catch (error) {
      console.error(`Error: ${error}`)
      setErrorMessage('خطا در دریافت اطلاعات. لطفا دوباره تلاش کنید.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setCurrentPage(1)
    fetchMovies(debouncedSearchTerm, 1)
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1
    setCurrentPage(nextPage)
    fetchMovies(searchTerm, nextPage)
  }

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="hero banner" />
          <h1 className="mt-[32px]">
            به سادگی <span className="text-gradient">فیلم‌هایی</span> را پیدا کنید که از تماشایشان لذت میبرید
          </h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>فیلم‌های محبوب</h2>
            <ul className="text-left">
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2>تمامی فیلم ها</h2>

          {errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <>
              <ul className="text-left">
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>

              {!searchTerm && movieList.length > 0 && (
                <LoadMore onClick={handleLoadMore} isLoading={isLoading} />
              )}
            </>
          )}

          {isLoading && movieList.length === 0 && <Spinner />}
        </section>
      </div>
    </main>
  )
}

export default App
