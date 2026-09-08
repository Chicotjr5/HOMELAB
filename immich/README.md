# Immich

> Gestión de fotos y vídeos self-hosted con funciones de IA (búsqueda semántica, reconocimiento facial, lugares, álbunes automáticos). [Docs](https://docs.immich.app) · Licencia: AGPL-3.0 (código abierto).

## Qué es

Immich es el reemplazo autoalojado de referencia para Google Fotos: apps móviles con copia automática de la cámara, visión por computador en el servidor (modelos de machine learning), mapa con metadatos EXIF, compartición de álbunes y multiusuario. Consta de un servidor principal, una base de datos Postgres con extensión vectorial (pgvector/VectorChord), Valkey (redis) para colas y un servicio de machine learning opcional.

## Qué sustituye

- **Google Photos** (15 GB gratis y después de pago).
- **iCloud Fotos**, Amazon Photos y servicios equivalentes.

## Para qué lo uso

Copia automática de las fotos del móvil al servidor (150 GB+ de recuerdos que no quiero en manos de Google) con búsqueda por personas, sitios y contenido, y álbunes compartidos con la familia. Uso la versión `v2` con el servicio de machine learning en CPU.

## Instalación

1. Preparar carpetas:

   ```bash
   mkdir -p /opt/immich /data/immich
   cd /opt/immich
   cp .env.example .env   # editar: rutas y credenciales de la DB
   ```

2. Levantar la pila (servidor + ML + Valkey + Postgres):

   ```bash
   docker compose up -d
   ```

3. Esperar a que el servidor esté sano y abrir `http://<LAN_IP>:2283`.

4. Crear la cuenta de administrador, y en *Ajustes → Machine Learning* verificar que el worker aparece conectado.

5. Instalar la app **Immich** (Android/iOS), apuntarla a `http://<TAILSCALE_IP>:2283/api` y activar la copia de fondo.

> Nota: tras cada actualización del proyecto, comparar el `docker-compose.yml` con el del [último release oficial](https://github.com/immich-app/immich/releases) y migrar con `docker compose pull && docker compose up -d`.

## Acceso

| Qué | Dónde |
|---|---|
| Web | `http://<LAN_IP>:2283` / vía Tailscale `http://<TAILSCALE_IP>:2283` |
| App móvil | URL `http://<TAILSCALE_IP>:2283/api` (con Tailscale activo en el móvil) |

## Backups

Lo crítico: `/data/immich` (originales) y el volcado de Postgres (`pg_dump` del contenedor `immich_postgres`). Restaurar la DB es imprescindible para no perder índices, caras y álbunes.
