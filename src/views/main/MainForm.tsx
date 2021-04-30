import React, { FormEvent, useEffect, useState } from 'react';
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
import Helpers from '../../utils/helpers';
import { DEFAULT_DEST_CITY, DEFAULT_ORIGIN_ADDR, MAX_ELEMENTS } from '../../utils/constants';

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
      fontFamily: 'arial',
      padding: '10px',
      marginTop: '40px'
    },
    formControl: {
      marginBottom: '10px',
    },
    formLabel: {
      marginRight: '10px',
      fontWeight: 'bold'
    },
    defaultValue: {
      fontSize: '10px',
      color: '#888',
      margin: '5px',
      verticalAlign: 'top',
      cursor: 'pointer'
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
  const [outPutFilePath, setOutputFilePath] = useState('');
  const [inputFileName, setInputFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProcess, setLoadingProcess] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [autoHideDuration, setAutoHideDuration] = useState<number | null>(2000);
  const [alertMessage, setAlertMessage] = useState('');
  const [proceedChunkData, setProceedChunkData] = useState<IDataRow[][]>([]);
  const [distanceCalcInstance, setDistanceCalcInstance] = useState<DistanceCalculator>(new DistanceCalculator({ apiKey }));
  const [processFileInstance, setProcessFileInstance] = useState<ProcessFile>(new ProcessFile({ filePath: inputFilePath }));
  const [processDataInstance, setProcessDataInstance] = useState<ProcessData>(new ProcessData());

  useEffect(() => {
    console.log('proceedChunkData', proceedChunkData);
    if (proceedChunkData.length) {
      setIsLoading(true);
      const virtualDataStreamInstance = new VirtualDataStream();
      virtualDataStreamInstance.pushData(proceedChunkData);
      // init process bar
      setLoadingProcess(0);
      let outData: IDataRow[] = [];
      virtualDataStreamInstance.on('data', async (chunk) => {
        try {
          const chunkDataCalculated = await distanceCalcInstance.calcDistanceChunks({ chunkData: chunk, fromAddr: originAddr });
          outData = outData.concat(chunkDataCalculated);
          console.log('virtualDataStreamInstance.processPercent', virtualDataStreamInstance.getProcessPercent());
          setLoadingProcess(virtualDataStreamInstance.getProcessPercent());
          // end push data stream
          const isPushedDone = virtualDataStreamInstance.getIsPushedDone();
          if (isPushedDone) {
            virtualDataStreamInstance.endPush();
          }
        } catch (error) {
          setIsLoading(false);
          setLoadingProcess(0);
          virtualDataStreamInstance.destroy();
          showErrorMessage(error.message);
        }
      });
      virtualDataStreamInstance.on('end', async () => {
        setIsLoading(false);
        setLoadingProcess(0);
        if (!outData.length) {
          console.log('Out data is empty');
        }
        // handle write file
        try {
          console.log('Out data item: ', outData[0]);
          const header = Object.keys(outData[0]).map(value => {
            return { id: value, title: value }
          });
          await processFileInstance.writeFileAsync(header, outData);
          showMessage('Exported file succeed');
        } catch (error) {
          showErrorMessage(error.message);
        }
      });
    }
    return () => {
      console.log('clean-up')
    }
  }, [proceedChunkData]);

  const onExportClick = async (event: FormEvent) => {
    event.preventDefault();

    if (!inputFilePath) {
      setShowAlert(true);
      setAlertMessage('(!) Please select file CSV');
      return;
    }

    // set parameters
    distanceCalcInstance.setApiKey(apiKey);
    processFileInstance.setFilePath(inputFilePath);
    const inputFileData = await processFileInstance.readFilePromise();
    const chunkData = processDataInstance.processToChunks({ inputData: inputFileData, maxChunk: MAX_ELEMENTS, destCityName: destCity });
    setProceedChunkData(chunkData);
  }

  const onResetClick = (event: FormEvent): void => {
    event.preventDefault();
    setApiKey('');
    setDestCity('');
    setOriginAddr('');
    setInputFileName('');
    setInputFilePath('');
    setOutputFilePath('');
  }

  const onChangeInputFile = (event: any): void => {
    const file = event.target.files[0];
    if (file) {
      setInputFileName(event.target.value);
      setInputFilePath(file.path);
      const outPath = Helpers.getOutPath(file.path);
      setOutputFilePath(outPath);
    } else {
      setInputFileName(inputFileName);
    }
  }

  const showMessage = (message: string) => {
    setAutoHideDuration(2000);
    setShowAlert(true);
    setAlertMessage(message);
  }

  const showErrorMessage = (message: string) => {
    setAutoHideDuration(null);
    setShowAlert(true);
    setAlertMessage(`Error: ${message}`);
  }

  return (
    <div className={classes.mainForm}>
      <form className={classes.root} autoComplete="off" onSubmit={onExportClick}>
        <div className={classes.formControl}>
          <label className={classes.formLabel}>Input API Key</label>
          <Grid item sm={12}>
            <Input type="password" placeholder="API Key" name="apiKey" value={apiKey} onChange={(event) => setApiKey(event.target.value)} required fullWidth />
          </Grid>
        </div>
        <div className={classes.formControl}>
          <label className={classes.formLabel}>
            Input Destination City
            <span title="Use default value" className={classes.defaultValue}
              onClick={() => setDestCity(DEFAULT_DEST_CITY)}>(!)
            </span>
          </label>
          <Grid item sm={12}>
            <Input type="text" placeholder="i.e Ho Chi Minh City"
            name="destCity" value={destCity} onChange={(event) => setDestCity(event.target.value)} required fullWidth />
          </Grid>
        </div>
        <div className={classes.formControl}>
          <label className={classes.formLabel}>
            Input Origin Address
            <span title="Use default value" className={classes.defaultValue}
              onClick={() => setOriginAddr(DEFAULT_ORIGIN_ADDR)}>(!)
            </span>
          </label>
          <Grid item sm={12}>
            <Input placeholder="i.e. LOTTE Mart Quận 7, Nguyễn Hữu Thọ, Tân Hưng, District 7" name="originAddr" value={originAddr} onChange={(event) => setOriginAddr(event.target.value)} required fullWidth />
          </Grid>
        </div>
        <div>
          <Grid item sm={12}>
            <input
              type="file"
              accept=".csv"
              style={{'display': 'none'}}
              id="contained-button-file"
              onChange={(event) => onChangeInputFile(event)}
            />
            <label htmlFor="contained-button-file">
              <Button variant="contained" component="span">
                Select File CSV
              </Button>
            </label>
            <Input type="text" name="inputFilePath" readOnly value={inputFilePath} required fullWidth />
          </Grid>
        </div>
        <div className={classes.formControl} style={!outPutFilePath ? {'display': 'none'} : {}}>
          <label className={classes.formLabel}>Output File Path</label>
          <Grid item sm={12}>
            <Input disabled name="outPath" value={outPutFilePath} fullWidth />
          </Grid>
        </div>
        <div className={`${classes.root} center`}>
          <Button type="submit" variant="contained" color="primary">
            Export Result
          </Button>
          <Button type="button" variant="contained" color="default" onClick={onResetClick}>
            Reset
          </Button>
        </div>
      </form>
      <Backdrop className={classes.backdrop} open={isLoading}>
        <CircularStatic progress={loadingProcess} />
      </Backdrop>
      <Snackbar
        open={showAlert}
        autoHideDuration={autoHideDuration}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClick={() => setShowAlert(false)}
        onClose={() => setShowAlert(false)}
        message={alertMessage}
      />
    </div>
  )
}

export default MainForm
