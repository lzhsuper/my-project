import React, {useState} from 'react';
import './App.css';
import ApolloClient from 'apollo-boost'
import {gql} from 'apollo-boost'
import {BrowserRouter as Router, Redirect, withRouter} from 'react-router-dom'
import cookie from 'react-cookies'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import HOST from '../settingurl';

const useStyles = makeS tyles(theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <span color="inherit">
                Now Data
            </span>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

function Loginresult({className, loginsuccess, loginfail, loginsuccess_statu, loginsuccess_time}) {
    if (loginsuccess_statu) {
        return <Router>
            <Redirect to="/homePage"/>
        </Router>;
    }

    if (loginsuccess) {
        cookie.save('tokenaccessToken', loginsuccess.data.login.accessToken);
        cookie.save('refreshToken', loginsuccess.data.login.refreshToken);
        return (
            <div className='loginresult_suc'>
                <span className="myicon-tick-checked"/>
                <span className="locat_s">
                Login in {loginsuccess_time} seconds ...
                </span>
            </div>)

    } else if (loginfail) {
        return (
            <div className='loginresult_fail'>
                <div className="loginstatuicon">
                    <div className="myicon-tick-worring"/>
                </div>
                <span className="locat">
                Wrong account or password
                </span>
            </div>
        )
    } else {
        return <label/>;
    }
}

function Login() {
    const [result, setresult] = useState(null);
    const [error, seterror] = useState(null);
    const [loginsuccess_statu, setloginsuccess_statu] = useState(false);
    const [loginsuccess_time, setloginsuccess_time] = useState(3);
    const [username, setusername] = useState(null);
    const [password, setpassword] = useState(null);
    const classes = useStyles();

    function loginsubmit() {
        setresult(null);
        seterror(null);
        const client = new ApolloClient({
            uri: HOST,
        });
        client.query({
            query: gql`
            {
            login(mail:"${username}", password:"${password}"){
            accessToken
            refreshToken
            }}
            `
        })
            .then(result => setresult(result))
            .catch(error => seterror(error))
    }

    function changeusername(type, event) {
        if (type === 'user') {
            setusername(event.target.value)
        } else {
            setpassword(event.target.value)
        }
    }

    if (result) {
        setTimeout(() => setloginsuccess_statu(true), 3000);
        setTimeout(() => window.location.reload(), 3100);
        setInterval((timeout) => timeout = setloginsuccess_time(loginsuccess_time > 0 ? loginsuccess_time - 1 : clearInterval(timeout)), 1000)
    }

    function onKeyup(e) {
        if (e.keyCode === 13) {
            loginsubmit()
        }
    }

    return (
        <div>
            <div className="loginstatu">
                <Loginresult loginsuccess={result} loginfail={error}
                             loginsuccess_statu={loginsuccess_statu}
                             loginsuccess_time={loginsuccess_time} referce={seterror}/>
            </div>
            <div onKeyUp={(e) => onKeyup(e)} className='bigdiv'>
                <Container component="main" maxWidth="xs">
                    <CssBaseline/>
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon/>
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <TextField variant="outlined"
                                   margin="normal"
                                   required
                                   fullWidth
                                   id="username"
                                   label="Username"
                                   name="Username"
                                   autoFocus
                                   onChange={(event) => changeusername('user', event)}
                                   placeholder='Username'/>
                        <TextField variant="outlined"
                                   margin="normal"
                                   required
                                   fullWidth
                                   id="password"
                                   label="Password"
                                   name="Password"
                                   type="password"
                                   autoFocus
                                   onChange={(event) => changeusername('pwd', event)}
                                   placeholder='Password'
                        />
                        {/*<FormControlLabel*/}
                        {/*control={<Checkbox value="remember" color="primary"/>}*/}
                        {/*label="Remember me"*/}
                        {/*/>*/}
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={() => loginsubmit()}>Sign In</Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                        </Grid>
                    </div>
                    <Box mt={8}>
                        <Copyright/>
                    </Box>
                </Container>
            </div>
        </div>
    )
}

export default withRouter(Login)
