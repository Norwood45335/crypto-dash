import { Link, useParams } from "react-router";
import { useState, useEffect, useMemo } from "react";
import Spinner from "../components/Spinner";
import CoinChart from "../components/CoinChart";

const API_URL = import.meta.env.VITE_COIN_API_URL;

const CoinDetailsPage = () => {
    const {id} = useParams()
    const [coin, setCoin] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [hoverPoint, setHoverPoint] = useState(null)

    useEffect(() => {
        const fetchCoin = async () => {
            try {
                const res = await fetch(`${API_URL}/${id}`);
                if(!res.ok) throw new Error('Failed to fetch data')
                const data = await res.json()
                setCoin(data)
            }catch(err){
                console.log(err)
                setError(err.message)
            }finally{
                setLoading(false)
            }
        }
        if (id) {
            fetchCoin()
        }
    }, [id])

    const currentPrice = useMemo(() => {
        if (!coin?.market_data?.current_price?.usd) return null
        return coin.market_data.current_price.usd
    }, [coin])

    const priceChange24h = coin?.market_data?.price_change_percentage_24h || 0
    const isUp = priceChange24h >= 0

    return <div className="coin-details-container">
        <Link to='/' className="back-link">← Back to Home</Link>
        {coin && (
            <section className="coin-hero">
                <div className="coin-hero-left">
                    <img 
                        src={coin.image?.large || coin.image?.small || ''} 
                        alt={coin.name || 'Coin'} 
                        className='coin-hero-image'
                    />
                    <div>
                        <h1 className="coin-hero-title">{coin.name || 'Unknown'} <span className="symbol-pill">{(coin.symbol || '').toUpperCase()}</span></h1>
                        <div className="hero-sub">
                            <span className="rank-pill">Rank #{coin.market_cap_rank || 'N/A'}</span>
                            <span className={`change-pill ${isUp ? 'up' : 'down'}`}>{isUp ? '▲' : '▼'} {Math.abs(priceChange24h).toFixed(2)}%</span>
                        </div>
                    </div>
                </div>
                <div className="coin-hero-right">
                    <div className="price-large">${currentPrice?.toLocaleString()}</div>
                    {hoverPoint && (
                        <div className="hover-readout">
                            <div className="hover-price">${hoverPoint.price.toLocaleString()}</div>
                            <div className="hover-meta">
                                <span>{new Date(hoverPoint.time).toLocaleString()}</span>
                                {currentPrice && (
                                    <span className={`delta ${hoverPoint.price - currentPrice >= 0 ? 'up' : 'down'}`}>
                                        {(hoverPoint.price - currentPrice >= 0 ? '+' : '')}{(hoverPoint.price - currentPrice).toFixed(2)}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        )}
        {!coin && <h1 className="coin-details-title">Coin Details</h1>}
        {loading && <Spinner />}
        {error && <div className='error'>❌ {error}</div>}
        {!loading && !error && (
            <>
                <p className="coin-details-description fade-in">{coin.description?.en?.split('. ')[0] + '.' || 'No description available.'}</p>

                <div className="coin-stats-grid">
                    <div className="stat-card">
                        <span className="label">Market Cap</span>
                        <span className="value">${coin.market_data?.market_cap?.usd?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div className="stat-card">
                        <span className="label">24h High</span>
                        <span className="value">${coin.market_data?.high_24h?.usd?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div className="stat-card">
                        <span className="label">24h Low</span>
                        <span className="value">${coin.market_data?.low_24h?.usd?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div className="stat-card">
                        <span className="label">24h Change</span>
                        <span className={`value ${isUp ? 'up' : 'down'}`}>{isUp ? '+' : ''}{coin.market_data?.price_change_24h?.toFixed(2) || '0.00'} (${coin.market_data?.price_change_percentage_24h?.toFixed(2) || '0.00'}%)</span>
                    </div>
                    <div className="stat-card">
                        <span className="label">Circulating Supply</span>
                        <span className="value">{coin.market_data?.circulating_supply?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div className="stat-card">
                        <span className="label">Total Supply</span>
                        <span className="value">{coin.market_data?.total_supply?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div className="stat-card">
                        <span className="label">All-Time High</span>
                        <span className="value">${coin.market_data?.ath?.usd?.toLocaleString() || 'N/A'} • {coin.market_data?.ath_date?.usd ? new Date(coin.market_data.ath_date.usd).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className="stat-card">
                        <span className="label">All-Time Low</span>
                        <span className="value">${coin.market_data?.atl?.usd?.toLocaleString() || 'N/A'} • {coin.market_data?.atl_date?.usd ? new Date(coin.market_data.atl_date.usd).toLocaleDateString() : 'N/A'}</span>
                    </div>
                </div>

                <CoinChart coinId={coin.id} onHoverPoint={setHoverPoint} />

                <div className="coin-details-links">
                    {coin.links?.homepage?.[0] && (
                        <p>
                            🌐{' '}
                            <a
                                href={coin.links.homepage[0]}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Website
                            </a>
                        </p>
                    )}
                    {coin.links?.blockchain_site?.[0] && (
                        <p>
                            🔗{' '}
                            <a
                                href={coin.links.blockchain_site[0]}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Blockchain Explorer
                            </a>
                        </p>
                    )}
                    {coin.categories?.length > 0 && (
                        <p>Categories: {coin.categories.join(', ')}</p>
                    )}
                </div>
            </>
        )}
        {!loading && !error && !coin && <p>No Data Found!</p>}
    </div>;
}
 
export default CoinDetailsPage;