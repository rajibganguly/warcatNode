import profileImg from '../assets/user/user1.png'; 

const ProfileSidePane = () => {
    const centerLogo = {
        width: '170px',
        height: '20px',
        display: 'block'
    }

    return(
        <>
            <div className={centerLogo}>
                <img src={profileImg} alt="profile details" style={{width: '90px'}} />
            </div>
            <p style={{ textAlign: 'center' }}> Admin Name </p>
        </>
    )
}

export default ProfileSidePane;