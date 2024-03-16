import {
  Button,
  TextField,
  Grid,
  Typography,
  Container,
  Box,
  FormControlLabel,
  FormGroup,
  Switch,
} from "@mui/material";
import { useEffect, useState } from "react";

const mockData = {
  data: [
    {
      schema_name: "public",
      tables: [
        {
          table_name: "demo",
          columns: ["id", "data"],
        },
        {
          table_name: "demo2",
          columns: ["id", "data"],
        },
      ],
    },
    {
      schema_name: "public2",
      tables: [
        {
          table_name: "demo",
          columns: ["id", "data"],
        },
        {
          table_name: "demo2",
          columns: ["id", "data"],
        },
      ],
    },
  ],
};

/*

[
  {
    table_name: 'test',
    schema: 'public',
    columns: ["id", "data"],
    selected: true
  },
  {
    table_name: 'test',
    schema: 'public',
    columns: ["id", "data"],
    selected: true
  },
  {
    table_name: 'test',
    schema: 'public',
    columns: ["id", "data"],
    selected: false
  }
]

"table.include.list": ["public.table1", "public.table2"]
*/

const SelectDataForm = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const result = [];
  });

  return (
    <>
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom>
          SELECT DATA
        </Typography>
        <Typography variant="body1" gutterBottom>
          Instructions for data: tables, settings, schema. Instructions for
          data: tables, settings, schema. Instructions for data: tables,
          settings, schema. Instructions for data: tables, settings, schema.
          Instructions for data: tables, settings, schema.
        </Typography>
        <Typography variant="h4" gutterBottom>
          Tables and Columns
        </Typography>
        <Typography variant="body1" gutterBottom>
          Please select the tables you would like to capture and stream.
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box height={300} sx={{ background: "#D9D9D9", borderRadius: 2 }}>
              {/* list of tables here */}
              <FormGroup>
                {mockData["data"].map((data) => {
                  return data["tables"].map((table) => {
                    return (
                      <FormControlLabel
                        control={<Switch />}
                        label={table.table_name}
                        name={`${data.schema_name} ${table.table_name}`}
                      />
                    );
                  });
                })}
              </FormGroup>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box
              height={300}
              sx={{ background: "#D9D9D9", borderRadius: 2 }}
            ></Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default SelectDataForm;
