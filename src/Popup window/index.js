import React from 'react'
import './Popup window.css'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function Popup_window({title, content, fun, surebutton, oneselect}) {
    return (
        <div>
            <Dialog
                open={true}
                onClose={() => fun(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {oneselect === 1 ? null :
                        <Button onClick={() => fun(false)} color="primary">
                            Disagree
                        </Button>}
                    <Button onClick={() => fun('sure')} color="primary" autoFocus>
                        {surebutton || 'Agree'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>

    )
}
