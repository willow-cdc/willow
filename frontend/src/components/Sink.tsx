import { Typography, List, ListItem, ListItemText, Box } from '@mui/material';
import { PipeLineObj } from '../types/types';

const Sink = ({ pipeLineData }: { pipeLineData: PipeLineObj }) => {
  return (
    <Box
      height={550}
      overflow={'auto'}
      sx={{ background: '#D9D9D9', borderRadius: 2, paddingTop: 2 }}
    >
      <Typography variant="h6" align="center">
        Sink
      </Typography>
      <List>
        <ListItem>
          <ListItemText
            primary={'Sink Name:'}
            secondary={pipeLineData.sink_name}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={'Sink Url:'}
            secondary={pipeLineData.sink_url}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={'Sink User:'}
            secondary={pipeLineData.sink_user}
          />
        </ListItem>
      </List>
    </Box>
  );
};

export default Sink;
