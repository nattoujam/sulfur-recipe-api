# sulfur-database-api

## run server

1. `packages/database/.env.template`を同じディレクトリにコピーして、`.env`を作成

2. サーバーの起動

```bash
cd docker
docker compose up -d
```

3. 初回起動のみ、seed データを追加

```bash
docker compose exec -it api npm -w database run seed
```
