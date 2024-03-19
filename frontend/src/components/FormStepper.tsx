import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import SourceConnectionForm from './SourceConnectionForm';
import RedisSinkForm from './RedisSinkForm';
import { useState } from 'react';

const steps = ['CONNECT TO SOURCE', 'CONNECT TO CACHE'];

export default function FormStepper() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const handleNext = () => {
    //guarding against going beyond the number of steps
    if (activeStep + 1 <= 2) {
      setActiveStep((prev) => prev + 1);
    } else {
      console.log('steps complete');
    }
  };

  const renderForm = () => {
    switch (activeStep) {
      case 0:
        return <SourceConnectionForm handleNext={handleNext} />;
      case 1:
        return <RedisSinkForm />;
      default:
        throw new Error('Unknown step');
    }
  };

  return (
    <Box sx={{ marginBottom: 10, width: '100%' }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {renderForm()}
    </Box>
  );
}
