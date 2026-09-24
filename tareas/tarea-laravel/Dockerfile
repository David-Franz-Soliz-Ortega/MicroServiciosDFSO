FROM php:8.2-cli-alpine

# 1. Instalar dependencias del sistema y Node.js (Alpine)
RUN apk add --no-cache \
    linux-headers \
    nodejs \
    npm \
    git \
    zip \
    unzip \
    curl \
    autoconf \
    g++ \
    make \
    openssl-dev

# 2. Instalar extensión de MongoDB para PHP
RUN pecl install mongodb && docker-php-ext-enable mongodb

# 3. Instalar extensiones requeridas por RoadRunner y Laravel
RUN docker-php-ext-install pcntl sockets

# 4. Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 5. Configurar el directorio de trabajo
WORKDIR /app

# 6. Copiar los archivos del proyecto (respetando .dockerignore)
COPY . .

# 7. Instalar dependencias de PHP
RUN composer install --no-interaction --optimize-autoloader

# 8. Instalar dependencias de Node.js y compilar assets (Vite)
RUN npm install && npm run build

# 9. Descargar el binario de RoadRunner compatible con Linux Alpine
RUN ./vendor/bin/rr get-binary

# 10. Crear un script de inicio que ejecute Laravel (HTTP) y RoadRunner (gRPC) al mismo tiempo
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'php artisan serve --host=0.0.0.0 --port=8000 &' >> /app/start.sh && \
    echo './rr serve -c .rr.yaml' >> /app/start.sh && \
    chmod +x /app/start.sh

# 11. Exponer los puertos: 8000 (REST/GraphQL) y 9001 (gRPC)
EXPOSE 8000 9001

# 12. Ejecutar el script al iniciar el contenedor
CMD ["/app/start.sh"]
