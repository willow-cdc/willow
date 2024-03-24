import React from "react";
import { Typography, List, ListItem, ListItemText, Box } from "@mui/material";
import { PipeLine } from "../types/types";

const Source = ({ pipeLineData }: { pipeLineData: PipeLine }) => {
  return (
    <Box
      height={550}
      overflow={"auto"}
      sx={{ background: "#D9D9D9", borderRadius: 2, paddingTop: 2 }}
    >
      <Typography variant="h6" align="center">
        Source
      </Typography>
      <List>
        <ListItem>
          <ListItemText
            primary={"Source name:"}
            secondary={pipeLineData.source_name}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={"Database:"}
            secondary={pipeLineData.source_database}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={"Host:"}
            secondary={pipeLineData.source_host}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={"Port name:"}
            secondary={pipeLineData.source_port}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={"User:"}
            secondary={pipeLineData.source_user}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={"Tables:"}
            secondary={
              <React.Fragment>
                {pipeLineData.tables.map((table) => {
                  return (
                    <Typography
                      key={table}
                      sx={{
                        marginLeft: 3,
                        display: "block",
                        fontSize: "0.875rem",
                      }}
                      component="span"
                    >
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
  );
};

export default Source;
