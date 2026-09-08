# Pi-hole

> Servidor DNS con bloqueo de anuncios y rastreadores a nivel de red. [Web oficial](https://pi-hole.net) · Licencia: EUPL-1.2 (código abierto).

## Qué es

Pi-hole actúa como servidor DNS (y ahora también DHCP) para toda la red doméstica. Cada vez que un dispositivo pregunta por un dominio, Pi-hole lo resuelve normalmente... salvo que esté en alguna de sus listas de bloqueo (anuncios, telemetría, malware). En ese caso responde `0.0.0.0` y el anuncio nunca llega a cargarse, en cualquier app, juego o navegador de la casa.

## Qué sustituye

- **NextDNS de pago** (el plan gratuito tiene pocos queries/mes).
- **OpenDNS Family Shield** y servicios similares de filtrado DNS en la nube.
- Listas de bloqueo tipo hosts de Steve Cook (autoalojadas y con panel de control propio).

## Para qué lo uso

Es el DNS de mi red local: todos los dispositivos apuntan al servidor y así no se cargan anuncios ni rastreadores. Además lo uso para resolver nombres internos y como punto único para auditar qué domina cada dispositivo (dashboard de consultas).

En mi servidor el panel web no está en el puerto 80 (ocupado por otro proceso), sino en el **8080**, y el 443 en el **9443**.

## Instalación

1. Crear la carpeta y copiar los archivos:

   ```bash
   mkdir -p /opt/pi-hole && cd /opt/pi-hole
   # docker-compose.yml y .env de este repositorio
   cp .env.example .env   # editar y poner contraseña fuerte
   ```

2. Reservar el puerto 53: el resolved de Ubuntu suele escuchalo. Desactivarlo:

   ```bash
   sudo nano /etc/systemd/resolved.conf   # DNSStubListener=no
   sudo systemctl restart systemd-resolved
   ```

3. Levantar el contenedor:

   ```bash
   docker compose up -d
   ```

4. Abrir el asistente inicial `http://<LAN_IP>:8080` y configurar usuario/contraseña (la de `.env` para la API).

5. **Probar antes de cambiar el DNS general**: `nslookup example.com <LAN_IP>` debe responder.

6. Configurar el DNS en el router (repartir a toda la red) o manualmente por dispositivo. En los dispositivos remotos funciona igual a través de Tailscale apuntando el DNS a `<TAILSCALE_IP>`.

## Acceso

| Qué | Dónde |
|---|---|
| DNS | `<LAN_IP>:53` o `<TAILSCALE_IP>:53` |
| Panel web | `http://<LAN_IP>:8080/admin` · vía Tailscale `http://<TAILSCALE_IP>:8080/admin` |

## Backups

Copiar `etc-pihole/` (contiene listas, grupos, ajustes y la base de datos de consultas).
