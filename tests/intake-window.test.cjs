// Synthetic elapsed clocks and stubbed transport only. No GAS/Google/Auth/DB request is made.
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{JSDOM}=require('jsdom');
const root=path.join(__dirname,'..'),flush=async()=>{for(let i=0;i<3;i++)await new Promise(r=>setImmediate(r));};
function setup(mode,{endpoint=true,reply={ok:true},timeout=false}={}){
 const slug=mode==='home'?'':mode==='pilot'?'bmw-x1':'bmw-3-series';const dir=mode==='home'?path.dirname(process.env.HOME_PREVIEW_HTML||path.join(root,'dist/index.html')):process.env.CONTACT_FIRST_HTML_ROOT||path.join(root,'dist');
 const dom=new JSDOM(fs.readFileSync(path.join(dir,slug,'index.html'),'utf8'),{url:'https://bimport.jp/'+(slug?slug+'/':''),runScripts:'outside-only'}),w=dom.window,d=w.document,form=d.getElementById('estimate-form');
 assert.equal(form.dataset.contactFirst==='true',mode==='pilot');w.matchMedia=()=>({matches:true});w.HTMLElement.prototype.scrollIntoView=function(){};
 if(!endpoint){const el=d.getElementById('estimate-config');el.textContent=JSON.stringify({...JSON.parse(el.textContent),endpoint:''});}
 let now=Date.parse('2026-11-26T00:00:00Z'),sequence=0;const epoch=now,NativeDate=w.Date,timers=new Map(),posts=[],events=[];
 w.Date=class extends NativeDate{constructor(...args){super(...(args.length?args:[now]));}static now(){return now;}};
 w.setTimeout=(fn,ms)=>{const id=++sequence;timers.set(id,{fn,at:now+ms});return id;};w.clearTimeout=id=>timers.delete(id);
 w.BimportAnalytics={track:(name,params)=>events.push({name,params})};
 w.fetch=async(url,options)=>{posts.push({payload:JSON.parse(options.body),at:now-epoch});if(timeout)return new Promise((resolve,reject)=>options.signal.addEventListener('abort',()=>reject(Error('synthetic timeout'))));return{ok:true,json:async()=>reply};};
 w.eval(fs.readFileSync(path.join(root,'src/assets/js',mode==='home'?'home-estimate.js':'estimate-form.js'),'utf8'));
 const input=(name,value)=>{const e=form.elements[name];e.value=value;e.dispatchEvent(new w.Event(e.tagName==='SELECT'?'change':'input',{bubbles:true}));};
 const click=step=>form.querySelector('[data-step="'+step+'"] [data-next]').click();
 function complete(){
  if(mode==='pilot'){input('name','架空の動作確認');input('phone','09000000000');click(1);return;}
  if(mode==='home'){input('maker','other');input('makerOther','架空メーカー');input('model','other');input('modelOther','架空モデル');}
  else{const radios=form.querySelectorAll('input[name="bodyType"]');if(radios.length)radios[radios.length-1].click();const e=form.elements.grade;input('grade',e.options[e.options.length-1].value);}
  input('year','わからない');input('mileage','わからない');click(1);input('name','架空の動作確認');input('phone','09000000000');click(2);
 }
 async function advance(ms){now+=ms;let i=0;while([...timers].some(([,t])=>t.at<=now)){if(++i>30)throw Error('unbounded timers');const[id,t]=[...timers].filter(([,t])=>t.at<=now).sort((a,b)=>a[1].at-b[1].at)[0];timers.delete(id);t.fn();}await flush();}
 return{w,d,form,posts,events,complete,advance,shift:ms=>{now+=ms;},submit:()=>form.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true})),close:()=>w.close()};
}
for(const mode of ['home','legacy','pilot']){
 test(`${mode}: fast completion waits the real remaining5seconds, then sends once without inventing elapsedMs`,async()=>{const t=setup(mode);try{t.complete();t.shift(1000);t.submit();t.submit();assert.equal(t.posts.length,0);assert.equal(t.d.getElementById('estimate-submit').disabled,true);await t.advance(3999);assert.equal(t.posts.length,0);await t.advance(1);assert.equal(t.posts.length,1);assert.equal(t.posts[0].payload.elapsedMs,5000);assert.equal(t.posts[0].at,5000);assert.equal(t.form.hidden,true);}finally{t.close();}});
 test(`${mode}: normally completed form sends immediately after the accepted minimum`,async()=>{const t=setup(mode);try{t.complete();t.shift(6000);t.submit();await flush();assert.equal(t.posts.length,1);assert.equal(t.posts[0].payload.elapsedMs,6000);assert.equal(t.form.hidden,true);}finally{t.close();}});
 for(const elapsed of [-1,86400001])test(`${mode}: elapsed${elapsed} never sends or shows success and retains contact values`,async()=>{const t=setup(mode);try{t.complete();t.shift(elapsed);t.submit();await flush();assert.equal(t.posts.length,0);assert.equal(t.form.hidden,false);assert.equal(t.form.elements.name.value,'架空の動作確認');assert.equal(t.form.elements.phone.value,'09000000000');assert.equal(t.d.getElementById('estimate-submit').disabled,false);assert.equal(t.events.some(e=>e.name==='generate_lead'),false);assert(t.d.querySelector('a[href^="tel:"]'));assert(t.d.querySelector('a[href^="https://lin.ee/"]'));}finally{t.close();}});
 test(`${mode}: a background-delayed preparation beyond24hours is rechecked before transport`,async()=>{const t=setup(mode);try{t.complete();t.submit();await t.advance(86400001);assert.equal(t.posts.length,0);assert.equal(t.form.hidden,false);assert.equal(t.events.some(e=>e.name==='generate_lead'),false);assert.equal(t.form.elements.phone.value,'09000000000');}finally{t.close();}});
 test(`${mode}: missing destination fails visibly without simulated success or network`,async()=>{const t=setup(mode,{endpoint:false});try{t.complete();t.shift(6000);t.submit();await t.advance(1000);assert.equal(t.posts.length,0);assert.equal(t.form.hidden,false);assert.equal(t.d.getElementById('estimate-submit').disabled,false);assert.equal(t.events.some(e=>e.name==='generate_lead'),false);}finally{t.close();}});
 test(`${mode}: request timeout preserves data and does not automatically resend`,async()=>{const t=setup(mode,{timeout:true});try{t.complete();t.shift(6000);t.submit();assert.equal(t.posts.length,1);await t.advance(20000);assert.equal(t.form.hidden,false);assert.equal(t.form.elements.phone.value,'09000000000');assert.equal(t.d.getElementById('estimate-submit').disabled,false);await t.advance(60000);assert.equal(t.posts.length,1);assert.equal(t.events.some(e=>e.name==='generate_lead'),false);}finally{t.close();}});
 test(`${mode}: an exactly24hour valid timestamp stays within the received contract`,async()=>{const t=setup(mode);try{t.complete();t.shift(86400000);t.submit();await flush();assert.equal(t.posts.length,1);assert.equal(t.posts[0].payload.elapsedMs,86400000);}finally{t.close();}});
}
