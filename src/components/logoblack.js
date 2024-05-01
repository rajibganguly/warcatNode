import logo from '../assets/logo.png'; 

const LogoBlack = () => {
    const centerLogo = {
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
    }

    return(
        <>
            <div style={centerLogo}>
                <img src={logo} alt="logo" style={{width: '110px'}} />
            </div>
        </>
    )
}

export default LogoBlack;