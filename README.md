# Rick and Morty Explorador 🛸

Este proyecto es un **explorador de personajes de Rick and Morty** que permite filtrar por estado (vivo, muerto o todos) y marcar favoritos.  
La aplicación está **contenarizada usando Docker** y sirve los archivos estáticos con **Nginx**.

---

## 📁 Estructura del proyecto

```
T.P/
└── ejercicio-1/
├── index.html ← HTML principal
├── index.css ← estilos
├── index.js ← scripts
└── Dockerfile ← configuración del contenedor
```

---

## 🐳 Requisitos

- Tener instalado **Docker** en tu sistema: [https://www.docker.com/get-started](https://www.docker.com/get-started)
- Tener instalado **Git** en tu sistema: https://git-scm.com/downloads
- Puerto **8080 libre** en tu máquina

---

## 🏗️ Construcción de la imagen Docker

1. Abrir una terminal y ubicarse en la carpeta principal del proyecto `T.P/`.
2. Ejecutar el siguiente comando para construir la imagen:

```bash
docker build -t rickmorty-app:2.0 -f ejercicio-1/Dockerfile ejercicio-1
```
 
>- rickmorty-app:2.0 → nombre y versión de la imagen
>
> - -f ejercicio-1/Dockerfile → indica la ubicación del Dockerfile
>
>- ejercicio-1 → carpeta que contiene los archivos de la aplicación

## 🚀 Ejecución del contenedor
**
1-  Si hay un contenedor anterior usando el puerto 8080, detenerlo y si desea bórrelo con docker rm mi-contenedor:**
```
docker stop mi-contenedor
docker rm mi-contenedor
```
**2 - Ejecutar el contenedor con el siguiente comando:**
``` 
docker run -d -p 8080:80 --name mi-contenedor rickmorty-app:2.0
```

> `-d  `→ ejecuta el contenedor en segundo plano
>
> `-p 8080:80 `→ mapea el puerto 80 del contenedor al puerto 8080 a la máquina local
>
> `--name mi-contenedor ` → asigna un nombre al contenedor
>
> `rickmorty-app:2.0  `→ nombre de la imagen a usar

## 🌐 Acceder a la aplicación
   **Abrir un navegador y visitar:http://localhost:8080**
>Deberías ver la aplicación Rick and Morty Explorador funcionando, con los personajes cargados, filtros y favoritos.

