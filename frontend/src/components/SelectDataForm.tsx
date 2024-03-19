import {
  Grid,
  Typography,
  Container,
  Box,
  Switch,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
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
          columns: ["id", "data", "asdasda", "ggdfgdfgf"],
        },
      ],
    },
    {
      schema_name: "public2",
      tables: [
        {
          table_name: "demo2",
          columns: ["id", "data", "asdasda", "ggdfgdfgf"],
        },
        {
          table_name: "demo3",
          columns: ["id", "data", "asdasda", "ggdfgdfgf"],
        },
      ],
    },
  ],
};

/*

[
  {
    "table_name": "test",
    "schema_name": "public",
    "dbzTableValue": "public.test",
    "columns": [{"column": "id", "selected": true, "dbzColumnValue": "public.test.id"}, {"column": "data", "selected": true, "dbzColumnValue": "public.test.data"}],
    "selected": true
  }
]
*/

type SelectDataFormColumnObj = {
  column: string;
  selected: boolean;
  dbzColumnValue: string;
};

interface SelectDataFormDataObj {
  table_name: string;
  schema_name: string;
  dbzTableValue: string;
  columns: SelectDataFormColumnObj[];
  selected: boolean;
}

type SelectDataFormData = SelectDataFormDataObj[];

const SelectDataForm = () => {
  const [formData, setFormData] = useState<SelectDataFormData>([]);
  const [activeColumns, setActiveColumns] = useState<SelectDataFormColumnObj[]>(
    []
  );

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

  const handleColumTableDisplay = (value: string) => {
    const [schema, table] = value.split(".");
    const formDataObj = formData.find(
      (obj) => obj.schema_name === schema && obj.table_name === table
    );

    if (formDataObj != undefined) {
      const columnArrClone = formDataObj.columns.map((obja) => {
        return { ...obja };
      });
      setActiveColumns(columnArrClone);
    }
  };

  const handleColumnSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    const [schema, table, column] = value.split(".");

    let newActiveArr!: SelectDataFormColumnObj[];
    setFormData((old) => {
      return old.map((obj) => {
        if (obj.schema_name !== schema || obj.table_name !== table) {
          return obj;
        } else {
          const newObj = { ...obj };
          const newArr = newObj.columns.map((c) => {
            if (c.column !== column) {
              return c;
            } else {
              return { ...c, selected: event.target.checked };
            }
          });
          newObj.columns = newArr;
          newActiveArr = newArr.map((obja) => {
            return { ...obja };
          });
          return newObj;
        }
      });
    });

    setActiveColumns(newActiveArr);
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
          dbzTableValue: `${mockData.data[i].schema_name}.${currentTable.table_name}`,
          columns: currentTable.columns.map((column) => {
            return {
              column,
              selected: true,
              dbzColumnValue: `${mockData.data[i].schema_name}.${currentTable.table_name}.${column}`,
            };
          }),
          selected: true, // should we default this to false?
        });
      }
    }
    setFormData(result);
  }, []);
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
        <Typography marginTop={4} variant="h4" gutterBottom>
          Tables and Columns
        </Typography>
        <Typography marginBottom={2} variant="body1" gutterBottom>
          Please select the tables you would like to capture and stream.
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box
              height={300}
              overflow={"auto"}
              sx={{ background: "#D9D9D9", borderRadius: 2 }}
            >
              <List
                subheader={
                  <ListSubheader sx={{ background: "#D9D9D9" }}>
                    Tables
                  </ListSubheader>
                }
              >
                {formData.map((data) => {
                  return (
                    <ListItem
                      sx={{ padding: 0 }}
                      key={`${data.schema_name}.${data.table_name}`}
                      secondaryAction={
                        <Switch
                          color="willowGreen"
                          checked={data.selected}
                          onChange={handleTableSwitchChange}
                          value={`${data.schema_name}.${data.table_name}`}
                          inputProps={{
                            "aria-label": `${data.schema_name}.${data.table_name}`,
                          }}
                        />
                      }
                    >
                      <ListItemButton
                        onClick={() =>
                          handleColumTableDisplay(
                            `${data.schema_name}.${data.table_name}`
                          )
                        }
                        sx={{ paddingTop: 0, paddingBottom: 0 }}
                      >
                        <ListItemText primary={data.table_name}></ListItemText>
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box
              height={300}
              overflow={"auto"}
              sx={{ background: "#D9D9D9", borderRadius: 2 }}
            >
              {activeColumns.length > 1 && (
                <List
                  subheader={
                    <ListSubheader sx={{ background: "#D9D9D9" }}>
                      Columns
                    </ListSubheader>
                  }
                >
                  {activeColumns.map((data) => {
                    return (
                      <ListItem
                        sx={{ padding: 0 }}
                        key={data.dbzColumnValue}
                        secondaryAction={
                          <Switch
                            color="willowGreen"
                            checked={data.selected}
                            onChange={(e) =>
                              handleColumnSwitchChange(e, data.dbzColumnValue)
                            }
                            value={data.dbzColumnValue}
                            inputProps={{
                              "aria-label": data.dbzColumnValue,
                            }}
                          />
                        }
                      >
                        <ListItemText
                          sx={{ paddingLeft: 2 }}
                          primary={data.column}
                        ></ListItemText>
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default SelectDataForm;
