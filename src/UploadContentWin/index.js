import React, {useState} from 'react'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import {styled} from '@material-ui/core/styles';
import './UploadContentWin.css'
import ApolloClient from 'apollo-boost'
import HOST from "../settingurl";
import cookie from "react-cookies";
import {gql} from "apollo-boost";
import ReplyIcon from '@material-ui/icons/Reply';

const MyButton = styled(Button)({
    margin: "auto",
    color: "blue"
});
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function UploadContentWin({title, content, close, refreceToken, filename, languageTitle}) {
    content.map((item) => item.id = Number(item.id));
    content.map((item) => Object.keys(item).map((key) => item[key] === 'No content' ? item[key] = null : item[key] = item[key]));
    const [reponse, setreponse] = useState(null);
    const submit = () => {
        let contentup = JSON.stringify(content);
        // console.log(contentup.match(/(\")\w*(\"\:)/g)[0]);
        contentup = contentup.replace(/"en":/g, "en:");
        contentup = contentup.replace(/"es":/g, "es:");
        contentup = contentup.replace(/"ko":/g, "ko:");
        contentup = contentup.replace(/"ja":/g, "ja:");
        contentup = contentup.replace(/"sk":/g, "sk:");
        contentup = contentup.replace(/"cs":/g, "cs:");
        contentup = contentup.replace(/"fr":/g, "fr:");
        contentup = contentup.replace(/"id":/g, "id:");
        console.log(contentup);
        const client = new ApolloClient({
            uri: HOST,
            headers: {
                token: cookie.load('tokenaccessToken'),
                refreshToken: cookie.load('refreshToken'),
            },
        });
        client.mutate({
            mutation: gql`
                mutation updateMultiLang{
                    updateMultiLang(langs:${contentup})
                }`
        })
        .then(reponse => setreponse(reponse))
        .catch(error => refreceToken(submit, error));

    };

    function setreponseOK() {
        close();
        setreponse(null)
    }
    return (
        <div>
            {reponse === null
                ?
                <Dialog
                    fullWidth={true}
                    TransitionComponent={Transition}
                    maxWidth='xl'
                    open={true}
                    onClose={() => close()}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{title} ( '{filename}' )</DialogTitle>
                    <div className='CancelButton'>
                        <MyButton onClick={() => close()} startIcon={<ReplyIcon/>}>Cancel</MyButton>
                    </div>
                    <div className='UploadButton'>
                        <MyButton onClick={() => submit()}>Submit</MyButton>
                    </div>
                    <div className='ContentBody'>
                        <table className='tablestyle'>
                            <tbody>
                                <tr>
                                    {content !== null
                                        ?
                                        languageTitle.map((item) =>
                                            <th key={item}
                                                className={item === 'id' ? 'titleIdstyle' : 'titlestyle'}>{item}</th>
                                        )
                                        : null}
                                </tr>
                            <tr className='titlePlaceholder' />
                            {content !== null
                                ?
                                content.map((item) =>
                                    <tr key={item.id} className='trcontent'>
                                        {languageTitle.map((key) =>
                                            <td className={key === 'id' ? 'tdIdwidth' : 'tdwidth'}
                                                key={key}>{item[key] === null || item[key] === undefined ? 'No content' : item[key]}</td>
                                        )}
                                    </tr>
                                )
                                : null}
                            </tbody>
                        </table>
                    </div>
                </Dialog>
                :
                <Dialog
                    TransitionComponent={Transition}
                    maxWidth='md'
                    open={true}
                    onClose={() => close()}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">Upload Successed</DialogTitle>
                    <div className='seccuesswin'>
                        <p>The submission has passed, please refresh the data to view .</p>
                    </div>
                    <DialogActions>
                        <MyButton
                            className='modify_button'
                            onClick={() => setreponseOK()}>OK
                        </MyButton>
                    </DialogActions>
                </Dialog>
            }
        </div>

    )
}
