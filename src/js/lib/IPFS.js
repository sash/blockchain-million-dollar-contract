import ipfsAPI from "ipfs-api";
import config from '../config';


export default async (file) => {
    console.log(file);
    return new Promise(function(resolve, reject){

        let reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = async () => {
            let fileBuffer = Buffer.from(reader.result);


            const connection = ipfsAPI(config.ipfs.server.host, config.ipfs.server.port, {protocol: 'http'});
            let ipfsRes = await connection.add(fileBuffer);
            resolve(ipfsRes[0].hash);
        };

        // Read in the image file as a data URL.
        reader.readAsArrayBuffer(file);
    });


}