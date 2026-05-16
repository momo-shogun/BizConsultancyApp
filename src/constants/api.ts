/** Edit this to point at your backend (must include `/api` prefix). */
export const API_BASE_URL = 'http://192.168.0.154:3001/api';

/** Origin for API-hosted assets (legacy paths only). */
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

/** S3 public uploads (matches web `NEXT_PUBLIC_AWS_*`). */
export const AWS_REGION = 'ap-south-1';
export const AWS_BUCKET_NAME = 'consultancy-iid-new';

/** Virtual-hosted S3 base — prepend object key from API (`consultant/...`, etc.). */
export const AWS_S3_PUBLIC_BASE_URL = `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com`;
