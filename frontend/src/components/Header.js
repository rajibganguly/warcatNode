import logo from '../assets/logo.jpg'; 

const Header = () => {
    const centerLogo = {
        width: '170px',
        height: '20px',
        display: 'block'
    }

    return(
        <>
            <div className={centerLogo}>
                <img src={logo} alt="logo" style={{width: '170px'}} />
            </div>
        </>
    )
}

export default Header;