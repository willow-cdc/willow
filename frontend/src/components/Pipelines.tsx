import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { getAllPipelines } from "../services/pipelines";
import { PipeLineArr } from "../types/types";
import PipelineTableRow from "./PipelineTableRow";

const Pipelines = () => {
  const [pipelinesData, setpipelinesData] = useState<PipeLineArr>([]);

  useEffect(() => {
    const fetchPipeLinesData = async () => {
      try {
        const data = await getAllPipelines();
        setpipelinesData(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPipeLinesData();
  }, []);

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      style={{ marginTop: "5rem", minWidth: 1000 }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Pipeline</TableCell>
            <TableCell align="center">Source</TableCell>
            <TableCell align="center">Sink</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pipelinesData.map((row) => 
            <PipelineTableRow key={row.pipeline_id} row={row}/>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Pipelines;
