
import Typography from '@mui/material/Typography';

const Footer = (props) => {
    return(
        <>
        <Typography variant="body2" color="text.secondary" align="left" style={{paddingLeft: '26px'}} {...props}>
      {'2024 © WARCAT - War-room Assistant for Report Compilation & Task tracking. '}{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
        </>
    )
}

export default Footer