import React, {useState} from 'react';
import {storage, database} from "../fire"
import Nav from "./Nav";
import fire from '../fire'


import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { useForm, Controller } from "react-hook-form";

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
      height: 520,
    },
  }));

  const useStylesBtn = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    input: {
      display: 'none',
    },
  }));

  // add functionallity to upload multiple files. 
const UploadFiles = () => {

    const { register, handleSubmit, control } = useForm();

    const pageName = "Upload data"
    const classes = useStyles();
    const classesBtn = useStylesBtn();

    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    // Move to a helper file to handle logic there
    const [files, setFiles] = useState([])
    const [filesLen, setFilesLen] = useState(0)
    const [prog, setProg] = useState(0)
    const [count, setCount] = useState(0)

    const [directory, setDirectory] = useState('') // use to create new directory to firebase storage
    // console.log(directory.newDir)

    function writeDir(dirName){
      //console.log('current userid: ', fire.auth().currentUser.uid)  // log the curret user that is logged in to the system
      let uid = fire.auth().currentUser.uid  // current user id
      database.ref('datasets').child(dirName).get().then(function(snapshot) {
        if (snapshot.exists()) {
          console.log(snapshot.val());
        }
        else {
          console.log("No data available, writing new data.");
          // write new dir here
          //console.log(currentUser)
          console.log(dirName)
          database.ref('datasets').child(dirName).set({
            dir_name: dirName
          });
        }
      }).catch(function(error) {
        console.error(error);
      });
    }

    const onFileChange = e => {
      setProg(0)
      setCount(0)
      for (let i = 0; i < e.target.files.length; i++) {
          const newFile = e.target.files[i];
          newFile["id"] = Math.random();
      // add an "id" property to each File object
          setFiles(prevState => [...prevState, newFile]);
      }
      
    };

    const uploadFiles = e => {
      // setProg(0)
      setFilesLen(files.length)  // setting the length for counting with progress bar
      e.preventDefault();
      const promises = [];
      // var urlList = []
      const names = []

      files.forEach(file => {
        let uploadTask = storage.ref(`${directory.newDir}/${file.name}`).put(file)
        promises.push(uploadTask);
        uploadTask.on('state_changed', (snapshot) => {
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProg(progress)
          setCount(progress)
          console.log('Upload progress is: ' + progress + '%');
          if(!names.includes(file.name)){
          names.push(file.name)
          } 
        },
        (error) => {
          // error handeling of unsuccessful uploads
          console.log('ugh, an erros has hit you in the face: ', error)
        },
        () => {
          //console.log(files)
          Promise.all(promises)
          .then(() => console.log('All files are uploaded!'))
          .catch(err => console.log(err.code))

          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log('File available at', downloadURL)
          database.ref('datasets').child(directory.newDir).child('download_links').push(downloadURL)
          });
          //console.log('Uploading urls', urlList)
          database.ref('datasets').child(directory.newDir).update({
            // download_links: urlList,
            file_info: names
          });
          
        }) 
      })
      //console.log('outside loop: ',urlList)
    }

    const createNewDir = data => { 
      console.log('dette er verdien', data.newDir)  // nå logger den, men verdien er tom, endra fran input til button, men plutselig så stopper den opp å gir feilmeldinger om input
      setDirectory(data)
      writeDir(data.newDir)
    }

    return (
        //remember classes.root to wrap elements witin the same div
        <div className={classes.root}>
            <Nav page={pageName}/> 
            <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12} lg={12}>
                <Paper className={fixedHeightPaper}>
                    {/* Render here*/
                    <h1>Upload files</h1>
                    }
                    <div className="upload-field">
                      <p>Upload multiple image files for data marking and labeling, prefered inputs are images with .jpg or .png format.</p>
                      <h2 id="uploadTxt">Directories</h2>
                      <p>Add what directory you want the files to be uploaded to.</p>
                      <Grid container spacing={1}>
                      <Grid item xs={6} md={6} lg={6}>
                        <form onSubmit={handleSubmit(createNewDir)}>
                          
                          
                          <Controller
                            name="newDir"
                            control={control}
                            defaultValue=""
                            render={({ onChange, value }) =>
                              <TextField
                                ref={register}
                                variant="outlined"
                                margin="normal"
                                id="newDir"
                                required
                                label="Directory to put files into"
                                autoComplete="dir"
                                autoFocus
                                size="small"
                                onChange={onChange}
                                value={value}
                              />
                            }
                          />
                          <Button variant="contained" color="primary" id="addbtn" type="submit">
                            Select
                          </Button>
                          </form>
                        </Grid>
                        
                      </Grid>
                      <h3 id="uploadTxt">Curret directory: storage/{directory.newDir}/</h3> <br/>
                    



                      <Grid container direction="row" justify="flex-start" alignItems="flex-start">
                      
                        
                        <input
                            accept="image/*"
                            className={classesBtn.input}
                            id="contained-button-file"
                            multiple
                            type="file"
                            onChange={onFileChange}
                          />
                          <label htmlFor="contained-button-file">
                            <Button variant="contained" color="primary" component="span" id="inbtn">
                              Select files
                            </Button>
                          </label>

                          <Button variant="outlined" color="primary" component="span" onClick={uploadFiles} id="inbtn">
                              Upload
                          </Button>

                          
                          
                      </Grid>
                      <br/>
                      <LinearProgress color="primary" variant="determinate" value={prog} />
                        
                      <h3 id="uploadTxt">{count}% Uploaded</h3>
                    </div>
                    
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