# Joplin Server

> Backend de sincronización para la app de notas Joplin. [Docs](https://joplinapp.org) · Licencia: AGPL-3.0 (código abierto).

## Qué es

Joplin Server es el componente que permite sincronizar las notas y cuadernos de la app [Joplin](https://joplinapp.org) entre dispositivos con cifrado de extremo a extremo (E2EE), además de compartir notas y publicar calendarios (CalDAV). Al autoalojarlo, tus notas pasan por tu servidor en vez de por la nube oficial.

## Qué sustituye

- **Evernote** (app + sincronización de pago).
- **Notion** o **OneNote** si buscas notas locales y abiertas (formato Markdown).
- La sincronización de pago de Joplin (en la práctica: cualquiera de sus targets de pago; aquí uso el servidor propio, gratuito).

## Para qué lo uso

Es el destino de sincronización de Joplin en mi PC y mi móvil (misma tailnet): escribo en cualquier dispositivo, las notas se sincronizan con el servidor en el puerto **22300** y viajan cifradas E2EE con mi clave maestra.

## Instalación

1. Preparar la carpeta:

   ```bash
   mkdir -p /opt/joplin
   cd /opt/joplin
   cp .env.example .env   # IP de acceso y contraseña de la DB
   ```

2. Levantar (servidor + Postgres 15):

   ```bash
   docker compose up -d
   ```

3. Abrir la UI de administración en `http://<TAILSCALE_IP>:22300` y crear un usuario (por defecto `admin@localhost`/`admin`, **cámbialos** en `.env`... o mejor, crea tu propio usuario y elimina el de ejemplo).

4. En la app de Joplin (PC/móvil): *Sincronización → Joplin Server* y poner:
   - URL del servidor: `http://<TAILSCALE_IP>:22300`
   - Correo y contraseña del usuario creado.

5. Activar el cifrado E2EE en la app y definir una clave maestra (¡no se puede recuperar!).

## Acceso

| Qué | Dónde |
|---|---|
| API/UI servidor | `http://<TAILSCALE_IP>:22300` |

## Backups

Carpeta `./data/postgres` (o volcado `pg_dump`) y exportación periódica de las notas desde la app.
