import { ChangeEvent, FC, useState } from "react";
import { uploadMapFile } from "../apiClient";

const MapFileUpload: FC = () => {
  const [file, setFile] = useState<File>();

  const onFileChange = (evt: ChangeEvent<HTMLInputElement>) => setFile(evt.target.files?.[0]);

  const uploadFile = async () => {
    if (file) {
      await uploadMapFile(file);
    }
  };

  return (
    <div>
      <input type="file" accept=".kmz" onChange={onFileChange} />
      <button onClick={uploadFile} disabled={!file}>
        Upload map file
      </button>
    </div>
  );
};

export default MapFileUpload;
