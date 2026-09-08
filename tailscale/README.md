# Tailscale

> VPN mesh moderna sobre WireGuard: crea una red privada entre todos tus dispositivos estén donde estén. [Docs](https://tailscale.com) · Cliente de código abierto (BSD-3), plan gratuito hasta 3 usuarios / 100 dispositivos.

## Qué es

Tailscale instala una interfaz de red virtual (`tailscale0`) en cada dispositivo con una IP estable `100.x.y.z` y un nombre DNS (`<EQUIPO>.<TAILNET>.ts.net`) y conecta los extremos con WireGuard, atravesando NAT automáticamente. No hay que abrir puertos en el router ni mantener un servidor VPN clásico (OpenVPN/IPSec).

En este homelab es la **capa de acceso a todos los demás servicios**: sin estar en la tailnet, los servicios simplemente no son alcanzables desde Internet.

## Qué sustituye

- **Port-forwarding manual en el router** (y sus riesgos de seguridad).
- **OpenVPN / WireGuard "a mano" / IPSec**: configuración de claves, servidores relay, etc.
- **ZeroTier / Angelator / soluciones tipo "cloudflare tunnel"** de planes limitados o cerrados.
- La exposición pública de servicios con IP dinámica de mi casa.

## Mi topología

| Dispositivo | Rol | Sistema |
|---|---|---|
| Servidor (`<EQUIPO>`, `<TAILSCALE_IP>`) | Aloja todos los contenedores del homelab | Linux (Ubuntu) |
| PC de sobremesa (`<EQUIPO2>`) | Uso diario, cliente de Syncthing/Jellyfin/Nextcloud | Linux/Windows |
| Móvil (`<MOVIL>`) | Consumidor de los servicios en movilidad | Android |

(El nombre de la tailnet y los IDs de equipo reales van ofuscados; sustitúyelos por los tuyos.)

## Instalación

1. En el servidor y cada dispositivo:

   ```bash
   curl -fsSL https://tailscale.com/install.sh | sh
   sudo tailscale up
   ```

2. Autorizar los dispositivos en <https://login.tailscale.com>. Activar **MagicDNS** para resolver `<EQUIPO>.<TAILNET>.ts.net`.

3. Comprobar la malla:

   ```bash
   tailscale status
   ```

4. Acceder a cualquier servicio por su IP tailscale: p. ej. `http://<TAILSCALE_IP>:8096` (Jellyfin) o `http://<TAILSCALE_IP>:2283` (Immich).

## HTTPS y publicación (lo que uso)

**Certificados TLS por equipo** (`tailscale cert`) — los usa Vaultwarden para escuchan en `https://<EQUIPO>.<TAILNET>.ts.net:8443`:

```bash
sudo tailscale cert <EQUIPO>.<TAILNET>.ts.net
```

**`tailscale serve`** — publica un servicio de localhost con HTTPS dentro de la tailnet. Con él expongo Actual Budget (que va ligado a `127.0.0.1:5006` a propósito):

```bash
tailscale serve --bg --https=443 http://127.0.0.1:5006
```

**`tailscale funnel`** — saca un servicio a Internet público por un puerto concreto cuando quiero compartir algo puntual (p. ej. una vista del blog), sin tocar el router:

```bash
tailscale funnel --bg 4321
```

> `serve` queda solo dentro de la tailnet; `funnel` es acceso público con límite de 100 GB/mes en el plan gratuito. Usar funnel solo para contenido sin datos privados.

## Seguridad aplicada

- Ningún puerto abierto en el router: la entrada a casa es la tailnet.
- Los servicios escuchan solo en interfaces LAN + `tailscale0`.
- Actual Budget ni siquiera sale de localhost: se accede exclusivamente vía `serve`.
- Certificados `*.ts.net` en lugar de Let's Encrypt (no hace falta un dominio propio).

## Gestión

```bash
tailscale status          # estado de la malla
tailscale netcheck        # diagnóstico NAT
sudo tailscale down       # desconectar el equipo
tailscale serve status    # qué está publicado
```
