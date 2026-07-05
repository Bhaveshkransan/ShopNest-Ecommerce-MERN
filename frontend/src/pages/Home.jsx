import { useEffect, useState } from "react";
import ProductCard from "../components/ProductsCard";

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // Your effect logic here
        const fetchProducts = async () => {
            try {
                const response = await fetch("/api/products");
                const data = await response.json();
                setProducts(data); 
            } catch (error) {
                console.error("Error fetching products:", error);
            }
            finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    return (
        <div className="home-container">
             <div className="hero-banner">
                <h1>Welcome to Shopnest</h1>
                </div>
            <h2>Featured Products</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="products-grid">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Home
