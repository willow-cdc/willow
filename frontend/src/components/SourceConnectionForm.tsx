import { useState } from "react";
import {
  SourceFormConnectionDetails,
  rawTablesAndColumnsData,
} from "../types/types";
import SourceForm from "./SourceForm";
import SelectDataForm from "./SelectDataForm";

const SourceConnectionForm = ({ handleNext }: { handleNext: () => void }) => {
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

  console.log("RAAAAW", rawTablesAndColumnsData);

  return (
    <>
      {!isValidSourceConnection && (
        <SourceForm
          formStateObj={formStateObj}
          setFormStateObj={setFormStateObj}
          isValidSourceConnection={isValidSourceConnection}
          setIsValidSourceConnection={setIsValidSourceConnection}
          setrawTablesAndColumnsData={setrawTablesAndColumnsData}
        />
      )}

      {isValidSourceConnection && (
        <SelectDataForm
          rawTablesAndColumnsData={rawTablesAndColumnsData}
          formStateObj={formStateObj}
          handleNext={handleNext}
        />
      )}
    </>
  );
};

export default SourceConnectionForm;
