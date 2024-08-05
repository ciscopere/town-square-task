# Town Square - Candidate Assessment

## Development
```
docker compose up --build -d
```

## Create migration 
```
    docker compose exec -ti backend yarn typeorm migration:generate -n MigrationName
```

## Create mock data
```
    docker compose exec -ti backend yarn seed
```

