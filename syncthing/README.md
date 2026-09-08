# Syncthing

> Sincronización continua de archivos P2P, sin servidor central en la nube. [Docs](https://syncthing.net) · Licencia: MPL-2.0 (código abierto).

## Qué es

Syncthing sincroniza carpetas entre dispositivos cifrando el tráfico (TLS) y hablando directamente entre ellos (LAN o a través de Tailscale): no hay servidores intermedios que guarden tus datos. Detecta cambios en tiempo real y resuelve conflictos conservando ambas versiones.

## Qué sustituye

- **Dropbox / Sync.com / Google Drive** como mecanismo de sincronización de carpetas entre PC, servidor y móvil.

## Para qué lo uso

En el servidor corre como **servicio systemd de usuario** (no como contenedor) con `syncthing serve --no-browser`. La carpeta clave es `/data/sincronizar`, que se replica entre el servidor, mi PC y el móvil:

- `/data/sincronizar/musicas` → la consume Jellyfin (montada en `/musicas`).
- `/data/sincronizar/mundial` → biblioteca de vídeo de Jellyfin (`/mundial`).

Es decir: meto música o vídeos en el PC y al momento están en el servidor, listos para hacer streaming desde cualquier sitio vía Tailscale.

## Instalación

1. En el servidor (y en cada equipo a sincronizar):

   ```bash
   sudo apt install syncthing
   systemctl --user enable --now syncthing
   ```

   La unidad de usuario ejecuta `syncthing serve --no-browser`; el binario oficial también puede instalarse desde el repo de syncthing.

2. Abrir la UI en `http://127.0.0.1:8384` (solo escucha en localhost por seguridad). Desde otro equipo, hacer port-forwarding por SSH o Tailscale:

   ```bash
   tailscale serve --bg --https=8443 http://127.0.0.1:8384
   ```

3. Añadir el ID de dispositivo de cada equipo (PC, móvil) y aceptar el enlace en ambos lados.

4. Crear la carpeta a compartir (`/data/sincronizar`), asignarla a los dispositivos y elegir el modo de sincronización (sugerido: "Enviar y recibir" en el servidor).

5. En el móvil (app **Syncthing-Fork** para Android) enlazar con el ID del servidor y montar la misma carpeta.

> Alternativa contenedor: `docker-compose.yml` en esta carpeta deja el mismo servicio en Docker con la UI en el 8384.

## Acceso

| Qué | Dónde |
|---|---|
| UI web | `http://127.0.0.1:8384` (localhost / túnel Tailscale) |
| Datos | `/data/sincronizar` |

## Backups

El propio Syncthing es tu backup "3-2-1 parcial" (los datos existen en 2-3 dispositivos). Aun así, conviene un volcado periódico de `/data/sincronizar` a disco externo, y guardar la config de `~/.config/syncthing` (IDs y certificados).
