import { Link } from 'react-router-dom'
import '../styles/footer.css'
// import {date} from 'date-fns'

const Footer = () => {
    return (
        <footer style={{ backgroundColor: '#f8f9fa', padding: '20px 0', textAlign: 'center' 
            , borderTop: '1px solid #e7e7e7' , position: 'fixed', bottom: '0', width: '100%' 
        }} className="footer">
            <div style={{ maxWidth: '1200px', margin: '0 auto' 
                , padding: '0 20px' , 
             }} className="footer-content">
                <p style={{
                    margin: '0'
                    , color: '#6c757d', fontSize: '14px'
                    , textAlign: 'center',
                }}>&copy; {new Date().getFullYear()} Shopnest. All rights reserved.</p>
                <ul style={{
                    listStyle: 'none', padding: '0'
                    , display: 'flex', justifyContent: 'center', gap: '15px'
                    , marginTop: '10px'
                }} className="footer-links">
                    <li><Link to="/about">About Us</Link></li>
                    <li><Link to="/disclaimer">Disclaimer</Link></li>
                    <li><Link to="/return-policy">Return Policy</Link></li>
                    
                </ul>
            </div>
        </footer>
    )
}


export default Footer;