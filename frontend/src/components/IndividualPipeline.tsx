import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { useParams } from 'react-router-dom';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import React from 'react';
import { useState, useEffect } from 'react';
import { PipeLineObj } from '../types/types';
import { getPipeLineById } from '../services/pipelines';
// path = /pipelines/:pipeline_id

const IndividualPipeline = () => {
  const { pipeline_id } = useParams();
  const [pipeLineData, setPipeLineData] = useState<PipeLineObj>(null);

  useEffect(() => {
    const fetchPipeLineData = async () => {
      try {
        const data = await getPipeLineById(Number(pipeline_id))
        setPipeLineData(data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchPipeLineData()
  }, [pipeline_id])


  if (!pipeLineData) {
    return null
  }
  
  return (
    <Container sx={{ mt: '5%' }}>
      <Box sx={{ textAlign: 'center', mb: '20px' }}>
        <Typography component={'h1'} variant={'h5'}>
          Pipeline {pipeLineData.pipeline_id}
        </Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Box
            height={550} // I think if you get rid of this it will grow with the content
            overflow={'auto'}
            sx={{ background: '#D9D9D9', borderRadius: 2, paddingTop: 2 }}
          >
            <Typography variant="h6" align="center">
              Source
            </Typography>

            <List>
              <ListItem>
                <ListItemText primary={'Source name:'} secondary={pipeLineData.source_database} />
              </ListItem>
              <ListItem>
                <ListItemText primary={'Database:'} secondary={pipeLineData.source_database} />
              </ListItem>
              <ListItem>
                <ListItemText primary={'Host:'} secondary={pipeLineData.source_host} />
              </ListItem>
              <ListItem>
                <ListItemText primary={'Port name:'} secondary={pipeLineData.source_port} />
              </ListItem>
              <ListItem>
                <ListItemText primary={'User:'} secondary={pipeLineData.source_user} />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={'Tables:'}
                  secondary={
                    <React.Fragment>
                      {pipeLineData.tables.map((table) => {
                        return (
                          <Typography key={table} sx={{ marginLeft: 3, display: 'block' }} component='span' >
                            {table}
                          </Typography>
                        );
                      })}
                    </React.Fragment>
                  }
                />
              </ListItem>
            </List>
          </Box>
        </Grid>
        <Grid item xs={6}>
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
                <ListItemText primary={'Sink User:'} secondary={pipeLineData.sink_user} />
              </ListItem>
            </List>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default IndividualPipeline;
