import { Typography } from '@mui/material';

const SelectDataFormInstructions = () => {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        SELECT DATA
      </Typography>
      <Typography variant="body1" gutterBottom>
        Instructions for data: tables, settings, schema. Instructions for data:
        tables, settings, schema. Instructions for data: tables, settings,
        schema. Instructions for data: tables, settings, schema. Instructions
        for data: tables, settings, schema.
      </Typography>
      <Typography marginTop={4} variant="h4" gutterBottom>
        Tables and Columns
      </Typography>
      <Typography marginBottom={2} variant="body1" gutterBottom>
        Please select the tables you would like to capture and stream.
      </Typography>
    </>
  );
};

export default SelectDataFormInstructions;
