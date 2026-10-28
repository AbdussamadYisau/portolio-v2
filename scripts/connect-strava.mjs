import { createServer } from 'node:http';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { readFile, writeFile, chmod } from 'node:fs/promises';
import { createStravaStore } from '../lib/strava.mjs';
try { process.loadEnvFile('.env.local'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
const id=process.env.STRAVA_CLIENT_ID?.trim(), secret=process.env.STRAVA_CLIENT_SECRET?.trim();
if (!id || !secret) { console.error('Add STRAVA_CLIENT_ID and STRAVA_CLIENT_SECRET to .env.local. See docs/integrations.md.'); process.exit(1); }
const redirect='http://127.0.0.1:4388/callback', state=randomBytes(32).toString('hex');
const auth=new URL('https://www.strava.com/oauth/authorize');
auth.search=new URLSearchParams({client_id:id,redirect_uri:redirect,response_type:'code',scope:'read',approval_prompt:'force',state}).toString();
let handling=false;
const server=createServer(async(req,res)=>{
  res.setHeader('Content-Type','text/plain; charset=utf-8');res.setHeader('Cache-Control','no-store');res.setHeader('Referrer-Policy','no-referrer');
  const url=new URL(req.url,redirect), given=Buffer.from(url.searchParams.get('state')||'');
  if(url.pathname!=='/callback'){res.writeHead(404).end('Not found');return;}
  if(given.length!==state.length||!timingSafeEqual(given,Buffer.from(state))){res.writeHead(400).end('Invalid authorization state.');return;}
  if(handling){res.writeHead(409).end('Connection already in progress.');return;}
  if(!url.searchParams.get('code')||!url.searchParams.get('scope')?.split(',').includes('read')){res.writeHead(400).end('Authorization incomplete. Run the helper again and grant read access.');server.close();clearTimeout(timeout);return;}
  handling=true;
  try{
    const response=await fetch('https://www.strava.com/oauth/token',{method:'POST',body:new URLSearchParams({client_id:id,client_secret:secret,grant_type:'authorization_code',code:url.searchParams.get('code')}),signal:AbortSignal.timeout(15000)});
    if(!response.ok)throw Error();
    const data=await response.json();
    if(!data.refresh_token||!data.athlete?.id)throw Error();
    let content=await readFile('.env.local','utf8');
    for(const [key,value] of Object.entries({STRAVA_REFRESH_TOKEN:data.refresh_token,STRAVA_ATHLETE_ID:String(data.athlete.id)})){
      const line=`${key}=${JSON.stringify(value)}`, pattern=new RegExp(`^${key}=.*$`,'m');
      content=pattern.test(content)?content.replace(pattern,()=>line):`${content.trimEnd()}\n${line}\n`;
    }
    await writeFile('.env.local',content,{mode:0o600});await chmod('.env.local',0o600);
    const store=createStravaStore();
    if(store){await store.set('portfolio:strava:token',{access_token:data.access_token,refresh_token:data.refresh_token,expires_at:data.expires_at});await store.set('portfolio:strava:running',null,1);await store.set('portfolio:strava:backoff',null,1);}
    res.end('Strava connected. Close this tab and restart the portfolio.');
    console.log('Strava connected. Refresh token and athlete ID saved to ignored .env.local. Add the server variables to Vercel and redeploy.');
  }catch{res.writeHead(500).end('Connection failed. Check your app settings and Redis configuration, then try again.');console.error('Connection failed. No credentials have been printed.');}
  finally{server.close();clearTimeout(timeout);}
});
const timeout=setTimeout(()=>{console.error('Authorization timed out. Run the helper again.');server.close();},600000);
server.on('error',()=>{clearTimeout(timeout);console.error('Cannot listen on 127.0.0.1:4388. Check whether the port is in use.');process.exitCode=1;});
server.listen(4388,'127.0.0.1',()=>console.log(`Open this URL to connect your Strava account:\n${auth.href}\nWaiting up to 10 minutes. Press Ctrl+C to cancel.`));
