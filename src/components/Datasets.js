import React, { useEffect, useState } from 'react';
import Nav from "./Nav";
import {storage, database} from '../fire'


import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { Switch, Route, useParams } from 'react-router';
import ImageMarker from './ImageMarker'

/*
TODO list:
1. database.ref('datasets').child('dir_name of dataset') -> to get the specific datasets we are looking for
2. name of dir can be collected from the URL.
------------------------------------------------------
3. load the first image onto the site
4. implement marking tool (either create one from scratch or use a pre-built one)
5. write data to real-time databse for each image in specific format
6. download data in json format (images too?)
*/


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
      width: 'auto'
    },
    fixedHeight: {
      height: 'auto', //controll this
    },
  }));



const Datasets = () => {
    const pageName = "Datasets"
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    // States for initial snapshot extraction from firebase
    const [downloadLinks, setDownloadLinks] = useState(); // objects | use map to extract?
    const [fileInfo, setFileInfo] = useState();           // Array of strings.
    const [progress, setProgress] = useState();           // integer to track the marking progress of the dataset.
    const [images, setImages] = useState([]);
    
    // clean image links
    const [imageData, setImageData] = useState();

    // controller states
    const [url, setUrl] = useState();                     // Url to get the dataset.
    const [dataLoaded, setDataLoaded] = useState(false);  // Check if the data is loaded or not

    //counter
    const [counter, setCounter] = useState(0);

    // function for getting the correct part of the URL for getting the database catalog
    function getUrl(){
      let url = window.location.href;
      var parser = document.createElement('a');
      parser.href = url;
      let catalog = parser.pathname.split('/');
      setUrl(catalog[2]); // not nessesary but a backup
      console.log('Current catalog is: ', catalog[2])
      return catalog[2];
    }
    
    // functon for collecting the correct dataset for the current page.
    async function getData() {
      // Get catalog from URL
      let dir = getUrl();
      // connect to real-time database to get the dataset
      database.ref("datasets").child(dir).get().then(function(snapshot){
        if(snapshot.exists()){
          //console.log("testlog")
          // Setting the useStates to that the values can be used later.
          setDownloadLinks(snapshot.val().download_links)
          setFileInfo(snapshot.val().file_info)
          setProgress(snapshot.val().progress)
          //remove this if it throws an error
          console.log(snapshot.val().dataset)
          setImageData(snapshot.val().dataset)
        }
        else{
          console.log("No data available, check firebase or catalog name")
        }
      }).catch(function(error){
        console.error(error)
      });
    }

    function showData() {
      // logging to check if the data is there
      console.log('----------- useStates -----------')
      console.log('Download links: ', downloadLinks)
      console.log('File info:', fileInfo)
      console.log('progress: ', progress)
      console.log('---------------------------------')
      
      //console.log(Object.keys(downloadLinks)); 
    }


    function showDownloadLinks(){
      if(dataLoaded){
        setImages(Object.values(downloadLinks));
      }
      else{
        console.log('Data is not loaded into states!')
      }
    }

    useEffect(() => {
      getData();
    }, [])

    useEffect(() => {
      if(downloadLinks === undefined || fileInfo === undefined || progress === undefined){
        console.log('one is undefined')
        return;
      }
      else{
        showData()
        setDataLoaded(true) 

        if(dataLoaded){
          showDownloadLinks();
        }
      }
    }, [downloadLinks, fileInfo, progress, dataLoaded])

    images?.sort();

    return (
        //remember classes.root to wrap elements witin the same div
        <div className={classes.root}>
            <Nav page={pageName}/> 
            <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            {/*<Container maxWidth="lg" className={classes.container}>*/}
            <Grid container spacing={3}>
                {/* Remove the paper? */}
                <Grid item xs={12} md={12} lg={12}>
                <Paper className={fixedHeightPaper}>
                  {fileInfo?.length > 0 && (
                    <span>{fileInfo[counter]}</span>
                  )}
                  
                  {images?.length > 0 && (
                    <>
                    <Button variant="contained" color="primary" size="small" onClick={getData}>get data</Button>
                    <Button variant="contained" color="primary" size="small" disabled={counter===images?.length-1} onClick={() => setCounter(counter+1)}>skip 50</Button>
                    <Button variant="contained" color="primary" size="small" disabled={counter===0} onClick={() => setCounter(counter-1)}>Prev</Button> <br/>
                    <Button variant="contained" color="primary" size="small" disabled={counter===images?.length-1} onClick={() => setCounter(counter+1)}>Next</Button>
                    
                    <ImageMarker image={images[counter]} image_name={fileInfo[counter]} imgCounter={counter} prev_pose={imageData['image'+(counter-1)]}/>
                    
                    
                    </>
                  )}
                  
                  {
                    
                    /*
                      h2 with file info here

                      <new image component (send single image as prop)>
                      
                      buttons here.
                    
                    */
                  }

                </Paper>
                </Grid>

            </Grid>
            <Box pt={4}>
                
            </Box>
           {/* </Container>*/}
        </main>
      </div>
    );
}

export default Datasets;