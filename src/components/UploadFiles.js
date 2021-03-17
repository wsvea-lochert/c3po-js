import React, {useState} from 'react';
import {storage} from "../fire"
import Nav from "./Nav";

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
    toolbar: {
      paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 8px',
      ...theme.mixins.toolbar,
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    menuButtonHidden: {
      display: 'none',
    },
    title: {
      flexGrow: 1,
    },
    drawerPaper: {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerPaperClose: {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      height: '100vh',
      overflow: 'auto',
    },
    container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
    },
    paper: {
      padding: theme.spacing(2),
      display: 'flex',
      overflow: 'auto',
      flexDirection: 'column',
    },
    fixedHeight: {
      height: 240,
    },
    upImgHeight: {
        height: 300
    },
  }));

  // add functionallity to upload multiple files. 
const UploadFiles = () => {

    const pageName = "Upload data"
    const classes = useStyles();

    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    const fixedImgHeight = clsx(classes.paper, classes.upImgHeight)

    // Move to a helper file to handle logic there
    const allInputs = {imgUrl: ''}
        const [imageAsFile, setImageAsFile] = useState('')
        const [imageAsUrl, setImageAsUrl] = useState(allInputs)
        
        console.log(imageAsFile)
        const handleImageAsFile = (e) => {
            const image = e.target.files[0]
            setImageAsFile(imageFile => (image))
        }
    
        const handleFirebaseUpload = e => {
            e.preventDefault()
            console.log('start of upload')
            
            if(imageAsFile === ''){
                console.error(`not an image, the image file is a ${typeof(imageAsFile)}`)
            }

            const uploadTask = storage.ref(`/images/${imageAsFile.name}`).put(imageAsFile)

            //initiates the firebase side uploading 
            uploadTask.on('state_changed', 
            (snapShot) => {
            //takes a snap shot of the process as it is happening
            console.log(snapShot)
            }, (err) => {
            //catches the errors
            console.log(err)
            }, () => {
            // gets the functions from storage refences the image storage in firebase by the children
            // gets the download url then sets the image from firebase as the value for the imgUrl key:
            storage.ref('images').child(imageAsFile.name).getDownloadURL()
            .then(fireBaseUrl => {
                setImageAsUrl(prevObject => ({...prevObject, imgUrl: fireBaseUrl}))
            })
            })
        }

    return (
        //remember classes.root to wrap elements witin the same div
        <div className={classes.root}>
            <Nav page={pageName}/> 
            <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
                {/* Chart */}
                <Grid item xs={12} md={12} lg={12}>
                <Paper className={fixedHeightPaper}>
                    {/* Render here*/
                    <h2>Upload files</h2>
                    }
                    <div className="upload-field">
                        <p>Some generic text about uploading files and their formats :)</p>
                        Choose file: <input type="file" onChange={handleImageAsFile}/> 
                        <div>
                        <button onClick={handleFirebaseUpload}>Upload file</button>   
                        </div>
                    </div>
                    
                    
                </Paper>
                </Grid>

                <Grid item xs={12} md={12} lg={12}>
                <Paper className={fixedImgHeight}>
                    {}
                    <img width="200" height="200" src={imageAsUrl.imgUrl}/> {/* TODO: remove if url === ''*/}
                </Paper>
                </Grid>
                
            </Grid>
            <Box pt={4}>
                
            </Box>
            </Container>
        </main>
      </div>
    )
}

export default UploadFiles;