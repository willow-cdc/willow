import {
  Grid,
  Container,
} from "@mui/material";
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
import ListItemWithSwitch from "./ListItemWithSwitch";

interface SelectDataFormProps {
  rawTablesAndColumnsData: rawTablesAndColumnsData;
  formStateObj: SourceFormConnectionDetails;
  handleNext: () => void;
  showAlertSnackbar: (message: string, severity: AlertSeverity) => void;
}

const SelectDataForm = ({
  rawTablesAndColumnsData,
  formStateObj,
  handleNext,
  showAlertSnackbar,
}: SelectDataFormProps) => {
  const [formData, setFormData] = useState<SelectDataFormData>([]);
  const [activeColumns, setActiveColumns] = useState<SelectDataFormColumnObj[]>([]);
  const { setTopics } = useContext(TopicsContext);

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

  const handleKafkaConnectSubmit = async () => {
    const submissionObj = { ...formStateObj, formData };
    const topics = submissionObj.formData
      .filter((obj) => obj.selected === true)
      .map((obj) => `${submissionObj.connectionName}.${obj.dbzTableValue}`);
    try {
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

    rawTablesAndColumnsData.forEach(schemaTables => {
      schemaTables.tables.forEach(table => {
        const hasPrimaryKeys = table.primaryKeys.length > 0;
        const schemaName = schemaTables.schema_name;
        const tableName = table.table_name;
        const columns = table.columns.map(column => {
          return {
            column,
            selected: true, 
            dbzColumnValue: `${schemaName}.${tableName}.${column}`}
        })
        
        result.push({
          table_name: tableName,
          schema_name: schemaName,
          dbzTableValue: `${schemaName}.${tableName}`,
          columns,
          selected: hasPrimaryKeys,
          visible: hasPrimaryKeys,
        })
      })
    })

    setFormData(result);
  }, [rawTablesAndColumnsData]);

  return (
    <>
      <Container maxWidth="md">
        <SelectDataFormInstructions />
        <Grid container spacing={2}>
          <GridBoxList xs={6} heading='Tables' showChildren={true}>
            {formData.map((data) => {
              const value = `${data.schema_name}.${data.table_name}`

              return (
                data.visible &&
                  <ListItemWithSwitch 
                    key={value} 
                    value={value} 
                    selected={data.selected} 
                    text={data.table_name} 
                    onSwitchChange={handleTableSwitchChange} 
                    onButtonClick={() => handleColumnTableDisplay(value)}
                  />
                );
              })}
          </GridBoxList>
          <GridBoxList xs={6} heading='Columns' showChildren={activeColumns.length > 0}>
            {activeColumns.map((data) => {
              const value = data.dbzColumnValue;

              return (
                <ListItemWithSwitch 
                  key={value} 
                  value={value} 
                  selected={data.selected} 
                  text={data.column} 
                  onSwitchChange={(e) => handleColumnSwitchChange(e, value)} 
                />
              );
            })}
          </GridBoxList>
        </Grid>
        <SubmitButton onClick={handleKafkaConnectSubmit}/>
      </Container>
    </>
  );
};

export default SelectDataForm;
