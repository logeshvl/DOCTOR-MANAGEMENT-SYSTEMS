import Drawer from '@mui/material/Drawer';

const RightSideBar = (props) => {
    return (<Drawer
        anchor={'right'}
        open
        // onClose={toggleDrawer(anchor, false)}
    >
        {props.handleContent()}
    </Drawer>);
}
export default RightSideBar;