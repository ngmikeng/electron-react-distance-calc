import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);

export default function TheAppBar() {
  const classes = useStyles();
  const [darkMode, setDarkMode] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDarkMode(event.target.checked);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            MyDist
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={<Switch checked={darkMode} onChange={handleChange} aria-label="mode" />}
              label={'Dark Mode'}
            />
          </FormGroup>
        </Toolbar>
      </AppBar>
    </div>
  );
}
