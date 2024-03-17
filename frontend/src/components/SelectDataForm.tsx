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
          table_name: "demo3",
          columns: ["id", "data", "asdasd"],
        },
      ],
    },
  ],
};

/*

[
  {
    table_name: 'test',
    schema_name: 'public',
    columns: [{column: "id", selected: true, dbzColumnValue: "public.test.id"}, {column: "data", selected: true, dbzColumnValue: "public.test.data"}],
    selected: true
  },
]

"table.include.list": ["public.table1", "public.table2"]
*/

type ColumnObj = { column: string; selected: boolean; dbzColumnValue: string };

interface SelectDataFormDataObj {
  table_name: string;
  schema_name: string;
  columns: ColumnObj[];
  selected: boolean;
}

type SelectDataFormData = SelectDataFormDataObj[];

const SelectDataForm = () => {
  const [formData, setFormData] = useState<SelectDataFormData>([]);

  const handleTableSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((old) =>
      old.map((obj) => {
        if (`${obj.schema_name}.${obj.table_name}` === event.target.value) {
          return { ...obj, selected: event.target.checked };
        } else {
          return obj;
        }
      })
    );
  };

  useEffect(() => {
    const result = [];

    for (let i = 0; i < mockData.data.length; i++) {
      const currentSchemaTables = mockData.data[i].tables;
      for (let j = 0; j < currentSchemaTables.length; j++) {
        const currentTable = currentSchemaTables[j];
        result.push({
          table_name: currentTable.table_name,
          schema_name: mockData.data[i].schema_name,
          columns: currentTable.columns.map((column) => {
            return {
              column,
              selected: true,
              dbzColumnValue: `${mockData.data[i].schema_name}.${currentTable.table_name}.${column}`,
            };
          }),
          selected: true,
        });
      }
    }
    setFormData(result);
  }, []);
  console.log(formData);
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
            <Box
              height={300}
              sx={{ background: "#D9D9D9", borderRadius: 2, padding: 2 }}
            >
              {/* list of tables here */}
              <FormGroup>
                {formData.map((data) => {
                  return (
                    <FormControlLabel
                      key={`${data.schema_name}.${data.table_name}`}
                      control={
                        <Switch
                          checked={data.selected}
                          onChange={handleTableSwitchChange}
                          value={`${data.schema_name}.${data.table_name}`}
                        />
                      }
                      label={data.table_name}
                    />
                  );
                })}
              </FormGroup>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box
              height={300}
              sx={{ background: "#D9D9D9", borderRadius: 2, padding: 2 }}
            ></Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default SelectDataForm;
