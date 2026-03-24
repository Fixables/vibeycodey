/**
 * Shopee OAuth setup — run this ONCE to get your access token & refresh token.
 *
 * Usage:
 *   npx tsx sanity/scripts/shopee-auth.ts
 *
 * Prerequisites:
 *   SHOPEE_PARTNER_ID and SHOPEE_PARTNER_KEY must already be in .env.local
 *
 * What it does:
 *   1. Prints an authorization URL → open it in your browser
 *   2. You authorize the app → Shopee redirects to your redirect URL
 *   3. Paste the full redirect URL back into the terminal
 *   4. Script exchanges the code for tokens and writes them to .env.local
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import * as readline from 'readline';
import * as fs from 'fs';
import { getAuthUrl, getTokenFromCode } from '../../lib/shopee-client';

const REDIRECT_URL = 'https://baligreenhouse.vercel.app/shopee-callback';
// ↑ This URL just needs to exist — you copy the full redirect URL after auth.
//   Can also be http://localhost:3000/shopee-callback if testing locally.

const partnerId = Number(process.env.SHOPEE_PARTNER_ID);
const partnerKey = process.env.SHOPEE_PARTNER_KEY ?? '';

if (!partnerId || !partnerKey) {
  console.error('❌  SHOPEE_PARTNER_ID and SHOPEE_PARTNER_KEY must be set in .env.local');
  process.exit(1);
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q: string) => new Promise<string>((r) => rl.question(q, r));

function updateEnvLocal(updates: Record<string, string>) {
  const envPath = '.env.local';
  let content = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf-8') : '';

  for (const [key, value] of Object.entries(updates)) {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (regex.test(content)) {
      content = content.replace(regex, `${key}=${value}`);
    } else {
      content += `\n${key}=${value}`;
    }
  }

  fs.writeFileSync(envPath, content.trimStart());
  console.log(`  ✅ .env.local updated`);
}

async function main() {
  console.log('\n🔑  Shopee OAuth Setup\n');

  const authUrl = getAuthUrl(partnerId, partnerKey, REDIRECT_URL);
  console.log('1️⃣   Open this URL in your browser and authorize the app:\n');
  console.log(`    ${authUrl}\n`);
  console.log('2️⃣   After authorizing, Shopee will redirect you to a URL like:');
  console.log(`    ${REDIRECT_URL}?code=XXXX&shop_id=YYYY\n`);

  const redirected = (await ask('3️⃣   Paste the full redirect URL here: ')).trim();
  rl.close();

  const url = new URL(redirected);
  const code = url.searchParams.get('code');
  const shopId = Number(url.searchParams.get('shop_id'));

  if (!code || !shopId) {
    console.error('❌  Could not extract code or shop_id from URL:', redirected);
    process.exit(1);
  }

  console.log(`\n   code    = ${code}`);
  console.log(`   shop_id = ${shopId}`);
  console.log('\n⏳  Exchanging code for tokens...');

  const tokens = await getTokenFromCode(partnerId, partnerKey, code, shopId);

  if (tokens.error) {
    console.error(`❌  Token exchange failed: ${tokens.error} — ${tokens.message}`);
    process.exit(1);
  }

  console.log('\n✅  Tokens received!');
  console.log(`   access_token  = ${tokens.access_token.slice(0, 12)}...`);
  console.log(`   refresh_token = ${tokens.refresh_token.slice(0, 12)}...`);
  console.log(`   expires_in    = ${tokens.expire_in}s (~${Math.round(tokens.expire_in / 3600)}h)\n`);

  updateEnvLocal({
    SHOPEE_SHOP_ID: String(shopId),
    SHOPEE_ACCESS_TOKEN: tokens.access_token,
    SHOPEE_REFRESH_TOKEN: tokens.refresh_token,
  });

  console.log('\n🎉  Done! You can now run: npx tsx sanity/scripts/sync-shopee.ts\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
