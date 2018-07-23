// tslint:disable:no-http-string
/**
 * 環境変数dev
 */
export const environment = {
    production: false,
    version: '1.0.0',

    ENV: 'development',

    API_ENDPOINT: 'https://sskts-api-development.azurewebsites.net',
    WAITER_ENDPOINT: 'https://sskts-waiter-development.appspot.com',

    PORTAL_SITE: 'https://motionpicture.jp',

    REGION: 'ap-northeast-1', // identity poolのリージョンを指定する
    IDENTITY_POOL_ID: 'ap-northeast-1:6a67f523-93c3-4766-b96f-6552f21abd8d', // IDENTITY POOLのID(AWS CONSOLEで確認)
    USER_POOL_ID: '',
    CLIENT_ID: '',

    REKOGNITION_BUCKET: 'rekognition-pics',
    ALBUM_NAME: 'usercontent',
    BUCKET_REGION: 'us-east-1',

    DDB_TABLE_NAME: 'LoginTrail',
    TOKEN_ISSUER: '',

    ANALYTICS_ID: 'UA-99018492-4'

};
