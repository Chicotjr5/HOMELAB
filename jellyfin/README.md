# Jellyfin

> Servidor multimedia: organiza y emite tu biblioteca de vídeo, música y fotos. [Docs](https://jellyfin.org) · Licencia: GPL-2.0 (código abierto, sin funciones de pago).

## Qué es

Jellyfin escanea tus carpetas de medios, descarga metadatos y carátulas, transcode si es necesario y ofrece apps para navegador, Android, TV, etc. Es la versión libre de Plex/Emby: todo incluido, sin cuenta obligatoria ni suscripción.

## Qué sustituye

- **Netflix / servicios de streaming** (para contenido propio), **Plex Pass** y **Emby Premiere** (funciones premium de pago) y **Spotify** para la música local.

## Para qué lo uso

En mi servidor monto dos bibliotecas desde `/data/sincronizar` (la carpeta que sincroniza Syncthing con mis otros equipos):

- `/mundial` → biblioteca de vídeo (partidos y contenido deportivo, de ahí el nombre 🙂).
- `/musicas` → biblioteca de música, que escucho desde el móvil y el PC con la app de Jellyfin.

## Instalación

1. Preparar la carpeta:

   ```bash
   mkdir -p /opt/jellyfin
   cd /opt/jellyfin
   ```

2. Ajustar en `docker-compose.yml` las rutas de los medios (`/data/sincronizar/...`) a tu estructura.

3. Levantar:

   ```bash
   docker compose up -d
   ```

4. Abrir `http://<LAN_IP>:8096` y seguir el asistente: idioma, usuario, carpetas de biblioteca (vídeo → `/mundial`, música → `/musicas`) y metadatos.

5. En clientes (app Jellyfin Finamp, app oficial, navegador...) añadir el servidor por la IP de Tailscale.

## Acceso

| Qué | Dónde |
|---|---|
| Web/apps | `http://<LAN_IP>:8096` / `http://<TAILSCALE_IP>:8096` |
| DLNA | red local |

## Backups

Carpeta `./config` (usuarios, bibliotecas y base de datos de metadatos). Los medios no se tocan: se respaldan con Syncthing.
