# Town Square - Candidate Assessment

## Development
```
docker compose up --build -d
```

## Install library
```
docker compose exec -ti server yarn add typeorm
```

## Create migration 
```
    docker compose exec -ti server yarn typeorm migration:generate -n InitialMigration
```

## Create mock data
```
    docker compose exec -ti graphql yarn seed
```

