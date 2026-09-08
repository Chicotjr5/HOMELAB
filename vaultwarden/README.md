# Vaultwarden

> Implementación no oficial (Rust) del servidor de Bitwarden, ligera y compatible con todos los clientes oficiales. [Repo](https://github.com/dani-garcia/vaultwarden) · Licencia: GPL-3.0 (código abierto).

## Qué es

Vaultwarden expone la API de Bitwarden en un único binario con SQLite como almacén: cofres de contraseñas, notas seguras, TOTP y autofill, sincronizados entre navegador, PC y móvil. La "nube" la controlas tú.

## Qué sustituye

- **Bitwarden (sincronización en su nube)**, **1Password** (de suscripción) y cualquier gestor de contraseñas de pago.

## Para qué lo uso

Es el servidor de mi cofre de Bitwarden en el portátil y el móvil, accesible solo dentro de la tailnet. Lo publico con **HTTPS real** usando un certificado de Tailscale (`https://<EQUIPO>.<TAILNET>.ts.net:8443`), algo necesario porque los clientes de Bitwarden exigen TLS para ciertas funciones.

## Instalación

1. Unir el servidor a Tailscale y activar MagicDNS (ver [carpeta tailscale](../tailscale/)).

2. Generar el certificado TLS del equipo:

   ```bash
   sudo tailscale cert <EQUIPO>.<TAILNET>.ts.net
   ```

   Se crea la pareja de claves/certificado en `/var/lib/tailscale/certs/`.

3. Preparar la carpeta de datos y copiar ahí los certificados:

   ```bash
   mkdir -p /data/vaultwarden/tls
   cp /var/lib/tailscale/certs/<EQUIPO>.<TAILNET>.ts.net.crt /data/vaultwarden/tls/cert.pem
   cp /var/lib/tailscale/certs/<EQUIPO>.<TAILNET>.ts.net.key /data/vaultwarden/tls/key.pem
   ```

4. Editar `docker-compose.yml` y sustituir `<EQUIPO>.<TAILNET>` por el nombre real de tu equipo y tailnet.

5. Levantar:

   ```bash
   cd /opt/vaultwarden && docker compose up -d
   ```

6. Abrir `https://<EQUIPO>.<TAILNET>.ts.net:8443` **desde un dispositivo de la tailnet** (los clientes de Tailscale confían en los certificados `*.ts.net`; un navegador normal no, porque la CA es propia de tu tailnet). Crear la primera cuenta: el primer registro obtiene permisos de administrador.

7. Restricciones recomendadas: en `.env` o variables, `SIGNUPS_ALLOWED=false` una vez creadas tus cuentas.

8. En clientes Bitwarden (app/extensión): *Autohosted* → URL del servidor: `https://<EQUIPO>.<TAILNET>.ts.net:8443`.

## Acceso

| Qué | Dónde |
|---|---|
| Web vault / API | `https://<EQUIPO>.<TAILNET>.ts.net:8443` (solo tailnet) |

## Backups

Carpeta `/data/vaultwarden` (SQLite `vaultwarden.db` + adjuntos). Sin ella no hay cofre: copia cifrada fuera del servidor.
