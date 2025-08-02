import { useState, useEffect } from "react";
import HomePage from "./pages/home";
import { Routes, Route } from "react-router";
import AboutPage from "./pages/about";
import Header from "./components/Header";
import NotFoundPage from "./pages/not-found";
import CoinDetailsPage from "./pages/coin-details";

//the endpoint for the request
const API_URL = import.meta.env.VITE_API_URL;

const App = () => {
  //setting to empty array
  const [coins, setCoins] = useState([]);

  //set to false when data is done being fetched
  const [loading, setLoading] = useState(true)

  const [error, setError] = useState(null)
  const [limit, setLimit] = useState(10)
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('market_cap_desc')

  //fetches data from API
  useEffect(() => {
    const fetchCoins = async () => {
      try{
        const res = await fetch(`${API_URL}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`)
        if(!res.ok) throw new Error('Failed to fetch data')
        const data = await res.json()        
        setCoins(data)
      }catch(err){
        setError(err.message)
      }finally{
        setLoading(false)
      }
    }
    fetchCoins()
  }, [limit])

  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<HomePage 
          coins={coins}
          filter={filter}
          setFilter={setFilter}
          limit={limit}
          setLimit={setLimit}
          sortBy={sortBy}
          setSortBy={setSortBy}
          loading={loading}
          error={error}
        />} />
        <Route path='/about' element={<AboutPage/>} />
        <Route path='/coin/:id' element={<CoinDetailsPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
 
export default App;