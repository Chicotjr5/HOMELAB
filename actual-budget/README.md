# Actual Budget

> Aplicación de presupuestos bajo el método de "asignación a cero" (zero-based budgeting) con arquitectura cliente-servidor y sincronización encriptada. [Docs](https://actualbudget.org) · Licencia: MIT (código abierto).

## Qué es

Actual Budget es el sucesor comunitario de Actual. Se gestiona desde el navegador con apps locales (también de escritorio) que sincronizan con un servidor propio. Su función estrella es la **sincronización bancaria automática** (con GoCardless/Plaid según país), que hasta hace poco era de pago en otras alternativas.

## Qué sustituye

- **YNAB** (suscripción anual de pago).
- **Mint** (cerrado) y agregadores financieros de terceros que venden tus datos.

## Para qué lo uso

Llevo las finanzas personales de casa: presupuestos mensuales, cuentas corrientes conectadas a mi banco y categorización automática de movimientos.

El servidor corre **escuchando solo en localhost** (`127.0.0.1:5006`) porque la sincronización bancaria debe lanzarla yo desde un script externo (ver abajo) y el acceso remoto lo hago con `tailscale serve`, que publica localhost:5006 en HTTPS dentro de la tailnet.

## Instalación

1. Servidor:

   ```bash
   mkdir -p /opt/actual-budget
   cd /opt/actual-budget
   docker compose up -d
   ```

2. Abrir `http://<LAN_IP>:5006`... al estar ligado a localhost, hazlo desde el propio servidor o vía `ssh -L`. Desde otros dispositivos: usa `tailscale serve` (ver [tailscale/README.md](../tailscale/)) y entra a `https://<EQUIPO>.<TAILNET>.ts.net`. Crea la contraseña de la instancia.

3. Script de sincronización bancaria (nodo aparte del contenedor):

   ```bash
   cd /opt/actual-budget/sync-script
   cp ../.env.example ../.env      # contraseña del servidor + sync ID del presupuesto
   npm install
   export $(grep -v '^#' ../.env | xargs)
   node sync.js                    # descarga el presupuesto y ejecuta runBankSync()
   ```

4. Programarlo (p. ej. cada mañana, con `crontab -e`):

   ```cron
   0 8 * * * cd /opt/actual-budget/sync-script && set -a && . ../.env && set +a && /usr/bin/node sync.js >> sync.log 2>&1
   ```

> Se usa la imagen `nightly` porque el endpoint de sync bancaria (`runBankSync`) evoluciona rápido y la estable no siempre lo incluye.

## Acceso

| Qué | Dónde |
|---|---|
| Servidor local | `127.0.0.1:5006` (no expuesto a la red) |
| Remoto | `https://<EQUIPO>.<TAILNET>.ts.net` vía `tailscale serve` |

## Backups

Carpeta `./data` del contenedor (archivos de los presupuestos). La exporta también *Ajustes → Exportar datos*.
