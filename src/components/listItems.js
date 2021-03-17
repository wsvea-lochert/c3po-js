import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import StorageIcon from '@material-ui/icons/Storage';
import AssignmentIcon from '@material-ui/icons/Assignment';
import {Link} from 'react-router-dom'

export const mainListItems = (
  <div>
      <Link to="/">
        <ListItem button>
            <ListItemIcon>
                <DashboardIcon />
            </ListItemIcon>
        <ListItemText primary="Dashboard" />
        </ListItem>
    </Link>

    <Link to="/UploadFiles">
    <ListItem button>
      <ListItemIcon>
        <StorageIcon />
      </ListItemIcon>
      <ListItemText primary="Upload" />
    </ListItem>
    </Link>
  </div>
);

export const secondaryListItems = (
  <div>
    
  </div>
);