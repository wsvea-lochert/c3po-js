import React, { useEffect, useState } from 'react';
import Nav from './Nav';
import {storage, database} from '../fire'

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import DataTiles from './DataTiles'


// TODO: clean up code and move functionallity to new file

const drawerWidth = 240;
//var storageRef = storage.ref();

// use styles for styling the page.
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
      height: 1000,
    },
  }));


const Dash = () => {

  const [list, setList] = useState();

  

    async function datasets() {
      database.ref("datasets").get().then(function(snapshot) {
        if (snapshot.exists()) {
          var jsonDatasets = [] 
  
          snapshot.forEach((childSnapshot) => {
            // var key = childSnapshot.key;
            var childData = childSnapshot.val();  // use childData as an object so childData.dir_name returns object name
            console.log('ChildData: ', childData)
            jsonDatasets.push(childData)
          })
          setList(jsonDatasets)
        }
        else {
          console.log("No data available");
        }
      }).catch(function(error) {
        console.error(error);
      });
    }

    useEffect(() => {
      datasets()
    }, [])  

    const pageName = "C3P0"
    const classes = useStyles();

    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    return (
        //remember classes.root to wrap elements witin the same div
        <div className={classes.root}>
            <Nav page={pageName}/> 
            <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={0} xs={12} md={12} lg={12}>
                <Paper className={fixedHeightPaper}>
                <Grid item xs={12} md={12} lg={12}>
                
                    {/* Render datasets here*/
                    
                    }
                    <Grid container spacing={2}>
                    <h2>Datasets</h2>
                    {list?.map((item, index) =>(
                      <Grid key={item.dir_name} item xs={12} md={12} lg={12}> 
                        <DataTiles name={item.dir_name} progress={(item.progress / item.total_data)*100} download_links={item.download_links} file_info={item.file_info}/>
                      </Grid>
                    ))}
                    </Grid>

                  
                  
                  </Grid>
                
                
                </Paper>
                
                
            </Grid>
            </Container>
        </main>
      </div>
    )
}

export default Dash;