import React, { useEffect, useState, useRef } from 'react';
import {storage, database} from '../fire'
//import fire from '../fire'


import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import LinearProgress from '@material-ui/core/LinearProgress';
import {Link} from 'react-router-dom';

import Canvas from './Canvas';



/*
1. Load correct image and place canvas over it
2. mark points and set useStates to the correct coordinates
3. draw the points on the canvas
4. upload the data to firebase real time database by pressing 's' on the keyboard or save button
5. if the image is previously marked pull that information from firebase and populate states (canvas will automaticly draw the given points)
6. TODO: if image has not been marked in firebase, set all cord states to 0,0, so that markers are moved.
6. implement tensorflow js for later use.
*/

//TODO: if image has not been marked in firebase, set all cord states to 0,0, so that markers are moved.

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      height: 1000,
      width: 'auto',
    },
    control: {
      padding: theme.spacing(0),
    },
  }));




function ImageMarker(props){
    //const pageName = "Placeholder"
    const canvasStyle = {
        width: "500px", height:"500px", 
        position:"absolute", top:"0px", left:"0px",
        backgroundColor: "rgba(2,0,0,.1)",
    }

    const coveredImage = {
        width:"500px", height:"500px", 
        position:"absolute", top:"0px", left:"0px",
    }

    const insideWrapper = {
        width:"500px", height:"500px",
        position:"relative",
    }

    const outsideWrapper = {
        width:"500px", height:"500px", 
        margin:"50px 60px", 
        padding: '10px',
        
    }

    const [spacing, setSpacing] = React.useState(2);
    const classes = useStyles();
    
    
    const [cordinates, setCordinates] = useState({x: 0, y: 0}); // live coordinates of the mouse pointer
    const [selectedJoint, setJoint] = useState();

    // all coordinates for firebase
    const [left_wrist, setLeft_writ] = useState({left_wrist: {x: 0, y: 0}});
    const [left_elbow, setLeft_elbow] = useState({left_elbow: {x: 0, y: 0}});
    const [left_shoulder, setLeft_shoulder] = useState({left_shoulder: {x: 0, y: 0}});
    const [neck, setNeck] = useState({neck: {x: 0, y: 0}});
    const [head, setHead] = useState({head: {x: 0, y: 0}});
    const [right_shoulder, setRight_shoulder] = useState({right_shoulder: {x: 0, y: 0}});
    const [right_elbow, setRight_elbow] = useState({right_elbow: {x: 0, y: 0}});
    const [right_writs, setRight_writs] = useState({right_writs: {x: 0, y: 0}});
    const [torso, setTorso] = useState({torso: {x: 0, y: 0}});
    const [left_hip, setLeft_hip] = useState({left_hip: {x: 0, y: 0}});
    const [left_knee, setleft_knee] = useState({left_knee: {x: 0, y: 0}});
    const [left_ankle, setLeft_ankle] = useState({left_ankle: {x: 0, y: 0}});
    const [right_hip, setRight_hip] = useState({right_hip: {x: 0, y: 0}});
    const [right_knee, setRight_knee] = useState({right_knee: {x: 0, y: 0}});
    const [right_ankle, setRight_ankle] = useState({right_ankle: {x: 0, y: 0}});

    
    //function for setting the correct joint.
    function jointClicked(e){
        
        switch(selectedJoint){
            case 'left_wrist':
                setLeft_writ({left_wrist: {x: Math.ceil(e.nativeEvent.offsetX/(500/224)), y: Math.ceil(e.nativeEvent.offsetY/(500/224))}})
                break;
            case 'left_elbow':
                setLeft_elbow({left_elbow: {x: Math.ceil(e.nativeEvent.offsetX/(500/224)), y: Math.ceil(e.nativeEvent.offsetY/(500/224))}})
                break;
            case 'left_shoulder':
                setLeft_shoulder({left_shoulder: {x: Math.ceil(e.nativeEvent.offsetX/(500/224)), y: Math.ceil(e.nativeEvent.offsetY/(500/224))}})
                break;
            case 'neck':
                setNeck({neck: {x: Math.ceil(e.nativeEvent.offsetX/(500/224)), y: Math.ceil(e.nativeEvent.offsetY/(500/224))}})
                break;
            case 'head':
                setHead({head: {x: Math.ceil(e.nativeEvent.offsetX/(500/224)), y: Math.ceil(e.nativeEvent.offsetY/(500/224))}})
                break;
            case 'right_shoulder':
                setRight_shoulder({right_shoulder: {x: Math.ceil(e.nativeEvent.offsetX/(500/224)), y: Math.ceil(e.nativeEvent.offsetY/(500/224))}})
                break;
            case 'right_elbow':
                setRight_elbow({right_elbow: {x: Math.ceil(e.nativeEvent.offsetX/(500/224)), y: Math.ceil(e.nativeEvent.offsetY/(500/224))}})
                break;
            case 'right_writs':
                setRight_writs({right_writs: {x: Math.ceil(e.nativeEvent.offsetX/(500/224)), y: Math.ceil(e.nativeEvent.offsetY/(500/224))}})
                break;
            case 'torso':
                setTorso({torso: {x: Math.ceil(e.nativeEvent.offsetX/(500/224)), y: Math.ceil(e.nativeEvent.offsetY/(500/224))}})
                break;
            case 'left_hip':
                setLeft_hip({left_hip: {x: Math.ceil(e.nativeEvent.offsetX/(500/224)), y: Math.ceil(e.nativeEvent.offsetY/(500/224))}})
                break;
            case 'left_knee':
                setleft_knee({left_knee: {x: Math.ceil(e.nativeEvent.offsetX/(500/224)), y: Math.ceil(e.nativeEvent.offsetY/(500/224))}})
                break;
            case 'left_ankle':
                setLeft_ankle({left_ankle: {x: Math.ceil(e.nativeEvent.offsetX/(500/224)), y: Math.ceil(e.nativeEvent.offsetY/(500/224))}})
                break;
            case 'right_hip':
                setRight_hip({right_hip: {x: Math.ceil(e.nativeEvent.offsetX/(500/224)), y: Math.ceil(e.nativeEvent.offsetY/(500/224))}})
                break;
            case 'right_knee':
                setRight_knee({right_knee: {x: Math.ceil(e.nativeEvent.offsetX/(500/224)), y: Math.ceil(e.nativeEvent.offsetY/(500/224))}})
                break;
            case 'right_ankle':
                setRight_ankle({right_ankle: {x: Math.ceil(e.nativeEvent.offsetX/(500/224)), y: Math.ceil(e.nativeEvent.offsetY/(500/224))}})
                break;
        }
    }

    function onHover(e){
        setCordinates({x: e.nativeEvent.offsetX/(500/224), y: e.nativeEvent.offsetY/(500/224)});
    }

    const handleChange = (event) => {
        setSpacing(Number(event.target.value));
    };
    
    return (
        <div className={classes.root}>
            <Container maxWidth='lg' className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={6}>
                        <Paper id='imagePaper' className={classes.paper}>

                            <div style={outsideWrapper}>
                                <div style={insideWrapper}>
                                    <img style={coveredImage} id='image' src={props.image}  onMouseDown={jointClicked} />
                                    <Canvas className='coveringCanvas' style={canvasStyle} onMouseDown={jointClicked} onMouseMove={onHover} lw={left_wrist} le={left_elbow} ls={left_shoulder} n={neck} 
                                                                                                                                            h={head} rw={right_writs} re={right_elbow} rs={right_shoulder}
                                                                                                                                            t={torso} lh={left_hip} lk={left_knee} la={left_ankle} rh={right_hip}
                                                                                                                                            rk={right_knee} ra={right_ankle}/>
                                </div>
                                
                                <h3>selected joint: ({selectedJoint})</h3>
                                <h3>current coordinates: (x{Math.ceil(cordinates?.x)}, y{Math.ceil(cordinates?.y)})</h3>
                                <Button color='primary' variant="contained" >save</Button>
                            </div>
                            
                            <br/>
                            
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={5} lg={5}>
                        <Paper className={classes.paper} style={{margin: "60px 0px", padding: " 10px"}}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={12} lg={12}>
                                    <h3>image name: {props.image_name}</h3>
                                    <Button color='primary' variant="contained" onClick={() => setJoint('left_wrist')}>left_wrist</Button> <span> x,y: ({left_wrist.left_wrist?.x}, {left_wrist.left_wrist?.y})</span> <br/> <br/>
                                    <Button color='primary' variant="contained" onClick={() => setJoint('left_elbow')}>left_elbow</Button> <span> x,y: ({left_elbow.left_elbow?.x}, {left_elbow.left_elbow?.y})</span><br/> <br/>
                                    <Button color='primary' variant="contained" onClick={() => setJoint('left_shoulder')}>left_shoulder</Button> <span>left_shoulder: x,y: ({left_shoulder.left_shoulder?.x}, {left_shoulder.left_shoulder?.y})</span><br/> <br/>
                                    <Button color='primary' variant="contained" onClick={() => setJoint('neck')}>neck</Button> <span>neck: x,y: ({neck.neck?.x}, {neck.neck?.y})</span><br/> <br/>
                                    <Button color='primary' variant="contained" onClick={() => setJoint('head')}>head</Button> <span>head: x,y: ({head.head?.x}, {head.head?.y})</span><br/> <br/>
                                    <Button color='primary' variant="contained" onClick={() => setJoint('right_shoulder')}>right_shoulder</Button> <span>right_shoulder: x,y: ({right_shoulder.right_shoulder?.x}, {right_shoulder.right_shoulder?.y})</span><br/> <br/>
                                    <Button color='primary' variant="contained" onClick={() => setJoint('right_elbow')}>right_elbow</Button> <span>right_elbow: x,y: ({right_elbow.right_elbow?.x}, {right_elbow.right_elbow?.y})</span><br/> <br/>
                                    <Button color='primary' variant="contained" onClick={() => setJoint('right_writs')}>right_writs</Button> <span>right_writs: x,y: ({right_writs.right_writs?.x}, {right_writs.right_writs?.y})</span><br/> <br/>
                                    <Button color='primary' variant="contained" onClick={() => setJoint('torso')}>torso</Button> <span>torso: x,y: ({torso.torso?.x}, {torso.torso?.y})</span><br/> <br/>
                                    <Button color='primary' variant="contained" onClick={() => setJoint('left_hip')}>left_hip</Button> <span>left_hip: x,y: ({left_hip.left_hip?.x}, {left_hip.left_hip?.y})</span><br/> <br/>
                                    <Button color='primary' variant="contained" onClick={() => setJoint('left_knee')}>left_knee</Button> <span>left_knee: x,y: ({left_knee.left_knee?.x}, {left_knee.left_knee?.y})</span><br/> <br/>
                                    <Button color='primary' variant="contained" onClick={() => setJoint('left_ankle')}>left_ankle</Button> <span>left_ankle: x,y: ({left_ankle.left_ankle?.x}, {left_ankle.left_ankle?.y})</span><br/> <br/>
                                    <Button color='primary' variant="contained" onClick={() => setJoint('right_hip')}>right_hip</Button> <span>right_hip: x,y: ({right_hip.right_hip?.x}, {right_hip.right_hip?.y})</span><br/> <br/>
                                    <Button color='primary' variant="contained" onClick={() => setJoint('right_knee')}>right_knee</Button> <span>right_knee: x,y: ({right_knee.right_knee?.x}, {right_knee.right_knee?.y})</span><br/> <br/>
                                    <Button color='primary' variant="contained" onClick={() => setJoint('right_ankle')}>right_ankle</Button> <span>right_ankle: x,y: ({right_ankle.right_ankle?.x}, {right_ankle.right_ankle?.y})</span><br/> <br/>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </div>   
    );
}

export default ImageMarker;