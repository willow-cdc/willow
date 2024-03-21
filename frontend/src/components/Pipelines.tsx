// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import { Container, ListItemButton, ListItemText } from "@mui/material";
// import Grid from "@mui/material/Grid";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const mockData = {
  data: [
    {
      source_name: "source12",
      source_database: "test",
      source_host: "0.tcp.ngrok.io",
      source_port: 10244,
      source_user: "postgres",
      sink_name: "sink1",
      sink_url:
        "redis://redis-14994.c256.us-east-1-2.ec2.cloud.redislabs.com:14994",
      sink_user: "default",
      pipeline_id: 1,
      tables: ["demo"],
    },
    {
      source_name: "secondsource",
      source_database: "test",
      source_host: "0.tcp.ngrok.io",
      source_port: 10244,
      source_user: "postgres",
      sink_name: "secondsink",
      sink_url:
        "redis://redis-14994.c256.us-east-1-2.ec2.cloud.redislabs.com:14994",
      sink_user: "default",
      pipeline_id: 2,
      tables: ["demo", "numbers"],
    },
    {
      source_name: "publication_test_source",
      source_database: "test",
      source_host: "0.tcp.ngrok.io",
      source_port: 10244,
      source_user: "postgres",
      sink_name: "publication_test_sink",
      sink_url:
        "redis://redis-14994.c256.us-east-1-2.ec2.cloud.redislabs.com:14994",
      sink_user: "default",
      pipeline_id: 3,
      tables: ["demo", "publication_test", "numbers"],
    },
    {
      source_name: "seconddbsource",
      source_database: "alexbair",
      source_host: "0.tcp.ngrok.io",
      source_port: 10244,
      source_user: "alexbair",
      sink_name: "seconddbsink",
      sink_url:
        "redis://redis-14994.c256.us-east-1-2.ec2.cloud.redislabs.com:14994",
      sink_user: "default",
      pipeline_id: 4,
      tables: ["test"],
    },
  ],
};

const Pipelines = () => {
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
          {mockData.data.map((row) => (
            <TableRow
              hover
              key={row.pipeline_id}
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Pipelines;
