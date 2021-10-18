import { ChangeEvent, FC, useState } from "react";
import { uploadMapFile } from "../apiClient";
import { PrimitiveAtom, useAtom } from "jotai";

interface Props {
  lastMapUploadTimeAtom: PrimitiveAtom<number>;
}

const MapFileUpload: FC<Props> = ({ lastMapUploadTimeAtom }) => {
  const [lastMapUploadTime, setLastMapUploadTime] = useAtom(lastMapUploadTimeAtom);
  const [file, setFile] = useState<File>();

  const onFileChange = (evt: ChangeEvent<HTMLInputElement>) => setFile(evt.target.files?.[0]);

  const uploadFile = async () => {
    if (file) {
      await uploadMapFile(file);
      setLastMapUploadTime(Date.now());
    }
  };

  return (
    <div>
      <input key={lastMapUploadTime} type="file" accept=".kmz" onChange={onFileChange} />
      <button onClick={uploadFile} disabled={!file}>
        Upload map file
      </button>
    </div>
  );
};

export default MapFileUpload;
