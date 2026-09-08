# Homelab

Repositorio con la documentación y configuración de mi homelab: un servidor casero basado en un portátil reciclado que ejecuta servicios autoalojados, mayoritariamente de código abierto, para sustituir a servicios de pago o en la nube de terceros.

Cada servicio tiene su propia carpeta con un `README.md` (qué es, para qué lo uso y cómo instalarlo) y su `docker-compose.yml` con los datos sensibles ofuscados.

---

## Hardware

| Componente | Detalle |
|---|---|
| Equipo | Portátil HP 15ns-eq1071 |
| CPU | AMD Ryzen 7 4700U |
| RAM | 32 GB DDR4 |
| Almacenamiento | SSD NVMe 512 GB (74 GB para el sistema + 567 GB montados en `/data` para datos y medios) |
| Sistema operativo | Ubuntu 26.04 LTS |
| Motor de contenedores | Docker + Docker Compose |
| Red | Wi-Fi/Ethernet en LAN (`<LAN_IP>`) + malla privada Tailscale (`<TAILSCALE_IP>`) |

El portátil está encendido 24/7. El arranque de los contenedores es automático gracias a las políticas `restart: always / unless-stopped`.

## Software

| Servicio | Función | Sustituye a | Puerto |
|---|---|---|---|
| [Immich](immich/) | Foto y vídeo personal con  (búsqueda, caras, lugares) | Google Photos, iCloud Fotos | 2283 |
| [Jellyfin](jellyfin/) | Streaming de películas, series y música | Netflix, Plex Pass, Spotify | 8096 |
| [Nextcloud](nextcloud/) | Nube de archivos, calendario y sincronización | Google Drive, Dropbox, OneDrive | 8081 |
| [Syncthing](syncthing/) | Sincronización continua P2P de carpetas y archivos | Dropbox, Sync.com | 8384 |
| [Vaultwarden](vaultwarden/) | Servidor no oficial de Bitwarden para contraseñas | Google Passwords | 8443 (TLS) |
| [Joplin Server](joplin/) | Sincronización de notas cifradas E2EE | Evernote, Notion (sincronización) | 22300 |
| [Actual Budget](actual-budget/) | Presupuestos con sincronización bancaria automática | YNAB, Mint, MoneyControl | 5006 (localhost) |
| [Pi-hole](pi-hole/) | DNS con bloqueo de anuncios y rastreadores | NextDNS de pago, OpenDNS | 53 / panel 8080 |
| [Portainer](portainer/) | Gestión web de los contenedores Docker | Docker Desktop | 9000 |
| [Blog Astro](blog-astro/) | Blog estático propio creado con el Framework Astro, servido con nginx | Wordpress | 4321 |

Toda la accesibilidad remota y entre dispositivos se resuelve con [Tailscale](tailscale/) (servicio gratuito hasta 3 usuarios / 100 dispositivos), que sustituye al port-forwarding del router y a un VPN tradicional.

## Acceso y Tailscale

El servidor, mi PC de sobremesa y mi móvil están unidos a la misma *tailnet* (red privada de Tailscale). Todos los servicios se publican solo en esa red: se accede a ellos por la IP `100.x.x.x` que Tailscale asigna al servidor, sin abrir puertos en el router.
Administro el servidor desde mi PC y mí móvil usando una conexión SSH.
```
 [Móvil Android] ─┐
 [PC sobremesa ] ─┼── Tailnet (WireGuard) ──> Servidor Ubuntu ──> contenedores :puertos
 [Otros equipos] ─┘
```

Además uso `tailscale serve`/`funnel` y certificados TLS de Tailscale (`*.<tailnet>.ts.net`) para exponer con HTTPS algún servicio concreto (p. ej. Vaultwarden). Detalles en [tailscale/README.md](tailscale/).

## Estructura del repositorio

```
homelab/
├── README.md          <- este archivo
├── .gitignore
├── pi-hole/           ├── immich/          ├── jellyfin/
├── nextcloud/         ├── joplin/          ├── vaultwarden/
├── actual-budget/     ├── portainer/       ├── blog-astro/
├── syncthing/         └── tailscale/
```

## Cómo desplegar un servicio

1. Clonar este repositorio en el servidor (o copiar solo la carpeta del servicio) dentro de `/opt/<servicio>`.
2. Si la carpeta incluye `.env.example`, copiarlo a `.env` y rellenar secretos, IPs y dominios.
3. Levantar el servicio:

   ```bash
   docker compose up -d
   ```

4. Seguir los pasos de primer arranque descritos en el `README.md` de cada servicio.

## Aviso sobre datos ofuscados

Las contraseñas, IPs, nombres de tailnet e identificadores reales han sido sustituidos por marcadores (`${VARIABLES}`, `<LAN_IP>`, `<TAILSCALE_IP>`, `<EQUIPO>.<TAILNET>.ts.net`, ...). Nunca subas un `.env` real a este repositorio: está excluido en `.gitignore`.
