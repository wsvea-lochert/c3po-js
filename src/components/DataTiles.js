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

/*
1. Add props for adaptive/responsive content
2. Add automatic generating cards in Dash.js file
3. Add redirect from button to new page (use dataset.js file) for editing images
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

function DataTiles(){
    //const pageName = "Placeholder"

    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;

    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    
    return (
        <Card className={classes.root}>
        <CardContent>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
            Word of the Day
            </Typography>
            <Typography variant="h5" component="h2">
            be{bull}nev{bull}o{bull}lent
            </Typography>
            <Typography className={classes.pos} color="textSecondary">
            adjective
            </Typography>
            <Typography variant="body2" component="p">
            well meaning and kindly.
            <br />
            {'"a benevolent smile"'}
            </Typography>
        </CardContent>
        <CardActions>
            <Button size="small">Learn More</Button>
        </CardActions>
        </Card>
    );
}

export default DataTiles;