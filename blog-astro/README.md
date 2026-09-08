# Blog con Astro + nginx

> [Astro](https://astro.build) es un generador de sitios estáticos ultrarrápido (licencia MIT, código abierto); la entrega la sirve un `nginx:alpine`.

## Qué es

Escribo el blog en Astro (Markdown + componentes), lo compilo con `astro build` y el resultado (`dist/`) se sirve como archivos estáticos desde un contenedor nginx de solo lectura. Sin base de datos, sin PHP, sin superficie de ataque más allá de un fichero estático.

## Qué sustituye

- **Hosting WordPress de pago** (SiteGround, GoDaddy...) y plataformas tipo Medium o Blogger, que monetizan con tus datos o contenido publicitario.
- Alternativa a servicios de hosting estático externos: el blog lo aloja mi propio servidor.

## Para qué lo uso

Como blog personal publicado desde el homelab. El contenedor expone el puerto **4321**; cuando quiero compartirlo desde fuera lo publico puntualmente con `tailscale funnel`.

## Instalación

1. Generar el sitio:

   ```bash
   npm create astro@latest blog    # o clonar tu repo del blog
   cd blog
   npm install && npm run build    # deja el sitio estático en ./dist
   ```

2. Colocar este `docker-compose.yml` junto a la carpeta `dist/` y levantar:

   ```bash
   cd /opt/Astro && docker compose up -d
   ```

3. Comprobar en `http://<LAN_IP>:4321`.

4. Para publicar nuevos posts: `npm run build` y recargar — nginx sirve los cambios al instante (volumen montado, sin reiniciar).

## Acceso

| Qué | Dónde |
|---|---|
| Blog | `http://<LAN_IP>:4321` / vía Tailscale |

## Backups

Solo hace falta el código fuente del blog (recomendado: repo git privado) y el tema/personalización; `dist/` es reproducible con `npm run build`.
