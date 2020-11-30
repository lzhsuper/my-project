import React, { useState } from 'react'
import './AddLanguage.css'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { styled } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import ApolloClient from 'apollo-boost'
import { gql } from 'apollo-boost'
import cookie from 'react-cookies'
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import PopupWindow from '../Popup window';
import HOST from '../settingurl';

const MySelect = styled(TextField)({
    margin: 0,
    padding: 0,
    '& label': {
        fontSize: '20px'
    },
    '& div': { width: '150px' }
});
const projectid = [{ id: "1", name: "ToC" }, { id: "2", name: "ToB_Manager" }, { id: "3", name: "ToB_Staff" }, {
    id: "4",
    name: "Web"
}];
const MyButton = styled(Button)({
    margin: "auto",
});
const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    margin: {
        margin: theme.spacing(1),
    },
    withoutLabel: {
        marginTop: theme.spacing(3),
    },
    textField: {
        width: 200,
    },
}));
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddLanguage({ title, fun, projectfrom, seterror }) {
    const classes = useStyles();
    const [English, setEnglish] = useState('');
    const [projectId, setprojectId] = useState(projectfrom);
    const [transResult, settransResult] = useState({ data: { trans: { en: "", es: "", ko: "", ja: "", sk: "", cs: "", fr: "", pt: "", zh: "" } } });
    const [tosubmit, settosubmit] = useState(false);
    const [result, setresult] = useState(null);
    const [nullable, setnullable] = useState(false);
    const [loading, setloading] = useState(false);
    const [englisherror, setenglisherror] = useState(false);
    const [label, setlabel] = useState('');
    const [modelname, setmodelname] = useState('app');

    function ChangeEnglish(value) {
        // if (!testtext(value.target.value)) {
        //     setloading(true);
        //     setenglisherror(true);
        // } else {
        //     setenglisherror(false);
        //     setloading(false)
        // }
        value = value.target.value;
        setEnglish(value);
    }

    // function testtext(value) {
    //     const regEn = /[`~;[\]]/im,
    //         regCn = /[????????????????????????????|??????????????[\]]/im;
    //     if (regEn.test(value) || regCn.test(value)) {
    //         return false;
    //     } else {
    //         return true
    //     }
    // }

    function Changelanguage(value, type) {
        const transResultResult = JSON.parse(JSON.stringify(transResult));
        if (type === 'en') {
            setEnglish(value.target.value);
            transResultResult.data.trans.en = value.target.value
        } else if (type === 'es') {
            transResultResult.data.trans.es = value.target.value
        } else if (type === 'ja') {
            transResultResult.data.trans.ja = value.target.value
        } else if (type === 'ko') {
            transResultResult.data.trans.ko = value.target.value
        } else if (type === 'sk') {
            transResultResult.data.trans.sk = value.target.value
        } else if (type === 'cs') {
            transResultResult.data.trans.cs = value.target.value
        } else if (type === 'fr') {
            transResultResult.data.trans.fr = value.target.value
        } else if (type === 'pt') {
            transResultResult.data.trans.pt = value.target.value
        } else if (type === 'zh') {
            transResultResult.data.trans.zh = value.target.value
        }
        settransResult(transResultResult)
    }

    function settoSubmitResult(result) {
        settransResult(result);
        setloading(false);
        settosubmit(true)
    }

    function finallResult(result) {
        if (result.data) {
            setresult('submitted')
        }
    }

    function EnglishSubmit() {
        const client = new ApolloClient({
            uri: HOST,
            headers: {
                token: cookie.load('tokenaccessToken'),
            },
        });
        let NewtransResult = [];
        Object.keys(transResult.data.trans).map(item =>
            NewtransResult[item] = transResult.data.trans[item]);
        Object.keys(NewtransResult).map(item => {
            NewtransResult[item] = NewtransResult[item].replace(/\\/g, "\\\\");
            NewtransResult[item] = NewtransResult[item].replace(/"/g, "\\\"");
        });
        let Englishnew = English.replace(/\\/g, '\\\\');
        Englishnew = Englishnew.replace(/"/g, "\\\"");
        client.mutate({
            mutation: gql`
            mutation addLang{
            addLang(lang:{not_trans:0,project_id:
            ${projectId},
            en:"${Englishnew}",
            es:"${NewtransResult["es"]}",
            ja:"${NewtransResult["ja"]}",
            ko:"${NewtransResult["ko"]}",
            sk:"${NewtransResult["sk"]}",
            cs:"${NewtransResult["cs"]}",
            fr:"${NewtransResult["fr"]}",
            pt:"${NewtransResult["pt"]}",
            zh:"${NewtransResult["zh"]}",
            mode_name:"${modelname}",
            label:"${label}",
            file_name:"string.xml"
            }){
            en
               }
             }
            `
        })
            .then(result => finallResult(result))
            .catch(error => seterror(EnglishSubmit, error));
    }

    function EnglishOK(Englishnew) {
        setloading(true);
        if (projectId === null) {
            setnullable(true);
            return
        } else if (englisherror) {
            return
        } else {
            setnullable(false)
        }
        const client = new ApolloClient({
            uri: HOST,
            headers: {
                token: cookie.load('tokenaccessToken'),
            },
        });
        let EnglishValue = English.replace(/\\/g, "\\\\");
        EnglishValue = EnglishValue.replace(/"/g, "\\\"");
        client.query({
            query: gql`
           {
              trans(en:"${Englishnew !== '' ? EnglishValue : Englishnew}"){
              en es ja ko sk cs fr pt zh
              }
           }
            `
        })
            .then(result => settoSubmitResult(result))
            .catch(error => seterror(EnglishOK, error, settosubmit, setloading, setEnglish));
    }

    return (
        <div>{result !== 'submitted'
            ?
            <Dialog
                fullWidth={true}
                TransitionComponent={Transition}
                maxWidth='md'
                open={true}
                onClose={() => fun(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{title}
                </DialogTitle>
                <div>
                    <MySelect
                        select
                        label="ProjectId"
                        value={projectId}
                        onChange={(project) => setprojectId(project.target.value)}
                        margin="normal"
                    >
                        {projectid.map(option => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </MySelect>
                    {nullable ? <div className="nullable">
                        <span>Not nullable</span>
                    </div> : null}
                </div>
                {tosubmit ?
                    <div>
                        <div className='editwindow_input'>
                            <FormControl fullWidth className={classes.margin}>
                                <InputLabel>English:</InputLabel>
                                <Input
                                    onChange={value => Changelanguage(value, 'en')}
                                    value={English}
                                />
                            </FormControl>
                        </div>
                        <div className='editwindow_input'>
                            <FormControl fullWidth className={classes.margin}>
                                <InputLabel>Spanish:</InputLabel>
                                <Input
                                    onChange={value => Changelanguage(value, 'es')}
                                    value={transResult != null ? transResult.data.trans.es : ''}
                                />
                            </FormControl>
                        </div>
                        <div className='editwindow_input'>
                            <FormControl fullWidth className={classes.margin}>
                                <InputLabel>Korean:</InputLabel>
                                <Input
                                    onChange={value => Changelanguage(value, 'ko')}
                                    value={transResult != null ? transResult.data.trans.ko : ''}
                                />
                            </FormControl>
                        </div>
                        <div className='editwindow_input'>
                            <FormControl fullWidth className={classes.margin}>
                                <InputLabel>Japanese:</InputLabel>
                                <Input
                                    onChange={value => Changelanguage(value, 'ja')}
                                    value={transResult != null ? transResult.data.trans.ja : ''}
                                />
                            </FormControl>
                        </div>
                        <div className='editwindow_input'>
                            <FormControl fullWidth className={classes.margin}>
                                <InputLabel>Slovakia:</InputLabel>
                                <Input
                                    onChange={value => Changelanguage(value, 'sk')}
                                    value={transResult != null ? transResult.data.trans.sk : ''}
                                />
                            </FormControl>
                        </div>
                        <div className='editwindow_input'>
                            <FormControl fullWidth className={classes.margin}>
                                <InputLabel>Czech:</InputLabel>
                                <Input
                                    onChange={value => Changelanguage(value, 'cs')}
                                    value={transResult != null ? transResult.data.trans.cs : ''}
                                />
                            </FormControl>
                        </div>
                        <div className='editwindow_input'>
                            <FormControl fullWidth className={classes.margin}>
                                <InputLabel>France:</InputLabel>
                                <Input
                                    onChange={value => Changelanguage(value, 'fr')}
                                    value={transResult != null ? transResult.data.trans.fr : ''}
                                />
                            </FormControl>
                        </div>
                        <div className='editwindow_input'>
                            <FormControl fullWidth className={classes.margin}>
                                <InputLabel>Portuguese:</InputLabel>
                                <Input
                                    onChange={value => Changelanguage(value, 'pt')}
                                    value={transResult != null ? transResult.data.trans.pt : ''}
                                />
                            </FormControl>
                        </div>
                        <div className='editwindow_input'>
                            <FormControl fullWidth className={classes.margin}>
                                <InputLabel>Chinese:</InputLabel>
                                <Input
                                    onChange={value => Changelanguage(value, 'zh')}
                                    value={transResult != null ? transResult.data.trans.zh : ''}
                                />
                            </FormControl>
                        </div>
                        <div className='editwindow_input'>
                            <FormControl fullWidth className={classes.margin}>
                                <InputLabel>Label:</InputLabel>
                                <Input
                                    onChange={value => setlabel(value.target.value)}
                                    value={label}
                                />
                            </FormControl>
                        </div>
                        <div className='editwindow_input'>
                            <FormControl fullWidth className={classes.margin}>
                                <InputLabel>Model name:</InputLabel>
                                <Input
                                    onChange={value => setmodelname(value.target.value)}
                                    value={modelname}
                                />
                            </FormControl>
                        </div>
                    </div>
                    : <div className='editwindow_input'>
                        <FormControl fullWidth className={classes.margin}>
                            <InputLabel>English:</InputLabel>
                            <Input
                                onChange={value => ChangeEnglish(value)}
                                value={English}
                            />
                        </FormControl>
                        {loading ?
                            <div className="svgloading">
                                {!englisherror ?
                                    <svg x="0px" y="0px"
                                        viewBox="0 0 100 100" enableBackground="new 0 0 0 0" xmlSpace="preserve">
                                        <path fill="black"
                                            d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
                                            <animateTransform
                                                attributeName="transform"
                                                attributeType="XML"
                                                type="rotate"
                                                dur="1s"
                                                from="0 50 50"
                                                to="360 50 50"
                                                repeatCount="indefinite" />
                                        </path>
                                    </svg> :
                                    <div className="errformat"><img alt="" src={require("./image/error.png")} /></div>}
                            </div>
                            : null}
                    </div>
                }
                {tosubmit ?
                    <DialogActions>
                        <MyButton onClick={() => settosubmit(false)} color="primary">
                            Cancel
                        </MyButton>
                        <MyButton onClick={() => EnglishSubmit()} color="primary">
                            Submit
                        </MyButton>
                    </DialogActions> :
                    <DialogActions>
                        <MyButton onClick={() => fun(false)} color="primary">
                            Cancel
                        </MyButton>
                        <MyButton onClick={() => EnglishOK()} color="primary">
                            OK
                        </MyButton>
                    </DialogActions>}
            </Dialog>
            : <PopupWindow title='successfull' content='Successful submission of information' oneselect={1}
                surebutton='I know' fun={() => fun(false)} />
        }
        </div>

    )
}
