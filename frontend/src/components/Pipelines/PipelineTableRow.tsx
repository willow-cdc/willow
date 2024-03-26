import { PipeLineArr, PipeLineMinimal } from "../../types/types";
import { TableRow, TableCell, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { deletePipelineById } from "../../services/pipelines";

interface PipeLineTableRowProps {
  row: PipeLineMinimal;
  setpipelinesData: React.Dispatch<React.SetStateAction<PipeLineArr>>;
}

const PipelineTableRow = ({ row, setpipelinesData }: PipeLineTableRowProps) => {
  const navigate = useNavigate();

  const handleDelete = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    try {
      await deletePipelineById(Number(row.pipeline_id));
      setpipelinesData((prev) =>
        prev.filter((obj) => obj.pipeline_id !== row.pipeline_id)
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TableRow
      onClick={() => navigate(`/pipelines/${row.pipeline_id}`)}
      hover
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
        cursor: "pointer",
      }}
    >
      <TableCell component="th" scope="row">
        {row.pipeline_id}
      </TableCell>
      <TableCell align="center">{row.source_name}</TableCell>
      <TableCell align="center">{row.sink_name}</TableCell>
      <TableCell align="center">
        <Box onClick={handleDelete}>
          <DeleteIcon />
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default PipelineTableRow;
