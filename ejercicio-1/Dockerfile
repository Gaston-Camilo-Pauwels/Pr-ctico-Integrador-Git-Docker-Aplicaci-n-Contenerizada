# Imagen base
FROM nginx:latest

# Copiar el contenido del proyecto al directorio de Nginx
COPY . /usr/share/nginx/html

# Exponer el puerto donde Nginx escucha
EXPOSE 80

# Comando por defecto (ya viene configurado en nginx)
CMD ["nginx", "-g", "daemon off;"]
