import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';

import List from '@material-ui/core/List';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import HomeIcon from '@material-ui/icons/Home';
import {useHistory} from 'react-router-dom';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});


const menu = [
  {label:'Home', icon: (<HomeIcon/>), message: ''}, 
  {label:'Users', icon: (<InboxIcon/>), message: 'user'}, 
  {label:'Past Papers', icon: (<MenuBookIcon/>), message: 'pastpapers'},
  {label:'Feedback', icon: (<InboxIcon/>), message: 'feedback'}
]

export default function TemporaryDrawer({open, onClose, onMessage}) {
  const classes = useStyles();
  const history = useHistory();

  console.log(`Drawer: ${open}`)

  const handleClick= (message) => history.push(`/${message}`)
  const sideList = () => (
    <div
      className={classes.list}
      role="presentation"
      onClick={() => onClose(false)}
      onKeyDown={() => onClose(false)}
    >
      <List>
        {menu.map((menuItem, index) => (
          <ListItem button key={index} onClick={()=> {console.log(`clicked ${menuItem.message}`); handleClick(menuItem.message)}}>
            <ListItemIcon>{menuItem.icon}</ListItemIcon>
            <ListItemText primary={menuItem.label} />
          </ListItem>
        ))}
      </List>
      
    </div>
  );

  return (
    <div>
      <Drawer open={open} onClose={() => onClose(false)}>
        {sideList()}
      </Drawer>
    </div>
  );
}
