# 1. Imagen base: Node 20 sobre Alpine Linux (liviana) 
FROM node:20-alpine 
# 2. Directorio de trabajo dentro del contenedor 
WORKDIR /app 
# 3. Copiar TODO el código primero (Malas prácticas para probar)
COPY . .

# 4. Instalar dependencias después
RUN npm install --omit=dev
# 5. Copiar el resto del código fuente 
COPY . . 
# 6. Documentar el puerto que expone la aplicación 
EXPOSE 3000 
# 7. Comando que se ejecuta al arrancar el contenedor 
CMD ["node", "app.js"] 

COPY package*.json ./

# 4. Instalar dependencias de producción 
RUN npm install --omit=dev 

# 5. Copiar el resto del código fuente 
COPY . .