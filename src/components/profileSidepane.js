import profileImg from '../assets/user/user1.png';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import { capitalizeFirstLetter } from '../pages/common';


const ProfileSidePane = ({isopen}) => {
    const localUser = localStorage.getItem('user');
    const user = JSON.parse(localUser);
    const centerLogo = {
        width: '170px',
        height: '20px',
        display: 'block'
    }

    

    return (
        <>

            {
                isopen ? <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className={centerLogo}>
                        <img src={profileImg} alt="profile details" style={{ width: '90px' }} />
                    </div>
                    <Typography variant="h6" mt={2}>{capitalizeFirstLetter(user.role_type)}</Typography>

                    <Divider />
                    <Typography variant="body1" mt={1} textAlign="left">Menu</Typography>
                </Box> : null
            }


          
        </>
    )
}

export default ProfileSidePane;