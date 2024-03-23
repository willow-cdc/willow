import { PipeLineObj } from '../types/types';
import { TableRow, TableCell } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PipelineTableRow = ({ row }: { row: PipeLineObj }) => {
  const navigate = useNavigate();

  return (
    <TableRow
      onClick={() => navigate(`/pipelines/${row.pipeline_id}`)}
      hover
      sx={{
        '&:last-child td, &:last-child th': { border: 0 },
        cursor: 'pointer',
      }}
    >
      <TableCell component="th" scope="row">
        {row.pipeline_id}
      </TableCell>
      <TableCell align="center">{row.source_name}</TableCell>
      <TableCell align="center">{row.sink_name}</TableCell>
    </TableRow>
  );
};

export default PipelineTableRow;
