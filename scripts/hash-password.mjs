// Genera el hash SHA-256 de una contraseña y una clave de encriptación nueva,
// listos para pegar en .env o en los Secrets del repositorio.
//
//   node scripts/hash-password.mjs "mi-contraseña-segura"

import { createHash, randomBytes } from 'node:crypto';

const password = process.argv[2];

if (!password) {
  console.error('Uso: node scripts/hash-password.mjs "tu-contraseña"');
  process.exit(1);
}

if (password.length < 12) {
  console.error(`\n⚠️  La contraseña tiene ${password.length} caracteres.`);
  console.error('   El hash queda expuesto en el bundle público, así que una');
  console.error('   contraseña corta o de diccionario se rompe en segundos.');
  console.error('   Usa 16+ caracteres aleatorios.\n');
}

const hash = createHash('sha256').update(password).digest('hex');
const encryptionKey = randomBytes(32).toString('hex');

console.log('\nVITE_ADMIN_PASSWORD_HASH=' + hash);
console.log('VITE_ENCRYPTION_KEY=' + encryptionKey);
console.log('\nOjo: al cambiar VITE_ENCRYPTION_KEY, los productos ya guardados');
console.log('en el navegador dejan de poder desencriptarse y se recargan los');
console.log('valores por defecto. Exporta antes lo que quieras conservar.\n');
