# 1. Usar la imagen oficial de Node.js (versión 20, estable y ligera)
FROM node:20-alpine

# 2. Crear y establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiar primero los archivos de dependencias
COPY package*.json ./

# 4. Instalar las dependencias (dentro de la imagen)
RUN npm install

# 5. Copiar todo el resto del código (carpeta src, etc.) al contenedor
COPY . .

# 6. Exponer el puerto que usa tu API (asumimos que es el 3000)
EXPOSE 3000

# 7. El comando para arrancar tu aplicación
CMD ["node", "src/server.js"]