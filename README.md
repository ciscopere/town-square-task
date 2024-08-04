# Town Square - Candidate Assessment

## Development
```
docker compose up --build -d
```

## Install library
```
docker compose exec -ti graphql yarn add typeorm
```

## Create migration 
```
    docker compose exec -ti graphql yarn typeorm migration:generate -n InitialMigration
```

## Create mock data
```
    docker compose exec -ti graphql yarn seed
```

