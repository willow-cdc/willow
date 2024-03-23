import { Grid, Box, List, ListSubheader } from '@mui/material';
import { PropsWithChildren } from 'react';

interface GridBoxListProps {
  xs: number;
  heading: string;
  showChildren: boolean;
}

const HEX_COLOR = '#D9D9D9';

const GridBoxList = ({ xs, children, heading, showChildren }: PropsWithChildren<GridBoxListProps>) => {
  return (
    <Grid item xs={xs}>
      <Box
        height={300}
        overflow={'auto'}
        sx={{ background: HEX_COLOR, borderRadius: 2 }}
      >
        <List
          subheader={
            <ListSubheader sx={{ background: HEX_COLOR }}>{heading}</ListSubheader>
          }
        >
        {showChildren && children}
        </List>
      </Box>
    </Grid>
  );
};

export default GridBoxList;
