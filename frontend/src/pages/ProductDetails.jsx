import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import '../styles/ProductDetails.css';

const sentimentConfig = {
  Positive: { emoji: '😊', color: '#10b981', bg: '#d1fae5', label: 'Positive Review' },
  Neutral:  { emoji: '😐', color: '#f59e0b', bg: '#fef3c7', label: 'Neutral Review' },
  Negative: { emoji: '😞', color: '#ef4444', bg: '#fee2e2', label: 'Negative Review' },
};

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    // Review states
    const [review, setReview] = useState('');
    const [sentiment, setSentiment] = useState(null);
    const [sentimentLoading, setSentimentLoading] = useState(false);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/products/${id}`);
                const data = await response.json();
                setProduct(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        dispatch(addToCart(product));
    };

    const handleSubmitReview = async () => {
        if (!review.trim()) return;
        setSentimentLoading(true);
        setSentiment(null);
        try {
            const res = await fetch('/api/ai/analyze-sentiment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ review }),
            });
            const data = await res.json();
            const result = data.sentiment || 'Neutral';
            setSentiment(result);
            setReviews((prev) => [
                { text: review, sentiment: result, time: new Date().toLocaleTimeString() },
                ...prev,
            ]);
            setReview('');
        } catch {
            setSentiment('Neutral');
        } finally {
            setSentimentLoading(false);
        }
    };

    if (loading) return <h2>Loading...</h2>;
    if (!product) return <h2>Product not found.</h2>;

    return (
        <div className="product-details">
            <div className="product-image-section">
                <img src={product.imageUrl} alt={product.name} />
            </div>

            <div className="product-info-section">
                <h1>{product.name}</h1>
                <p>{product.description}</p>
                <h2>₹{product.price}</h2>

                <button onClick={handleAddToCart}>
                    Add to Cart
                </button>

                <Link to="/">← Back to Products</Link>

                {/* ─── AI Sentiment Review Section ─── */}
                <div style={{
                    marginTop: '32px',
                    background: '#f8fafc',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid #e2e8f0',
                }}>
                    <h3 style={{ margin: '0 0 6px', fontSize: '16px', color: '#1e293b' }}>
                        ⭐ Leave a Review
                    </h3>
                    <p style={{ margin: '0 0 14px', fontSize: '13px', color: '#64748b' }}>
                        AI will instantly analyze the sentiment of your review
                    </p>

                    <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Share your thoughts about this product..."
                        rows={3}
                        style={{
                            width: '100%',
                            borderRadius: '10px',
                            border: '1.5px solid #e2e8f0',
                            padding: '10px 14px',
                            fontSize: '14px',
                            resize: 'vertical',
                            outline: 'none',
                            fontFamily: 'inherit',
                            boxSizing: 'border-box',
                            transition: 'border-color 0.2s',
                            background: 'white',
                            color: '#1e293b',
                        }}
                        onFocus={e => e.target.style.borderColor = '#6366f1'}
                        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                    />

                    <button
                        onClick={handleSubmitReview}
                        disabled={!review.trim() || sentimentLoading}
                        style={{
                            marginTop: '10px',
                            background: "#0f172a",
                            color: 'white',
                            border: 'none',
                            borderRadius: '25px',
                            padding: '10px 22px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: !review.trim() || sentimentLoading ? 'not-allowed' : 'pointer',
                            opacity: !review.trim() || sentimentLoading ? 0.6 : 1,
                            transition: 'all 0.2s',
                        }}
                    >
                        {sentimentLoading ? '🤖 Analyzing...' : '🤖 Submit & Analyze'}
                    </button>

                    {/* Reviews List */}
                    {reviews.length > 0 && (
                        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <h4 style={{ margin: '0 0 4px', fontSize: '14px', color: '#475569' }}>
                                Recent Reviews
                            </h4>
                            {reviews.map((r, i) => {
                                const cfg = sentimentConfig[r.sentiment] || sentimentConfig.Neutral;
                                return (
                                    <div
                                        key={i}
                                        style={{
                                            background: 'white',
                                            border: `1.5px solid ${cfg.color}30`,
                                            borderRadius: '12px',
                                            padding: '12px 16px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '6px',
                                        }}
                                    >
                                        <p style={{ margin: 0, fontSize: '14px', color: '#1e293b' }}>{r.text}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <span
                                                style={{
                                                    background: cfg.bg,
                                                    color: cfg.color,
                                                    borderRadius: '20px',
                                                    padding: '3px 12px',
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                }}
                                            >
                                                {cfg.emoji} {cfg.label}
                                            </span>
                                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>⚡ AI • {r.time}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;