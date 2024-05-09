import profileImg from '../assets/user/user1.png';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

const ProfileSidePane = ({isopen}) => {
    const centerLogo = {
        width: '170px',
        height: '20px',
        display: 'block'
    }

    const lstoreUser = JSON.parse(localStorage.getItem('user'));
    const userName = (lstoreUser.email).split('@')[0];

    return (
        <>

            {
                isopen ? <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className={centerLogo}>
                        <img src={profileImg} alt="profile details" style={{ width: '90px' }} />
                    </div>
                    <Typography variant="h6" mt={2}>
                    <span style={{textTransform: 'uppercase'}}>{lstoreUser.role_type}</span>-{userName}
                    </Typography>

                    <Divider />
                    <Typography variant="body1" mt={1} textAlign="left">Menu</Typography>
                </Box> : null
            }


          
        </>
    )
}

export default ProfileSidePane;