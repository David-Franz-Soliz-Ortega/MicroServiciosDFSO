# Imagen base oficial de Node.js (versión LTS ligera)
FROM node:20-alpine

# Directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copiar archivos de definición de dependencias
COPY package*.json ./

# Instalar dependencias de producción
RUN npm ci --omit=dev

# Copiar el código fuente de la aplicación
COPY src/ ./src/

# Variable de entorno para el puerto y entorno de producción
ENV NODE_ENV=production
ENV PORT=3000

# Exponer el puerto configurado
EXPOSE 3000

# Usuario sin privilegios por seguridad
USER node

# Comando para iniciar la aplicación
CMD ["node", "-e", "const app = require('./src/app'); const port = process.env.PORT || 3000; app.listen(port, () => console.log(`Servidor iniciado en puerto ${port}`));"]
