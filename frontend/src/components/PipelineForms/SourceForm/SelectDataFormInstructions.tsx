import { Typography } from "@mui/material";

const SelectDataFormInstructions = () => {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        SELECT DATA
      </Typography>
      <Typography variant="body1" gutterBottom>
        Please select the tables and columns you would like to listen to, and provide
        a unique name for this source connection. At least one table must be selected. 
      </Typography>
      <Typography marginTop={4} variant="h4" gutterBottom>
        Tables and Columns
      </Typography>
    </>
  );
};

export default SelectDataFormInstructions;
