import { Client } from 'basic-ftp';
import { Readable } from 'stream';

export const synologyUpload = async (stream: Readable, path: string) => {
    const client = new Client();
    await client.access({
        host: "10-0-0-117.senestore.direct.quickconnect.to",
        user: "sene",
        password: "Racheland1",
        port: 21,
    });

    await client.uploadFrom(stream, path);
}