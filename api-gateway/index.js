import express from "express"
import { createProxyMiddleware } from "http-proxy-middleware"
const app = express()

const routes = {
   	"/api/auth": "http://localhost:5000/auth",
   	"/api/users": "http://localhost:5000/users",
   	"/api/messages": "http://localhost:8080/messages"
}

for(const route in routes) {
   const target = routes[route];
   app.use(route, createProxyMiddleware({target, changeOrigin: true}));
}

const PORT = 8081;

app.listen(PORT, () => {
   console.log(`api gateway started listening on port : ${PORT}`)
})
