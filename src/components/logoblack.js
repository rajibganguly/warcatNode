import logo from '../assets/logo.png'; 
import { Link } from 'react-router-dom';

const LogoBlack = () => {
    
    const centerLogo = {
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
    }

    return (
        <div style={centerLogo}>
            <Link to="/">
                <img src={logo} alt="logo" style={{ width: '110px' }} />
            </Link>
        </div>
    )
}

export default LogoBlack;
