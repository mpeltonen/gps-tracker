import { ChangeEvent, FC, useState } from "react";
import { uploadMapFile } from "../apiClient";
import { useQueryClient } from "react-query";

const MapFileUpload: FC = () => {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File>();
  const [lastUploadTime, setLastUploadTime] = useState(Date.now());

  const onFileChange = (evt: ChangeEvent<HTMLInputElement>) => setFile(evt.target.files?.[0]);

  const uploadFile = async () => {
    if (file) {
      await uploadMapFile(file);
      setLastUploadTime(Date.now());
      await queryClient.invalidateQueries("getMaps");
    }
  };

  return (
    <div>
      <input key={lastUploadTime} type="file" accept=".kmz" onChange={onFileChange} />
      <button onClick={uploadFile} disabled={!file}>
        Upload map file
      </button>
    </div>
  );
};

export default MapFileUpload;
