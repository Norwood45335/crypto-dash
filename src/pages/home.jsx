import CoinCard from "../components/CoinCard";
import LimitSelector from "../components/LimitSelector";
import FilterInput from "../components/FilterInput";
import SortSelector from "../components/SortSelector";
import Spinner from "../components/Spinner";

const HomePage = ({
    coins,
    filter,
    setFilter,
    limit,
    setLimit,
    sortBy,
    setSortBy,
    loading,
    error
}) => {
    const filteredCoins = coins.filter((coin) => {
    return coin.name.toLowerCase().includes(filter.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(filter.toLowerCase())
  })

    .slice()
    .sort((a, b) => {
      switch(sortBy){
        case 'market_cap_desc':
          return b.market_cap - a.market_cap;
        case 'market_cap_asc':
          return a.market_cap - b.market_cap;
        case 'price_desc':
          return b.current_price - a.current_price;
        case 'price_asc':
          return a.current_price - b.current_price;
        case 'change_desc':
          return b.price_change_percentage_24h - a.price_change_percentage_24h;
        case 'change_asc':
          return a.price_change_percentage_24h - b.price_change_percentage_24h;
      }
    })
    return ( 
    <div>
      {/* Hero Section with Background Video */}
      <div className="hero-section">
        <video 
          className="hero-video"
          autoPlay 
          loop 
          muted 
          playsInline
          preload="auto"
          onError={(e) => console.error('Video failed to load:', e)}
        >
          <source src="/coins_falling.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">Crypto Dash</h1>
            <p className="hero-subtitle">Track cryptocurrency prices in real-time</p>
          </div>
        </div>
      </div>

      <div className="main-content">
        {loading && <Spinner color='white' />}
        {error && <div className='error'>{error}</div>}

        <div className="top-controls">
        <FilterInput filter={filter} onFilterChange={setFilter}/>
        <LimitSelector limit={limit} onLimitChange={setLimit}/>
        <SortSelector sortBy={sortBy} onSortChange={setSortBy} />
        </div>

        {!loading && !error && (
          <main className="grid">
            {filteredCoins.length> 0 ? filteredCoins.map((coin) => (
              <CoinCard key={coin.id} coin={coin} />
            )) : (
              <p>No matching coins</p>
            )}
          </main>
        )}
      </div>
    </div> );
}
 
export default HomePage;