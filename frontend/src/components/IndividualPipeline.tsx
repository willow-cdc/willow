import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useParams } from "react-router-dom";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import { useState, useEffect } from "react";

// path = /pipelines/:pipeline_id

const mockData = [
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
    tables: ["demo", "publication_testttttt", "numbers"],
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
];

const IndividualPipeline = () => {
  const { pipeline_id } = useParams();

  
  return (
    <Container sx={{ mt: "5%" }}>
      <Box sx={{ textAlign: "center", mb: "20px" }}>
        <Typography component={"h1"} variant={"h5"}>
          Pipeline {mockData[0].pipeline_id}
        </Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Box
            height={550} // I think if you get rid of this it will grow with the content
            overflow={"auto"}
            sx={{ background: "#D9D9D9", borderRadius: 2, paddingTop: 2 }}
          >
            <Typography variant="h6" align="center">
              Source
            </Typography>

            <List>
              <ListItem>
                <ListItemText primary={"Source name:"} secondary="second" />
              </ListItem>
              <ListItem>
                <ListItemText primary={"Database:"} secondary="second" />
              </ListItem>
              <ListItem>
                <ListItemText primary={"Host:"} secondary="second" />
              </ListItem>
              <ListItem>
                <ListItemText primary={"Port name:"} secondary="second" />
              </ListItem>
              <ListItem>
                <ListItemText primary={"User:"} secondary="second" />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={"Tables:"}
                  secondary={
                    <React.Fragment>
                      {mockData[2].tables.map((table) => {
                        return (
                          <Typography sx={{ marginLeft: 3 }} variant="body2">
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
            overflow={"auto"}
            sx={{ background: "#D9D9D9", borderRadius: 2, paddingTop: 2 }}
          >
            <Typography variant="h6" align="center">
              Sink
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary={"Sink Name:"} secondary="Hi my name is :)" />
              </ListItem>
              <ListItem>
                <ListItemText primary={"Sink Url:"} secondary="redis://redis-14994.c256.us-east-1-2.ec2.cloud.redislabs.com:14994" />
              </ListItem>
              <ListItem>
                <ListItemText primary={"Sink User:"} secondary="second" />
              </ListItem>
            </List>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default IndividualPipeline;
