import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import '../styles/ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

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

    if (loading) {
        return <h2>Loading...</h2>;
    }

    if (!product) {
        return <h2>Product not found.</h2>;
    }

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
            </div>

        </div>
    );
};

export default ProductDetails;