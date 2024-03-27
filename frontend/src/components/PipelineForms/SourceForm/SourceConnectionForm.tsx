import { useState } from "react";
import {
  SourceFormConnectionDetails,
  rawTablesAndColumnsData,
  AlertSeverity,
} from "../../../types/types";
import SourceForm from "./SourceForm";
import SelectDataForm from "./SelectDataForm";

const SourceConnectionForm = ({
  handleNext,
  showAlertSnackbar,
}: {
  handleNext: () => void;
  showAlertSnackbar: (message: string, severity: AlertSeverity) => void;
}) => {
  const [formStateObj, setFormStateObj] = useState<SourceFormConnectionDetails>(
    {
      host: "",
      port: "",
      dbName: "",
      user: "",
      password: "",
      connectionName: "",
    }
  );

  const [isValidSourceConnection, setIsValidSourceConnection] =
    useState<boolean>(false);

  const [rawTablesAndColumnsData, setrawTablesAndColumnsData] =
    useState<rawTablesAndColumnsData>([]);

  return (
    <>
      {!isValidSourceConnection && (
        <SourceForm
          formStateObj={formStateObj}
          setFormStateObj={setFormStateObj}
          setIsValidSourceConnection={setIsValidSourceConnection}
          setrawTablesAndColumnsData={setrawTablesAndColumnsData}
          showAlertSnackbar={showAlertSnackbar}
        />
      )}

      {isValidSourceConnection && (
        <>
          <SelectDataForm
            rawTablesAndColumnsData={rawTablesAndColumnsData}
            formStateObj={formStateObj}
            handleNext={handleNext}
            showAlertSnackbar={showAlertSnackbar}
            setFormStateObj={setFormStateObj}
          />
        </>
      )}
    </>
  );
};

export default SourceConnectionForm;
