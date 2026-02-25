#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';

async function build(installId){
  if(!installId) throw new Error('installId required');
  const storesDir = path.join('installs', installId, 'assets', 'stores');
  const outFile = path.join('installs', installId, 'assets', 'stores_index.json');

  let entries = [];
  try{
    const items = await fs.readdir(storesDir, { withFileTypes: true });
    for(const it of items){
      if(!it.isDirectory()) continue;
      const infoPath = path.join(storesDir, it.name, 'info.json');
      try{
        const txt = await fs.readFile(infoPath, 'utf8');
        const json = JSON.parse(txt);
        json._dir = it.name;
        entries.push(json);
      }catch(e){ /* skip */ }
    }
  }catch(e){ console.error('failed to read stores dir', e); process.exit(1); }

  const out = {
    installId,
    generatedAt: (new Date()).toISOString(),
    count: entries.length,
    stores: entries
  };

  await fs.writeFile(outFile, JSON.stringify(out, null, 2), 'utf8');
  console.log('Wrote', outFile);
}

const arg = process.argv[2];
build(arg).catch(e=>{ console.error(e); process.exit(1); });
