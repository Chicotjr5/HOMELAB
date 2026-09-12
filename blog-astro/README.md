# Blog con Astro + nginx + Cloudflare Tunnel

> [Astro](https://astro.build) es un generador de sitios estáticos ultrarrápido (licencia MIT, código abierto); la entrega la sirve el **nginx del host** en el puerto 80 y se expone a Internet con un **Cloudflare Tunnel**, sin abrir puertos en el router.

## Qué es

Escribo el blog en Astro (Markdown + componentes), lo compilo con `astro build` y el resultado (`dist/`) se sirve como archivos estáticos desde el nginx del servidor. Sin base de datos, sin PHP, sin superficie de ataque más allá de un fichero estático.

El tráfico exterior no llega nunca al router ni a un puerto público: un `cloudflared` saliente conecta el servidor con la red de Cloudflare, que resuelve `<DOMAIN>` y termina el TLS en su edge.

```
 [Internet] ──> Cloudflare edge (DNS + TLS de <DOMAIN>)
                    │  túnel saliente <TUNNEL_NAME>
                    ▼
 [Servidor] cloudflared ──> http://localhost:80 ──> nginx ──> dist/ (sitio Astro)
```

## Qué sustituye

- **Hosting WordPress de pago** (SiteGround, GoDaddy...) y plataformas tipo Medium o Blogger, que monetizan con tus datos o contenido publicitario.
- El **port-forwarding del router** y la gestión de certificados Let's Encrypt con certbot: el tunnel es saliente y Cloudflare sirve HTTPS con certificado propio para `<DOMAIN>`.

## Para qué lo uso

Como blog personal publicado desde el homelab: `https://<DOMAIN>` (y `www.<DOMAIN>`). El nginx del host además reenvía `/retro-games/` a un servicio local en `127.0.0.1:3000` (ver [nginx-site.conf](nginx-site.conf)).

## Instalación

1. Generar el sitio:

   ```bash
   npm create astro@latest blog    # o clonar tu repo del blog
   cd blog
   npm install && npm run build    # deja el sitio estático en ./dist
   ```

2. Configurar nginx en el host. Copiar [nginx-site.conf](nginx-site.conf) (sustituyendo `<DOMAIN>` y la ruta del `dist/`):

   ```bash
   sudo cp nginx-site.conf /etc/nginx/sites-available/<DOMAIN>
   sudo ln -sfn /etc/nginx/sites-available/<DOMAIN> /etc/nginx/sites-enabled/<DOMAIN>
   sudo nginx -t && sudo systemctl reload nginx
   ```

3. Crear el tunnel y apuntar el DNS de Cloudflare (dominio ya registrado en la cuenta):

   ```bash
   cloudflared tunnel login
   cloudflared tunnel create <TUNNEL_NAME>
   cloudflared tunnel route dns <TUNNEL_NAME> <DOMAIN>
   cloudflared tunnel route dns <TUNNEL_NAME> www.<DOMAIN>
   ```

4. Colocar [cloudflared-config.yml](cloudflared-config.yml) en `/etc/cloudflared/config.yml` con el UUID real del tunnel en `credentials-file` e instalar el servicio:

   ```bash
   sudo cloudflared service install
   sudo systemctl enable --now cloudflared
   ```

5. Comprobar: `curl -I https://<DOMAIN>` (respuesta `server: cloudflare`) y en la LAN `http://<LAN_IP>`.

6. Para publicar nuevos posts: `npm run build` y listo — nginx sirve los cambios del `dist/` al instante, sin reiniciar nada.

## Acceso

| Qué | Dónde |
|---|---|
| Blog (público) | `https://<DOMAIN>` / `https://www.<DOMAIN>` vía Cloudflare Tunnel |
| Blog (LAN) | `http://<LAN_IP>` (vhost nginx) |
| Retro-games | `https://<DOMAIN>/retro-games/` → proxy a `127.0.0.1:3000` |

## Alternativa con Docker

Si se prefiere no tocar el nginx del host, [docker-compose.yml](docker-compose.yml) levanta el `dist/` en un contenedor `nginx:alpine` en el puerto **4321** (`docker compose up -d`). En ese caso basta con cambiar el `service:` del ingress del tunnel a `http://localhost:4321`.

## Backups

Solo hace falta el código fuente del blog (recomendado: repo git privado) y el tema/personalización; `dist/` es reproducible con `npm run build`. Del tunnel solo se conserva el fichero de credenciales (`/etc/cloudflared/<UUID>.json`): si se pierde, se regenera con `cloudflared tunnel create`.
