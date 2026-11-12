FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY src ./src
COPY contratos ./contratos
RUN mkdir -p registros && chown node:node registros
ENV PORT=3000
EXPOSE 3000
USER node
CMD ["node", "src/server.js"]
services:
    rabbitmq:
        image: rabbitmq:3.13-management
        ports:["5672:5672","15672:15672"] #AMQP | consola
        environment:
            RABBITMQ_DEFAULT_USER: admin
            RABBITMQ_DEFAULT_PASS: admin123
        volumes: ["rabbit_datos:/var/lib/rabbitmq"]
    prometheus:
    image: prom/prometheus:v2.54.1
    container_name: prometheus
    restart: unless-stopped
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
    extra_hosts:
      - "host.docker.internal:host-gateway"
volumes:
    rabbit_datos:
    prometheus_data: