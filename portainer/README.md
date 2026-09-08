# Portainer

> Panel de administración web para entornos Docker. [Docs](https://docs.portainer.io) · Licencia: zlib (Community Edition es código abierto).

## Qué es

Portainer ofrece una GUI sobre el daemon de Docker: ver contenedores e imágenes, logs, volúmenes, redes, crear stacks de compose, controlar el reinicio de servicios... Todo desde el navegador, sin tocar la CLI.

## Qué sustituye

- **Docker Desktop** (interfaz gráfica oficial, con requisitos de licencia de pago en empresas) y cualquier herramienta de pago de gestión de contenedores.

## Para qué lo uso

Como "cuadro de mandos" del homelab: vigilo el estado de las ~14 contenedores, reviso logs de Jellyfin o Immich y reinicio servicios desde el móvil sin SSH.

Solo expongo el puerto **9000** (UI HTTP) en la LAN/Tailscale; el 8000 (edge agent) y el 9443 (HTTPS interno) no van al host porque el 9443 ya lo usa Pi-hole.

## Instalación

1. Preparar el volumen de datos:

   ```bash
   mkdir -p /opt/portainer /data/portainer
   cd /opt/portainer
   ```

2. Levantar:

   ```bash
   docker compose up -d
   ```

3. Abrir `http://<LAN_IP>:9000`, seleccionar *local* (el socket montado) y crear usuario admin en menos de 5 minutos (después caduca el registro).

> ⚠️ Portainer tiene acceso al socket de Docker, es decir, control total del host. No expongas el 9000 fuera de tu red privada.

## Acceso

| Qué | Dónde |
|---|---|
| UI | `http://<LAN_IP>:9000` / `http://<TAILSCALE_IP>:9000` |

## Backups

Carpeta `/data/portainer` (usuarios y definiciones de stacks).
