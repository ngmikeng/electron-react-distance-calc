import React, { FormEvent, useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import ProcessFile from '../../utils/processFile';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    formControl: {
      marginBottom: '10px',
    },
    formLabel: {
      marginRight: '10px',
      fontWeight: 'bold'
    }
  }),
);

const MainForm = () => {
  const classes = useStyles();
  const [apiKey, setApiKey] = useState('');
  const [destCity, setDestCity] = useState('');
  const [originAddr, setOriginAddr] = useState('');
  const [inputFilePath, setInputFilePath] = useState('');
  const [inputFileName, setInputFileName] = useState('');

  const onExportClick = async (event: FormEvent) => {
    event.preventDefault();
    console.log(event);
    console.log(apiKey);
    console.log(destCity);
    console.log(originAddr);
    console.log(inputFilePath);

    const processFile = new ProcessFile({ filePath: inputFilePath });
    const data = await processFile.readFilePromise();

    console.log(data);

    return data;
  }

  const onResetClick = (event: FormEvent): void => {
    event.preventDefault();
    setApiKey('');
    setDestCity('');
    setOriginAddr('');
    setInputFileName('');
    setInputFilePath('');
  }

  const onChangeInputFile = (event: any): void => {
    console.log(event)
    const file = event.target.files[0];
    if (file) {
      console.log(file);
      readFileHandler(file);
      setInputFileName(event.target.value);
      setInputFilePath(file.path);
    }
  }

  const readFileHandler = (file: File) => {
    const reader = new FileReader();
    reader.onload = (evt: any) => {
      console.log(evt.target.result);
    };
    reader.onprogress = (evt: any) => {
      console.log('process', evt)
    };
    reader.readAsText(file);
  }

  return (
    <div>
      <form className={classes.root} autoComplete="off" onSubmit={onExportClick}>
        <div className={classes.formControl}>
          <label className={classes.formLabel}>Input API Key</label>
          <Grid item sm={12}>
            <Input type="password" placeholder="API Key" name="apiKey" value={apiKey} onChange={(event) => setApiKey(event.target.value)} required fullWidth />
          </Grid>
        </div>
        <div className={classes.formControl}>
          <label className={classes.formLabel}>Input Destination City</label>
          <Grid item sm={12}>
            <Input type="text" placeholder="Destination City" name="destCity" value={destCity} onChange={(event) => setDestCity(event.target.value)} required fullWidth />
          </Grid>
        </div>
        <div className={classes.formControl}>
          <label className={classes.formLabel}>Input Origin Address</label>
          <Grid item sm={12}>
            <Input placeholder="Origin Address" name="originAddr" value={originAddr} onChange={(event) => setOriginAddr(event.target.value)} required fullWidth />
          </Grid>
        </div>
        <div>
          <label className={classes.formLabel}>Select File CSV</label>
          <Grid item sm={12}>
            <Input type="file" placeholder="File CSV" name="inputFilePath" value={inputFileName} onChange={(event) => onChangeInputFile(event)} fullWidth required />
          </Grid>
        </div>
        <div className={`${classes.root} center`}>
          <Button type="submit" variant="contained" color="primary">
            Export Result
          </Button>
          <Button type="button" variant="contained" color="secondary" onClick={onResetClick}>
            Reset
          </Button>
        </div>
      </form>
    </div>
  )
}

export default MainForm
