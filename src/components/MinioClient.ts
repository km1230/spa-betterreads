import * as Minio from 'minio';
const minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: process.env.VUE_APP_MINIO_ACCESSKEY,
    secretKey: process.env.VUE_APP_MINIO_ACCESSKEY
});

export default minioClient;