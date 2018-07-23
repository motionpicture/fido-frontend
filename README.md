# Features


# Usage

## Environment variables

| Name                                | Required | Value            | Purpose                                 |
|-------------------------------------|----------|------------------|-----------------------------------------|
| `NODE_ENV`                          | true     |                  | 環境名                                  |
| `NPM_TOKEN`                         | true     |                  | npm トークン                            |
| `REDIS_HOST`                        | true     |                  | REDISホスト                             |
| `REDIS_PORT`                        | true     |                  | REDISポート                             |
| `REDIS_KEY`                         | true     |                  | REDISキー                               |
| `API_ENDPOINT`                      | true     |                  | API エンドポイント                 |
| `CLIENT_ID`                         | true     |                  | クライアントID                           |
| `CLIENT_SECRET`                     | true     |                  | クライアントSECRET                       |
| `CLIENT_ID_OAUTH2`                  | true     |                  | OAUTH2クライアントID                     |
| `CLIENT_SECRET_OAUTH2`              | true     |                  | OAUTH2クライアントSECRET                 |
| `AUTHORIZE_SERVER_DOMAIN`           | true     |                  | 認可サーバードメイン                      |
| `OAUTH2_SERVER_DOMAIN`              | true     |                  | OAUTH2認可サーバードメイン                |
| `RESOURCE_SERVER_URL`               | true     |                  | リソースサーバーURL                      |
| `AUTH_REDIRECT_URI`                 | true     |                  | サインインリダイレクトURL                 |
| `AUTH_LOGUOT_URI`                   | true     |                  | サインアウトリダイレクトURL               |
| `COA_ENDPOINT`                      | true     |                  | COA API エンドポイント                   |
| `COA_REFRESH_TOKEN`                 | true     |                  | COA API リフレッシュトークン              |
| `ALLOWED_IPS`                       | false    |                  | IP制限IPリスト(カンマ区切り)              |
| `BASIC_AUTH_NAME`                   | false    |                  | ベーシック認証ID                         |
| `BASIC_AUTH_PASS`                   | false    |                  | ベーシック認証PASS                       |
| `MAINTENANCE_TIME`                  | false    |                  | メンテナンス期間(カンマ区切り)                      |
| `MAINTENANCE_TEXT`                  | false    |                  | メンテナンス文言(BASE64エンコード)                       |
| `DEBUG`                             | false    | fido-frontend:*   | デバッグ                                |

## Azure Environment variables

| Name                                | Required | Value            | Purpose                                 |
|-------------------------------------|----------|------------------|-----------------------------------------|
| `WEBSITE_NODE_DEFAULT_VERSION`      | true     |                  | node.jsバージョン                        |
| `WEBSITE_TIME_ZONE`                 | true     |                  | タイムゾーン設定(Tokyo Standard Time)     |


# Build

ビルドは以下で実行できます。
- typescript
```shell
npm run build
```

# Tests

構文チェックは以下で実行できます。

```shell
npm run check
```

# JsDoc

```shell
npm run jsdoc
```

`jsdocを作成できます。./docsに出力されます。
