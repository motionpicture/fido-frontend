// tslint:disable:no-http-string
/**
 * 環境変数test
 */
export const environment = {
    production: false,
    version: '1.0.0',

    APP_NAME: 'fido-frontend',
    ENV: 'test',

    API_ENDPOINT: 'https://sskts-api-test.azurewebsites.net',
    WAITER_ENDPOINT: 'https://sskts-waiter-test.appspot.com',

    PORTAL_SITE: 'https://motionpicture.jp',

    REGION: 'ap-northeast-1', // identity poolのリージョンを指定する
    IDENTITY_POOL_ID: 'ap-northeast-1:b153d3f1-5e67-468e-8c69-ab938cf3d21e', // IDENTITY POOLのID(AWS CONSOLEで確認)
    USER_POOL_ID: '',
    CLIENT_ID: '',

    REKOGNITION_BUCKET: 'rekognition-pics',
    ALBUM_NAME: 'usercontent',
    BUCKET_REGION: 'us-east-1',

    DDB_TABLE_NAME: 'LoginTrail',
    TOKEN_ISSUER: '',

    ANALYTICS_ID: 'UA-99018492-5'

};
