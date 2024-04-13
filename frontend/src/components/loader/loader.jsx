import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import { BallTriangle } from 'react-loader-spinner';
import LinearProgress from '@mui/material/LinearProgress';
const Loader = () => {
    return  <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 9999 }}>
       <LinearProgress  />
    </div>
}
export default Loader;