import React from 'react';
//import fire from '../fire'


import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import getDatasets from './Dash'

import LinearProgress from '@material-ui/core/LinearProgress';
import {Link} from 'react-router-dom'

/*
1. Add props for adaptive/responsive content
2. Add automatic generating cards in Dash.js file
3. Add redirect from button to new page (use dataset.js file) for editing images
4. Make each dataset page 'unique' to specific dataset
5. database.ref('datasets').child('dir_name of dataset') -> to get the specific datasets we are looking for
6. name of dir can be collected from the URL in Datasets.js
*/

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

function DataTiles(props){
    //const pageName = "Placeholder"

    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;

    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    
    return (
        <Card className={classes.root}>
        <CardContent>
            <Typography variant="h5" component="h2">
            {props.name}
            </Typography>
            <Typography className={classes.pos} color="textSecondary">

            <LinearProgress color="primary" variant="determinate" value={props.progress} />

            {props.progress + '%'}
            </Typography>
        </CardContent>
        <CardActions>
          <Link to={"/Datasets/" + props.name}>
            <Button variant="contained" color="primary" size="small">Go To dataset</Button>
          </Link>
        </CardActions>
        </Card>
    );
}

export default DataTiles;