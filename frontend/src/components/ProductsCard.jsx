import { Link } from 'react-router-dom'
import '../styles/ProductsCard.css'

const ProductsCard = ({ product }) => {
    return (
        <div className="product-card">
            <img src={product.imageUrl} alt={product.name} />
            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">${product.price}</p>
                <Link to={`/product/${product._id}`} className="btn btn-primary">
                    View Details
                </Link>
            </div>
        </div>
    )
}

export default ProductsCard