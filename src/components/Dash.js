import React from 'react';
import Nav from './Nav';
import {storage, database} from '../fire'

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import DataTiles from './DataTiles'
import Button from '@material-ui/core/Button';


const drawerWidth = 240;
var storageRef = storage.ref();
// var databaseRef = database.ref()

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

async function datasets() {
  database.ref("datasets").get().then(function(snapshot) {
    if (snapshot.exists()) {
      console.log(snapshot.val());
      
      snapshot.forEach(function(childSnapshot){
        var key = childSnapshot.key;
        console.log("key: ", key)
        var childData = childSnapshot.val();  // treat childData as an object so childData.dir_name returns object name
        console.log("data: ", childData)
      })
      // TODO: create tiles for each dataset that comes from snapshot.

    }
    else {
      console.log("No data available");
    }
  }).catch(function(error) {
    console.error(error);
  });
}

const Dash = () => {

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
            <Grid container spacing={3}>
                {/* Dataset tiles */}
                <Grid item xs={12} md={8} lg={9}>
                <Paper className={fixedHeightPaper}>
                    {/* Render datasets here*/
                    
                    }
                  <h2>Datasets</h2>
                  <Grid container spacing={2}>
                    <Grid item xs={4} md={4} lg={4}>  
                        <DataTiles/>  
                    </Grid>
                    <Grid item xs={4} md={4} lg={4}>
                      <DataTiles/>
                    </Grid>
                    <Grid item xs={3} md={3} lg={3}>
                    <DataTiles/>
                    </Grid>
                    
                  </Grid>
                  <Button size="small" onClick={datasets}>Click me</Button>
                </Paper>
                </Grid>
                



                {/* Progress */}
                <Grid item xs={12} md={4} lg={3}>
                <Paper className={fixedHeightPaper}>
                    {/* Render something here */}
                    <h2>Progress</h2>
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

export default Dash;

/*
<section className="hero">
            <Nav />
            <h2>Dashboard</h2>
        </section>
*/