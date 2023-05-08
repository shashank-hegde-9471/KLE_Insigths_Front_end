#stage 1
FROM node:latest as node
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod
#stage 2
FROM bitnami/nginx
COPY --from=node /app/dist/demo-app /app
EXPOSE 8080:8080
ENTRYPOINT ["nginx", "-g", "daemon off;"]