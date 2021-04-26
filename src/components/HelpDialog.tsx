import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

const useStyles = makeStyles({
  codeWrapper: {
    backgroundColor: '#ddd'
  },
});

export interface HelpDialogProps {
  open: boolean;
  onClose: (value: any) => void;
}

export default function HelpDialog(props: HelpDialogProps) {
  const classes = useStyles();
  const { onClose, open } = props;

  const handleClose = () => {
    onClose('');
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="dialog-title" open={open}>
      <DialogTitle id="dialog-title">Help</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Please follow the example below for the input file csv.
          The header row and the columns "districtName", "wardName" are required and should not be empty.
        </DialogContentText>
        <h4>Example:</h4>
        <div className={classes.codeWrapper}>
          <code>
            "no","districtCode","districtName","wardCode","wardName"<br/>
            "1","760","Quận 1","26734","Phường Tân Định"<br/>
            "2","760","Quận 1","26737","Phường Đa Kao"<br/>
            "3","760","Quận 1","26740","Phường Bến Nghé"<br/>
            "4","760","Quận 1","26743","Phường Bến Thành"
          </code>
        </div>
      </DialogContent>
    </Dialog>
  );
}
