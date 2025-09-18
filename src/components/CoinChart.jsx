import { useState, useEffect, useMemo } from "react";
import { Line } from "react-chartjs-2";
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    TimeScale
} from "chart.js";
import 'chartjs-adapter-date-fns';
import Spinner from "./Spinner";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    TimeScale
)

const API_URL = import.meta.env.VITE_COIN_API_URL

const CoinChart = ({coinId, onHoverPoint, currentPrice}) => {
    const [chartData, setChartData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [days, setDays] = useState(7)

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const res = await fetch(`${API_URL}/${coinId}/market_chart?vs_currency=usd&days=${days}`)
                if (!res.ok) throw new Error('Failed to fetch chart data')
                const data = await res.json()
                const prices = data.prices.map((price) => ({
                    x: price[0],
                    y: price[1]
                }))            
                setChartData({
                    datasets: [
                        {
                            label: 'Price (USD)',
                            data: prices, 
                            fill: true,
                            borderColor: '#007bff',
                            backgroundColor: 'rgba(0, 123, 255, 0.1)',
                            pointRadius: 0,
                            tension: 0.3,
                        }                    
                    ]
                })
            } catch (error) {
                console.error('Chart fetch error:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchPrices()
    }, [coinId, days])

    const options = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        resizeDelay: 0,
        interaction: { 
            mode: 'index', 
            intersect: false,
            axis: 'x'
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                enabled: false,
                external: (ctx) => {
                    const { chart, tooltip } = ctx
                    if (!onHoverPoint) return
                    if (tooltip && tooltip.dataPoints && tooltip.dataPoints.length > 0) {
                        const p = tooltip.dataPoints[0]
                        const x = p.parsed.x
                        const y = p.parsed.y
                        
                        // Calculate price change from current price
                        let priceChange = null
                        let priceChangePercent = null
                        if (currentPrice) {
                            priceChange = y - currentPrice
                            priceChangePercent = ((y - currentPrice) / currentPrice) * 100
                        }
                        
                        onHoverPoint({ 
                            time: x, 
                            price: y,
                            priceChange,
                            priceChangePercent,
                            formattedTime: new Date(x).toLocaleString(),
                            formattedPrice: `$${y.toLocaleString()}`
                        })
                    } else {
                        onHoverPoint(null)
                    }
                }
            }
        },
        scales: {
            x: {
                type: 'time',
                time: { unit: days <= 7 ? 'hour' : 'day' },
                ticks: { autoSkip: true, maxTicksLimit: 7 },
                grid: { color: 'rgba(255,255,255,0.06)' }
            },
            y: {
                ticks: { callback: (value) => `$${value.toLocaleString()}` },
                grid: { color: 'rgba(255,255,255,0.06)' }
            }
        },
        elements: {
            point: { 
                radius: 0, 
                hoverRadius: 6,
                hoverBorderWidth: 2,
                hoverBorderColor: '#58a6ff',
                hoverBackgroundColor: '#ffffff'
            },
            line: { borderWidth: 2 }
        },
        animation: { duration: 300, easing: 'easeOutQuart' }
    }), [onHoverPoint, days, currentPrice])

    const ranges = [
        { label: '24H', value: 1 },
        { label: '7D', value: 7 },
        { label: '30D', value: 30 },
        { label: '90D', value: 90 },
        { label: '1Y', value: 365 }
    ]

    return <div className="chart-section">
        <div className="range-controls">
            {ranges.map(r => (
                <button
                    key={r.value}
                    className={`range-btn ${days === r.value ? 'active' : ''}`}
                    onClick={() => { setLoading(true); setDays(r.value) }}
                >{r.label}</button>
            ))}
        </div>
        <div className="chart-wrapper" style={{ position: 'relative' }}>
            {chartData && (
                <Line 
                    data={chartData}
                    options={options}
                />
            )}
            {loading && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10
                }}>
                    <Spinner />
                </div>
            )}
        </div>
    </div>
}
 
export default CoinChart;