# Town Square - Candidate Assessment

## Deployment
### Backend

#### Create backend App
```
cd backend

heroku create town-square-task-backend

heroku stack:set container -a town-square-task-frontend

heroku config:set CORS_ORIGIN={frontend_url} -a town-square-task-backend
```

#### Push changes and release
```
heroku container:push web -a town-square-task-backend

heroku container:release web -a town-square-task-backend
```

#### Run migrations
```
heroku run yarn typeorm migration:run
```

#### Create mock data
```
heroku run yarn seed
```

### Frontend
```
cd frontend
```

#### Create frontend App
```
cd frontend

heroku create town-square-task-frontend

heroku stack:set container -a town-square-task-frontend
```

#### Push changes and release
```
heroku container:push web -a town-square-task-frontend

heroku container:release web -a town-square-task-frontend
```

## Local Development

### Start docker
```
docker compose up --build -d
```

### Run migrations
```
docker compose exec -ti backend yarn typeorm migration:run
```

### Create mock data
```
docker compose exec -ti backend yarn seed
```

## Development tools

### Create a migration 
```
docker compose exec -ti backend yarn typeorm migration:generate src/migrations/{name}
```



