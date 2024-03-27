import { Container } from "@mui/material";
import { useState } from "react";
import { AlertSeverity, RedisConnectionDetails } from "../../../types/types";
import RedisSinkConnectionForm from "./RedisSinkConnectionForm";
import RedisSinkVerifyConnectionForm from "./RedisSinkVerifyConnectionForm";
import { useContext } from "react";
import TopicsContext from "../../../context/TopicsContext";

const RedisSinkForm = ({
  showAlertSnackbar,
}: {
  showAlertSnackbar: (message: string, severity: AlertSeverity) => void;
}) => {
  const [formStateObj, setFormStateObj] = useState<RedisConnectionDetails>({
    url: "",
    username: "",
    password: "",
  });

  const [isValidConnection, setIsValidConnection] = useState(false);
  const { topics } = useContext(TopicsContext);

  return (
    <>
      <Container maxWidth="md">
        <RedisSinkVerifyConnectionForm
          isValidConnection={isValidConnection}
          setIsValidConnection={setIsValidConnection}
          formStateObj={formStateObj}
          setFormStateObj={setFormStateObj}
          showAlertSnackbar={showAlertSnackbar}
        />

        {isValidConnection && (
          <RedisSinkConnectionForm
            topics={topics}
            url={formStateObj.url}
            username={formStateObj.username}
            password={formStateObj.password}
            showAlertSnackbar={showAlertSnackbar}
          />
        )}
      </Container>
    </>
  );
};

export default RedisSinkForm;
