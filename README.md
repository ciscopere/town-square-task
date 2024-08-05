# Town Square - Candidate Assessment

The repository contains 2 projects: backend and frontend. 
To run the project locally follow **Local Environment** instructions to get both projects and the DB up.
Infinite scroll and GraphQL subscriptions were added, so you can fully test the solution there.

To access the version of the product that is up you can go [here](https://town-square-task-frontend-ff164b6a38ef.herokuapp.com/)

Below you will find also instructions to mount the projects in Heroku. 
My idea was to use the same docker config for the deployment but this was not a good approach.
It took me lots of time to fix some issues with that and some things (Web sockets, not production version deployed) are not working properly in that env.
Using Heroku buildpacks would be much easier.

For reordering the posts I used **LexoRank**. 

## Local Environment

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

### Run app
[localhost:5173](http://localhost:5173/)

## Development tools

### Create a migration
```
docker compose exec -ti backend yarn typeorm migration:generate src/migrations/{name}
```

## Heroku Deployment
### Backend

#### Create backend App
```
cd backend

heroku create town-square-task-backend

heroku stack:set container -a town-square-task-frontend

heroku addons:create  heroku-postgresql:essential-0 -a town-square-task-backend

heroku config:set CORS_ORIGIN={frontend_url} -a town-square-task-backend
```

#### Push changes and release
```
heroku container:push web -a town-square-task-backend

heroku container:release web -a town-square-task-backend
```

#### Run migrations
```
heroku run yarn typeorm migration:run -a town-square-task-backend
```

#### Create mock data
```
heroku run yarn seed -a town-square-task-backend
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

heroku config:set VITE_GRAPHQL_URL={backend_url} -a town-square-task-frontend
heroku config:set VITE_GRAPHQL_SUBSCRIPTION_URL={ws://backend_url} -a town-square-task-frontend
heroku config:set NODE_ENV=production -a town-square-task-frontend
```

#### Push changes and release
```
heroku container:push web -a town-square-task-frontend

heroku container:release web -a town-square-task-frontend
```
