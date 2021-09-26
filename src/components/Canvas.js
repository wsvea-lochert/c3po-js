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
        ctx.lineWidth = 3;
        ctx.beginPath()
        ctx.arc(xCord*(1000/224), yCord*(1000/224), 2, 0, 2 * Math.PI);
        ctx.stroke();
        
        ctx.font = "bold 0px Arial";
        ctx.fillStyle = "red";

        if(jointName.includes('l_')){
            ctx.strokeStyle = '#44ff00'
            ctx.stroke();
            ctx.fillText(jointName, xCord*(1000/224)+15, yCord*(1000/224));
        }
        else if(jointName.includes('r_')){
            ctx.strokeStyle = '#FF0000'
            ctx.stroke();
            ctx.fillText(jointName, xCord*(1000/224)-65, yCord*(1000/224));
        }
        else if(jointName.includes('neck')){
            ctx.strokeStyle = '#DC00FF'
            ctx.stroke();
            ctx.fillText(jointName, xCord*(1000/224)+10, yCord*(1000/224)-10);
        }
        else if(jointName.includes('head')){
            ctx.strokeStyle = '#DC00FF'
            ctx.stroke();
            ctx.fillText(jointName, xCord*(1000/224)+10, yCord*(1000/224)-10);
        }
        else if(jointName.includes('torso')){
            ctx.strokeStyle = '#DC00FF'
            ctx.stroke();
            ctx.fillText(jointName, xCord*(1000/224)+10, yCord*(1000/224)-10);
        }
        else{
            ctx.fillText(jointName, xCord-7, yCord);
        }
      
    }

    const drawLines = (ctx, xCord1, yCord1, xCord2, yCord2, color) => {
        if((xCord1 == 0 && yCord1 == 0) || (xCord2 == 0 && yCord2 == 0)){
            return
        }
        else{
            ctx.strokeStyle = color
            ctx.beginPath()
            ctx.moveTo(xCord1*(1000/224), yCord1*(1000/224))
            ctx.lineTo(xCord2*(1000/224), yCord2*(1000/224))
            ctx.stroke()
        }
        
    }

    const drawBoundryBox = (ctx, xCord1, yCord1, xCord2, yCord2) => {
        if((xCord1 == 0 && yCord1 == 0) || (xCord2 == 0 && yCord2 == 0)){
            return
        }
        else{
            ctx.strokeStyle = '#44ff00'
            ctx.beginPath()
            ctx.moveTo(xCord1, yCord1)
            ctx.lineTo(xCord1, yCord2)
            ctx.lineTo(xCord2, yCord2)
            ctx.lineTo(xCord2, yCord1)
            ctx.lineTo(xCord1, yCord1)
            ctx.stroke()
        }
        
    }

    
    useEffect(() => {
        
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        if (props.ch == 729){
            context.canvas.width = 500; // original 224
            context.canvas.height = 729; // original 224
        }
        else if(props.ch == 500){
            context.canvas.width = 1000; // original 224
            context.canvas.height = 1000; // original 224
        }
        
        context.clearRect(0, 0, context.canvas.width, context.canvas.height)
      //Our draw came here
        const render = () => {
            if(props.ch == 500){
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

                

                //drawing lines between the joints
                drawLines(context, props.lw.left_wrist?.x, props.lw.left_wrist?.y, props.le.left_elbow?.x, props.le.left_elbow?.y, '#44ff00')
                drawLines(context, props.le.left_elbow?.x, props.le.left_elbow?.y, props.ls.left_shoulder?.x, props.ls.left_shoulder?.y, '#44ff00')
                drawLines(context, props.ls.left_shoulder?.x, props.ls.left_shoulder?.y, props.n.neck?.x, props.n.neck?.y, '#44ff00')
                drawLines(context, props.n.neck?.x, props.n.neck?.y, props.h.head?.x, props.h.head?.y, '#DC00FF')
                drawLines(context, props.n.neck?.x, props.n.neck?.y, props.rs.right_shoulder?.x, props.rs.right_shoulder?.y, '#FF0000')
                drawLines(context, props.rs.right_shoulder?.x, props.rs.right_shoulder?.y, props.re.right_elbow?.x, props.re.right_elbow?.y, '#FF0000')
                drawLines(context, props.re.right_elbow?.x, props.re.right_elbow?.y, props.rw.right_writs?.x, props.rw.right_writs?.y, '#FF0000')
                drawLines(context, props.n.neck?.x, props.n.neck?.y, props.t.torso?.x, props.t.torso?.y, '#DC00FF')
                drawLines(context, props.t.torso?.x, props.t.torso?.y, props.lh.left_hip?.x, props.lh.left_hip?.y, '#44ff00')
                drawLines(context, props.t.torso?.x, props.t.torso?.y, props.rh.right_hip?.x, props.rh.right_hip?.y, '#FF0000')
                drawLines(context, props.lh.left_hip?.x, props.lh.left_hip?.y, props.lk.left_knee?.x, props.lk.left_knee?.y, '#44ff00')
                drawLines(context, props.lk.left_knee?.x, props.lk.left_knee?.y, props.la.left_ankle?.x, props.la.left_ankle?.y, '#44ff00')
                drawLines(context, props.rh.right_hip?.x, props.rh.right_hip?.y, props.rk.right_knee?.x, props.rk.right_knee?.y, '#FF0000')
                drawLines(context, props.rk.right_knee?.x, props.rk.right_knee?.y, props.ra.right_ankle?.x, props.ra.right_ankle?.y, '#FF0000')
            }
            else if(props.ch == 729){
                //boundry box points
                draw(context, props.tl.topLeft?.x, props.tl.topLeft?.y, 'tl')
                draw(context, props.br.bottomRight?.x, props.br.bottomRight?.y, 'br')
                drawBoundryBox(context, props.tl.topLeft?.x, props.tl.topLeft?.y, props.br.bottomRight?.x, props.br.bottomRight?.y)
            }
            
        }
        render()
      
      
    }, [draw])
    
    return <canvas ref={canvasRef} {...props}/>
  }
  
  export default Canvas