
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

const Footer = (props) => {
    return(
        <>
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'2024 © WARCAT - War-room Assistant for Report Compilation & Task tracking. '}{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
        </>
    )
}

export default Footer