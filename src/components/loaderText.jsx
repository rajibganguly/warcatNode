import '../App.css';
import logo from '../assets/logo-black.png'
import '../../src/assets/style/loader.css';

const LoaderText = () => {
    const loaderBg = {
        background: 'rgba(217,231,245,0.8)',
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: '0',
        left: '0',
        zIndex: '999'
    }

    return (
        <div style={loaderBg}>
            <div className="loader">
                <img src={logo} alt="Govt." />
                {/* <p>Loading...</p> */}
                <div className="animation"></div>
            </div>
        </div>
    )
}

export default LoaderText;