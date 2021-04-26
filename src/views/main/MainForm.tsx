import React, { FormEvent, useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import ProcessFile from '../../utils/processFile';
import Backdrop from '@material-ui/core/Backdrop';
import CircularStatic from '../../components/CircularStatis';
import ProcessData from '../../utils/processData';
import { VirtualDataStream } from '../../utils/dataStream';
import { IDataRow } from '../../model';
import { DistanceCalculator } from '../../utils/distance';
import Snackbar from '@material-ui/core/Snackbar';
import HelpDialog from '../../components/HelpDialog';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    mainForm: {
      position: 'relative',
      color: '#444',
      height: 'auto',
      background: '#cdcdcd',
      fontFamily: 'arial'
      // overflowY: 'hidden',
      // display: 'flex',
      // justifyContent: 'center',
      // alignItems: 'center'
    },
    formControl: {
      marginBottom: '10px',
    },
    formLabel: {
      marginRight: '10px',
      fontWeight: 'bold'
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }),
);

const MainForm = () => {
  const classes = useStyles();
  const [apiKey, setApiKey] = useState('');
  const [destCity, setDestCity] = useState('');
  const [originAddr, setOriginAddr] = useState('');
  const [inputFilePath, setInputFilePath] = useState('');
  const [inputFileName, setInputFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProcess, setLoadingProcess] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showHelpDialog, setShowHelpDialog] = useState(false);

  const onExportClick = async (event: FormEvent) => {
    event.preventDefault();
    console.log(apiKey);
    console.log(destCity);
    console.log(originAddr);
    console.log(inputFilePath);

    const distanceCalc = new DistanceCalculator({ apiKey });
    const processFile = new ProcessFile({ filePath: inputFilePath });
    const data = await processFile.readFilePromise();
    console.log(data);
    // map destination address
    const newData: IDataRow[] = data.map(item => {
      return {...item, destAddr: `${item.wardName}, ${item.districtName}, ${destCity}`}
    });
    // process chunk data
    const processData = new ProcessData({ inputData: newData });
    const chunkData = processData.processToChunks({ maxChunk: 2 });
    const virtualDataStream = new VirtualDataStream({ chunkData });
    virtualDataStream.pushData();
    // init process bar
    setLoadingProcess(0);
    let outData: IDataRow[] = [];
    virtualDataStream.on('data', async (chunk) => {
      try {
        const chunkDataCalculated = await distanceCalc.calcDistanceChunksFake({ chunkData: chunk, fromAddr: originAddr });
        outData = outData.concat(chunkDataCalculated);
        console.log('VirtualDataStream.processPercent', virtualDataStream.getProcessPercent());
        setLoadingProcess(virtualDataStream.getProcessPercent());
        // end push data stream
        const isPushedDone = virtualDataStream.getIsPushedDone();
        if (isPushedDone) {
          virtualDataStream.endPush();
        }
      } catch (error) {
        virtualDataStream.destroy();
      }
    });
    virtualDataStream.on('end', async () => {
      setIsLoading(false);
      if (!outData.length) {
        console.log('Out data is empty');
      }
      // handle write file
      try {
        console.log('Out data item: ', outData[0]);
        const header = Object.keys(outData[0]).map(value => {
          return { id: value, title: value }
        });
        await processFile.writeFileAsync(header, outData);
        setShowAlert(true);
        setAlertMessage('Exported file succeed');
      } catch (error) {
        setShowAlert(true);
        setAlertMessage(`Error: ${error.message}`);
      }
    });

    setIsLoading(true);

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
    const file = event.target.files[0];
    if (file) {
      setInputFileName(event.target.value);
      setInputFilePath(file.path);
    }
  }

  return (
    <div className={classes.mainForm}>
      <Button type="button" variant="contained" color="default" onClick={(e) => setShowHelpDialog(true)}>
        Help
      </Button>
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
      <Backdrop className={classes.backdrop} open={isLoading}>
        <CircularStatic progress={loadingProcess} />
      </Backdrop>
      <Snackbar
        open={showAlert}
        autoHideDuration={1200}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={(e) => setShowAlert(false)}
        message={alertMessage}
      />
      <HelpDialog open={showHelpDialog} onClose={(value) => setShowHelpDialog(false)} />
    </div>
  )
}

export default MainForm
