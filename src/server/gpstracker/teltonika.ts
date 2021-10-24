import net, { Socket } from "net";

const PORT = 7001;

interface GPSPosition {
  ts: number;
  lat: number;
  lon: number;
}

const gpsPositions: { [k: string]: GPSPosition } = {};

const tcpConnectionHandler = (socket: Socket) => {
  console.log(`Connection from ${socket.remoteAddress}:${socket.remotePort}`);
  let imei: string | null = null;

  socket.on("data", (buf: Buffer) => {
    const preamble16 = buf.readUInt16BE(0);
    if (preamble16 > 0) {
      imei = handleInitialIMEIMessage(socket, buf);
    } else {
      if (!imei) {
        throw new Error("Bug. Illegal state.");
      }
      handleAVLMessage(imei, socket, buf);
    }
  });

  socket.on("close", () => {
    console.log(`Connection from ${socket.remoteAddress}:${socket.remotePort} closed`);
  });
};

const acceptImei = (ignored: string) => {
  return true;
};

const handleInitialIMEIMessage = (socket: Socket, buf: Buffer) => {
  const imeiLength = buf.readUInt16BE(0);
  const imei = buf.toString("ascii", 2, imeiLength + 2);
  console.log(`Connection offer for IMEI ${imei}.`);
  const accept = acceptImei(imei);
  socket.write(Buffer.from([accept ? 1 : 0]));
  return accept ? imei : null;
};

const handleAVLMessage = (imei: string, socket: Socket, buf: Buffer) => {
  const msgLength = buf.readUInt32BE(4);
  const codecType = `0x${buf.readUInt8(8).toString(16).toUpperCase()}`;
  const numRecords = buf.readUInt8(9);
  console.log(`Received AVL message for codec ${codecType}, length: ${msgLength} bytes, ${numRecords} data records.`);

  const b = Buffer.alloc(4);
  b.writeInt32BE(numRecords, 0);
  socket.write(b);

  const codec = codecs[codecType];
  if (codec) {
    const position = codec(buf);
    gpsPositions[imei] = position;
  } else {
    console.log(`No handler for codec ${codecType}`);
  }
};

const codec8 = (buf: Buffer): GPSPosition => {
  const ts = new Date(Number(buf.readBigUInt64BE(10)));
  const priority = buf.readUInt8(18);
  const lon = buf.readInt32BE(19);
  const lat = buf.readInt32BE(23);
  console.log(`Time: ${ts.toLocaleString("fi")}, Priority: ${priority}, Latitude: ${lat}, Longitude: ${lon}`);
  return { ts: ts.getMilliseconds(), lat, lon };
};

const codecs: Record<string, (buf: Buffer) => GPSPosition> = {
  "0x8": codec8,
  "0x8E": codec8,
};

export const start = () => {
  net
    .createServer()
    .listen(PORT, () => {
      console.log(`Started Teltonika protocol TCP listener on port ${PORT}`);
    })
    .on("connection", tcpConnectionHandler);
};
