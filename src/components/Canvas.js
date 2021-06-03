import React, { useRef, useEffect } from 'react';
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
1. Load correct image and place canvas over it
2. mark points and set useStates to the correct coordinates
3. draw the points on the canvas
4. upload the data to firebase real time database by pressing 's' on the keyboard or save button
5. if the image is previously marked pull that information from firebase and populate states (canvas will automaticly draw the given points)
6. implement tensorflow js for later use.
*/

const Canvas = props => {
  
    const canvasRef = useRef(null)
    
    const draw = (ctx, xCord, yCord, jointName) => {
      
        ctx.strokeStyle = '#44ff00'
        ctx.beginPath()
        ctx.arc(xCord, yCord, 3, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.font = "bold 6px Arial";
        ctx.fillStyle = "red";

        if(jointName.includes('l_')){
            ctx.fillText(jointName, xCord-20, yCord);
        }
        else if(jointName.includes('r_')){
            ctx.fillText(jointName, xCord+10, yCord);
        }
        else if(jointName.includes('neck')){
            ctx.fillText(jointName, xCord-7, yCord+10);
        }
        else if(jointName.includes('head')){
            ctx.fillText(jointName, xCord-7, yCord-8);
        }
        else if(jointName.includes('torso')){
            ctx.fillText(jointName, xCord-7, yCord-8);
        }
        else{
            ctx.fillText(jointName, xCord-7, yCord);
        }
      
    }

    const drawLines = (ctx, xCord1, yCord1, xCord2, yCord2) => {
        ctx.strokeStyle = '#44ff00'
        ctx.beginPath()
        ctx.moveTo(xCord1, yCord1)
        ctx.lineTo(xCord2, yCord2)
        ctx.stroke()
    }

    const drawBoundryBox = (ctx, xCord1, yCord1, xCord2, yCord2) => {
        ctx.strokeStyle = '#44ff00'
        ctx.beginPath()
        ctx.moveTo(xCord1, yCord1)
        ctx.lineTo(xCord1, yCord2)
        ctx.lineTo(xCord2, yCord2)
        ctx.lineTo(xCord2, yCord1)
        ctx.lineTo(xCord1, yCord1)
        ctx.stroke()
    }

    
    useEffect(() => {
        
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        context.canvas.width = 224;
        context.canvas.height = 224;
        context.clearRect(0, 0, context.canvas.width, context.canvas.height)
      //Our draw came here
        const render = () => {
            //drawing dots for each joint placed
            draw(context, props.lw.left_wrist?.x, props.lw.left_wrist?.y, 'l_wrist')
            draw(context, props.le.left_elbow?.x, props.le.left_elbow?.y, 'l_elbow')
            draw(context, props.ls.left_shoulder?.x, props.ls.left_shoulder?.y, 'l_shoul')
            draw(context, props.n.neck?.x, props.n.neck?.y, 'neck')
            draw(context, props.h.head?.x, props.h.head?.y, 'head')
            draw(context, props.rw.right_writs?.x, props.rw.right_writs?.y, 'r_wrist')
            draw(context, props.re.right_elbow?.x, props.re.right_elbow?.y, 'r_elbow')
            draw(context, props.rs.right_shoulder?.x, props.rs.right_shoulder?.y, 'r_shoul')
            draw(context, props.t.torso?.x, props.t.torso?.y, 'torso')
            draw(context, props.lh.left_hip?.x, props.lh.left_hip?.y, 'l_hip')
            draw(context, props.lk.left_knee?.x, props.lk.left_knee?.y, 'l_knee')
            draw(context, props.la.left_ankle?.x, props.la.left_ankle?.y, 'l_ankle')
            draw(context, props.rk.right_knee?.x, props.rk.right_knee?.y, 'r_knee')
            draw(context, props.ra.right_ankle?.x, props.ra.right_ankle?.y, 'r_ankle')
            draw(context, props.rh.right_hip?.x, props.rh.right_hip?.y, 'r_hip')

            //boundry box points
            draw(context, props.tl.topLeft?.x, props.tl.topLeft?.y, 'tl')
            draw(context, props.br.bottomRight?.x, props.br.bottomRight?.y, 'br')

            //drawing lines between the joints
            drawLines(context, props.lw.left_wrist?.x, props.lw.left_wrist?.y, props.le.left_elbow?.x, props.le.left_elbow?.y)
            drawLines(context, props.le.left_elbow?.x, props.le.left_elbow?.y, props.ls.left_shoulder?.x, props.ls.left_shoulder?.y)
            drawLines(context, props.ls.left_shoulder?.x, props.ls.left_shoulder?.y, props.n.neck?.x, props.n.neck?.y)
            drawLines(context, props.n.neck?.x, props.n.neck?.y, props.h.head?.x, props.h.head?.y)
            drawLines(context, props.n.neck?.x, props.n.neck?.y, props.rs.right_shoulder?.x, props.rs.right_shoulder?.y)
            drawLines(context, props.rs.right_shoulder?.x, props.rs.right_shoulder?.y, props.re.right_elbow?.x, props.re.right_elbow?.y)
            drawLines(context, props.re.right_elbow?.x, props.re.right_elbow?.y, props.rw.right_writs?.x, props.rw.right_writs?.y)
            drawLines(context, props.n.neck?.x, props.n.neck?.y, props.t.torso?.x, props.t.torso?.y)
            drawLines(context, props.t.torso?.x, props.t.torso?.y, props.lh.left_hip?.x, props.lh.left_hip?.y)
            drawLines(context, props.t.torso?.x, props.t.torso?.y, props.rh.right_hip?.x, props.rh.right_hip?.y)
            drawLines(context, props.lh.left_hip?.x, props.lh.left_hip?.y, props.lk.left_knee?.x, props.lk.left_knee?.y)
            drawLines(context, props.lk.left_knee?.x, props.lk.left_knee?.y, props.la.left_ankle?.x, props.la.left_ankle?.y)
            drawLines(context, props.rh.right_hip?.x, props.rh.right_hip?.y, props.rk.right_knee?.x, props.rk.right_knee?.y)
            drawLines(context, props.rk.right_knee?.x, props.rk.right_knee?.y, props.ra.right_ankle?.x, props.ra.right_ankle?.y)

            drawBoundryBox(context, props.tl.topLeft?.x, props.tl.topLeft?.y, props.br.bottomRight?.x, props.br.bottomRight?.y)
        }
        render()
      
      
    }, [draw])
    
    return <canvas ref={canvasRef} {...props}/>
  }
  
  export default Canvas