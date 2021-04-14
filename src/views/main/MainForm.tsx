import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }),
);

const onSelectFileHandler = (event: any) => {
  if (event && event.target.value) {
    console.log(event.target.value);
  }
}

const MainForm = () => {
  const classes = useStyles();

  return (
    <div>
      <form className={classes.root} noValidate autoComplete="off">
        <div className="form-control">
          <label className="mr2">Input API Key</label>
          <Grid item sm={12}>
            <Input type="password" placeholder="API Key" name="apiKey" required fullWidth />
          </Grid>
        </div>
        <div className="form-control">
          <label className="mr2">Input Origin Address</label>
          <Grid item sm={12}>
            <Input placeholder="Origin Address" name="apiKey" required fullWidth />
          </Grid>
        </div>
        <div>
          <label className="mr2">Select File CSV</label>
          <Grid item sm={12}>
            <Input type="file" placeholder="File CSV" name="inputFile" onChange={(e) => onSelectFileHandler(e)} fullWidth />
          </Grid>
        </div>
        <div className={`${classes.root} center`}>
          <Button variant="contained" color="primary">
            Export Result
          </Button>
          <Button variant="contained" color="secondary">
            Reset
          </Button>
        </div>
      </form>
    </div>
  )
}

export default MainForm
