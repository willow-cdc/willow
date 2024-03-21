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
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  SelectDataFormColumnObj,
  SelectDataFormData,
  SourceFormConnectionDetails,
  rawTablesAndColumnsData,
} from "../types/types";
import { postSourceKafkaConnect } from "../services/source";
import { useContext } from "react";
import TopicsContext from "../context/TopicsContext";

const SelectDataForm = ({
  rawTablesAndColumnsData,
  formStateObj,
  handleNext,
}: {
  rawTablesAndColumnsData: rawTablesAndColumnsData;
  formStateObj: SourceFormConnectionDetails;
  handleNext: () => void;
}) => {
  const [formData, setFormData] = useState<SelectDataFormData>([]);
  const [activeColumns, setActiveColumns] = useState<SelectDataFormColumnObj[]>(
    []
  );
  const { setTopics } = useContext(TopicsContext);

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

  const handleKafkaConnectSubmit = async () => {
    const submissionObj = { ...formStateObj, formData };
    const topics = submissionObj.formData
      .filter((obj) => obj.selected === true)
      .map((obj) => `${submissionObj.connectionName}.${obj.dbzTableValue}`);
    try {
      console.log(submissionObj);
      await postSourceKafkaConnect(submissionObj);
      handleNext();
      setTopics(topics);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const result = [];

    for (let i = 0; i < rawTablesAndColumnsData.length; i++) {
      const currentSchemaTables = rawTablesAndColumnsData[i].tables;
      for (let j = 0; j < currentSchemaTables.length; j++) {
        const currentTable = currentSchemaTables[j];
        const hasPrimaryKeys = currentTable.primaryKeys.length > 0;
        result.push({
          table_name: currentTable.table_name,
          schema_name: rawTablesAndColumnsData[i].schema_name,
          dbzTableValue: `${rawTablesAndColumnsData[i].schema_name}.${currentTable.table_name}`,
          columns: currentTable.columns.map((column) => {
            return {
              column,
              selected: true,
              dbzColumnValue: `${rawTablesAndColumnsData[i].schema_name}.${currentTable.table_name}.${column}`,
            };
          }),
          selected: hasPrimaryKeys,
          visible: hasPrimaryKeys,
        });
      }
    }
    setFormData(result);
  }, [rawTablesAndColumnsData]);
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
                    data.visible &&
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
              {activeColumns.length > 0 && (
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
        <Box marginTop={3} display="flex" justifyContent="center">
          <Button
            onClick={handleKafkaConnectSubmit}
            color="willowGreen"
            type="submit"
            variant="contained"
          >
            Submit
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default SelectDataForm;
