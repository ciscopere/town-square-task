# Base stage
FROM node:18 AS base
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install

# Development stage
FROM base AS development
COPY . ./
EXPOSE 5173
CMD ["yarn", "dev"]

# Production stage
FROM base AS production
COPY . ./
RUN yarn build
EXPOSE 80
CMD ["yarn", "start"]