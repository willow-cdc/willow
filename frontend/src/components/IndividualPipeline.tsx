import { Typography, Box, Container, Grid } from "@mui/material";
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { PipeLine } from '../types/types';
import { getPipeLineById } from '../services/pipelines';
import Source from './Source';
import Sink from "./Sink";

const IndividualPipeline = () => {
  const { pipeline_id } = useParams();
  const [pipeLineData, setPipeLineData] = useState<PipeLine>(null);

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
          <Source pipeLineData={pipeLineData}/>
        </Grid>
        <Grid item xs={6}>
          <Sink pipeLineData={pipeLineData}/>
        </Grid>
      </Grid>
    </Container>
  );
};

export default IndividualPipeline;
