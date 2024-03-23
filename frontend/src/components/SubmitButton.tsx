import { Box, Button } from "@mui/material";

interface SubmitButtonProps {
  onClick?: () => void;
  content?: string;
}

const SubmitButton = ({ onClick, content }: SubmitButtonProps )=> {
  content = content || 'Submit';

  return (
    <Box marginTop={3} display="flex" justifyContent="center">
      <Button
        onClick={onClick}
        color="willowGreen"
        type="submit"
        variant="contained"
      >
        {content}
      </Button>
    </Box>
  );
};

export default SubmitButton;
