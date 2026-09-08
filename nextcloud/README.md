# Nextcloud

> Plataforma de productividad self-hosted: almacenamiento en la nube, sincronización de archivos, calendario, contactos, etc. [Docs](https://nextcloud.com) · Licencia: AGPL-3.0 (código abierto).

## Qué es

Nextcloud te da tu propio "Dropbox/Google Drive": subida y sincronización bidireccional de archivos con clientes para escritorio y móvil, compartir con enlaces, calendario y contactos CalDAV/CardDAV, e infinidad de apps (notas, formularios, galería...). Los datos residen en tu servidor, no en la nube de nadie.

## Qué sustituye

- **Google Drive / OneDrive / Dropbox** (almacenamiento y sincronización).
- Calendarios y contactos en la nube de terceros.

## Para qué lo uso

Como nube personal accesible desde casa (LAN) y desde cualquier sitio vía Tailscale: copia de documentos, acceso a archivos desde el móvil y sincronización con el PC. El contenedor publica el HTTP interno en el **8081** del host, y el almacenamiento real vive en `/data/nextcloud`.

## Instalación

1. Preparar carpetas y secretos:

   ```bash
   mkdir -p /opt/nextcloud /data/nextcloud/{data,config,apps}
   cd /opt/nextcloud
   cp .env.example .env   # usuario/contraseña admin e IPs
   ```

2. Levantar:

   ```bash
   docker compose up -d
   ```

3. Entrar en `http://<LAN_IP>:8081`, iniciar sesión con el admin de `.env` y completar el asistente.

4. En *Ajustes → Admin → Seguridad*, añadir dominios/proxies de fiar si cambia la IP de Tailscale (editar `.env` y recrear el contenedor).

5. Instalar clientes Nextcloud (PC/móvil) y apuntarlos a `http://<TAILSCALE_IP>:8081`.

## Acceso

| Qué | Dónde |
|---|---|
| Web | `http://<LAN_IP>:8081` / `http://<TAILSCALE_IP>:8081` |
| WebDAV | `/remote.php/dav` sobre la misma URL |

## Backups

Carpeta `/data/nextcloud` (datos + config + apps) y la base de datos SQLite interna (`data/nextcloud.db`).

> Nota: la imagen oficial usa SQLite por defecto, suficiente para mi caso. Para más rendimiento, se puede migrar a MariaDB/Postgres añadiendo un servicio al compose.
