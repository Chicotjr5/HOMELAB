const actualApi = require('@actual-app/api');

async function run() {
  await actualApi.init({
    dataDir: '/opt/actual-budget/sync-script/cache',
    serverURL: 'http://127.0.0.1:5006',
    password: process.env.ACTUAL_PASSWORD,
  });

  // ID (sync id) del presupuesto: se ve en Ajustes -> Exportar datos, o en la URL del archivo
  await actualApi.downloadBudget(process.env.ACTUAL_BUDGET_SYNC_ID);

  // Sincroniza los movimientos bancarios de las cuentas conectadas
  await actualApi.runBankSync();

  await actualApi.shutdown();
  console.log('Sync completado:', new Date().toISOString());
}

run().catch((err) => {
  console.error('Error en sync:', err);
  process.exit(1);
});
