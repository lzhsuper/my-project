import React from 'react'
import {styled} from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';


export default function ComtoTop() {
    const MyFab = styled(Fab)({
        position: "fixed",
        zIndex:99,
        right: "50px",
        top: "80%",
    });
    return (
        <div>
            <MyFab color="secondary" size="large" aria-label="scroll back to top" onClick={() => window.scrollTo(0, 0)}>
                <KeyboardArrowUpIcon/>
            </MyFab>
        </div>
    )
}