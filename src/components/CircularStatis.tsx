import React from 'react';
import CircularProgress, { CircularProgressProps } from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    colorTextPrimary: {
      color: 'white'
    }
  }),
);

function CircularProgressWithLabel(props: CircularProgressProps & { value: number }) {
  const classes = useStyles()
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" {...props} color="secondary" />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" component="div" classes={classes} color="textPrimary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

export default function CircularStatic({ progress }: { progress: number }) {
  // const [progress, setProgress] = React.useState(10);

  // React.useEffect(() => {
  //   const timer = setInterval(() => {
  //     setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
  //   }, 800);
  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, []);

  return <CircularProgressWithLabel value={progress} />;
}
