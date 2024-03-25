import { Grid, Container, Typography } from "@mui/material";
import { useEffect, useState, useContext } from "react";
import {
  AlertSeverity,
  SelectDataFormColumnObj,
  SelectDataFormData,
  SourceFormConnectionDetails,
  rawTablesAndColumnsData,
} from "../types/types";
import { postSourceKafkaConnect } from "../services/source";
import TopicsContext from "../context/TopicsContext";
import SelectDataFormInstructions from "./SelectDataFormInstructions";
import SubmitButton from "./SubmitButton";
import GridBoxList from "./GridBoxList";
import { isOneTableSelected } from "../utils/validation";
import TableListItemWithSwitch from "./TableListItemSwitch";
import ColumnListItemWithSwitch from "./ColumnListItemSwitch";
import ConnectionNameTextField from "./ConnectionNameTextField";

interface SelectDataFormProps {
  rawTablesAndColumnsData: rawTablesAndColumnsData;
  formStateObj: SourceFormConnectionDetails;
  handleNext: () => void;
  showAlertSnackbar: (message: string, severity: AlertSeverity) => void;
  setFormStateObj: React.Dispatch<
    React.SetStateAction<SourceFormConnectionDetails>
  >;
}

const SelectDataForm = ({
  rawTablesAndColumnsData,
  formStateObj,
  handleNext,
  showAlertSnackbar,
  setFormStateObj,
}: SelectDataFormProps) => {
  const [formData, setFormData] = useState<SelectDataFormData>([]);
  const [activeColumns, setActiveColumns] = useState<SelectDataFormColumnObj[]>(
    []
  );
  const { setTopics } = useContext(TopicsContext);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleListItemSelectedStyle = (index: number) => {
    setSelectedIndex(index);
  };

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormStateObj((prevState) => {
      return { ...prevState, [event.target.name]: event.target.value };
    });
  }

  const handleTableSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) =>
      prev.map((obj) => {
        if (`${obj.schema_name}.${obj.table_name}` === event.target.value) {
          return { ...obj, selected: event.target.checked };
        } else {
          return obj;
        }
      })
    );
  };

  const handleColumnTableDisplay = (value: string) => {
    const [schema, table] = value.split(".");
    const formDataObj = formData.find(
      (obj) => obj.schema_name === schema && obj.table_name === table
    );

    if (formDataObj) {
      const columnArrClone = formDataObj.columns.map((obj) => {
        return { ...obj };
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
    setFormData((prev) => {
      return prev.map((obj) => {
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

  const handleKafkaConnectSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    try {
      isOneTableSelected(formData);
      const submissionObj = { ...formStateObj, formData };
      const topics = submissionObj.formData
        .filter((obj) => obj.selected === true)
        .map((obj) => `${submissionObj.connectionName}.${obj.dbzTableValue}`);
      console.log(submissionObj);
      await postSourceKafkaConnect(submissionObj);
      showAlertSnackbar("Data selection successful.", "success");
      handleNext();
      setTopics(topics);
    } catch (error) {
      showAlertSnackbar("An error occured. Please try again.", "error");
      console.log(error);
    }
  };

  useEffect(() => {
    const result: SelectDataFormData = [];
    console.log(rawTablesAndColumnsData);
    rawTablesAndColumnsData.forEach((schemaTables) => {
      schemaTables.tables.forEach((table) => {
        const hasPrimaryKeys = table.primaryKeys.length > 0;
        const schemaName = schemaTables.schema_name;
        const tableName = table.table_name;
        const columns = table.columns.map((column) => {
          const isPrimaryKey = table.primaryKeys.includes(column);
          return {
            column,
            selected: true,
            dbzColumnValue: `${schemaName}.${tableName}.${column}`,
            isPrimaryKey,
          };
        });

        result.push({
          table_name: tableName,
          schema_name: schemaName,
          dbzTableValue: `${schemaName}.${tableName}`,
          columns,
          selected: hasPrimaryKeys,
          visible: hasPrimaryKeys,
        });
      });
    });

    setFormData(result);
  }, [rawTablesAndColumnsData]);

  return (
    <>
      <Container maxWidth="md">
        <form onSubmit={handleKafkaConnectSubmit}>
          <SelectDataFormInstructions />
          <Grid container spacing={2}>
            <GridBoxList xs={6} heading="Tables" showChildren={true}>
              {formData.map((data, index) => {
                const value = `${data.schema_name}.${data.table_name}`;
                const isFocused = index === selectedIndex;
                return (
                  data.visible && (
                    <TableListItemWithSwitch
                      key={value}
                      value={value}
                      selected={data.selected}
                      text={data.table_name}
                      onSwitchChange={handleTableSwitchChange}
                      onButtonClick={() => {
                        handleListItemSelectedStyle(index);
                        handleColumnTableDisplay(value);
                      }}
                      isFocused={isFocused}
                    />
                  )
                );
              })}
            </GridBoxList>
            <GridBoxList
              xs={6}
              heading="Columns"
              showChildren={activeColumns.length > 0}
            >
              {activeColumns.map((data) => {
                const value = data.dbzColumnValue;

                return (
                  <ColumnListItemWithSwitch
                    key={value}
                    value={value}
                    selected={data.selected}
                    text={data.column}
                    onSwitchChange={(e) => handleColumnSwitchChange(e, value)}
                    isPrimaryKey={data.isPrimaryKey}
                  />
                );
              })}
            </GridBoxList>
            <Grid item xs={12}>
              <ConnectionNameTextField
                handleChange={handleChange}
                formStateObj={formStateObj}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography margin={-2} align="center" variant="body2">
                Provide a unique name for this source connection.
              </Typography>
            </Grid>
          </Grid>
          <SubmitButton />
        </form>
      </Container>
    </>
  );
};

export default SelectDataForm;
