// Contact-first pilot uses compiled promoted HTML; legacy tests use four unflagged existing car pages.
// Every provider request is an in-memory fetch stub; no Google/GAS/Auth/DB call runs.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM}=require('jsdom');
const root=path.join(__dirname,'..');
const slugs=['bmw-x1','mercedes-benz-g-class','abarth-124-spider','porsche-911'];
const settle=()=>new Promise(resolve=>setImmediate(resolve));
function setup(slug,{legacy=false,reply={ok:true},reject=false,missingEndpoint=false,waitForAbort=false}={}) {
 const dir=legacy?path.join(root,'dist'):process.env.CONTACT_FIRST_HTML_ROOT;
 assert.ok(dir,'Set CONTACT_FIRST_HTML_ROOT to the promoted four-page build');
 const dom=new JSDOM(fs.readFileSync(path.join(dir,slug,'index.html'),'utf8'),{url:`https://bimport.jp/${slug}/`,runScripts:'outside-only'});
 const w=dom.window,d=w.document,form=d.getElementById('estimate-form');
 assert.equal(form.getAttribute('data-contact-first')==='true',!legacy,'use the actual compiled mode, not mutated fixture flags');
 const cfg=d.getElementById('estimate-config');
 if(missingEndpoint)cfg.textContent=JSON.stringify({...JSON.parse(cfg.textContent),endpoint:''});
 w.matchMedia=()=>({matches:true});w.HTMLElement.prototype.scrollIntoView=function(){};
 let now=Date.parse('2026-11-25T08:00:00Z'),sequence=0;
 const NativeDate=w.Date,timers=new Map(),posts=[];
 w.Date=class extends NativeDate{constructor(...args){super(...(args.length?args:[now]));}static now(){return now;}};
 w.setTimeout=(fn,ms)=>{const id=++sequence;timers.set(id,{fn,at:now+ms});return id;};w.clearTimeout=id=>timers.delete(id);
 w.fetch=async(url,options)=>{posts.push({url,payload:JSON.parse(options.body)});if(reject)throw Error('synthetic offline');if(waitForAbort)return new Promise((_,no)=>options.signal.addEventListener('abort',()=>no(Error('synthetic abort'))));return{ok:true,json:async()=>reply};};
 Object.defineProperty(d,'currentScript',{value:d.querySelector('script[data-ga4-id]')});
 w.eval(fs.readFileSync(path.join(root,'src/assets/js/analytics.js'),'utf8'));
 w.eval(fs.readFileSync(path.join(root,'src/assets/js/estimate-form.js'),'utf8'));
 const input=(name,value)=>{const el=form.elements[name];el.value=value;el.dispatchEvent(new w.Event(el.tagName==='SELECT'?'change':'input',{bubbles:true}));};
 const next=step=>form.querySelector(`[data-step="${step}"] [data-next]`).click();
 const events=()=>Array.from(w.dataLayer||[],x=>Array.from(x)).filter(x=>x[0]==='event');
 const advance=async ms=>{now+=ms;let count=0;while([...timers].some(([,t])=>t.at<=now)){if(++count>30)throw Error('unbounded timers');const[id,t]=[...timers].filter(([,t])=>t.at<=now).sort((a,b)=>a[1].at-b[1].at)[0];timers.delete(id);t.fn();}await settle();};
 const complete=()=>{input('name','架空の動作確認');input('phone','09000000000');next(1);assert.equal(d.getElementById('estimate-step-num').textContent,'2');assert.equal(form.querySelector('[data-step="3"]').hidden,false);};
 const submit=()=>form.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
 return{w,d,form,input,next,events,advance,complete,submit,posts,close:()=>w.close(),shiftClock:ms=>{now+=ms;}};
}
for(const slug of slugs){
 test(`${slug}: first input is name and phone; inherited vehicle, no initial photo or duplicate car input`,()=>{
  const t=setup(slug);try{
   assert.equal(t.form.querySelector('[data-step="2"]'),null);assert.equal(t.d.querySelectorAll('[data-step-indicator]').length,2);
   assert.deepEqual([...t.form.querySelectorAll('[required]')].map(e=>e.name),['name','phone']);
   assert.equal(t.form.querySelectorAll('[name=maker],[name=model],[type=file]').length,0);
   assert.equal(t.d.getElementById('optional-vehicle-details').open,false);
   assert.equal(t.d.body.textContent.includes('60秒'),false);assert.equal(t.events().length,0);t.next(1);assert.equal(t.d.activeElement.name,'name');
   assert.equal(t.form.elements.name.getAttribute('aria-invalid'),'true');
   assert.deepEqual(t.form.elements.name.getAttribute('aria-describedby').split(/\s+/),['f-name-help','estimate-error-name']);
   assert.ok(t.d.getElementById('f-name-help').textContent.includes('名字'));
   assert.ok(t.d.getElementById('f-phone-help').textContent.includes('ご案内'));
   for(const group of t.form.querySelectorAll('[role="radiogroup"]'))assert.ok(t.d.getElementById(group.getAttribute('aria-labelledby')));
   t.input('name','確認');t.next(1);assert.equal(t.d.activeElement.name,'phone');
   assert.equal(t.form.elements.name.hasAttribute('aria-invalid'),false);assert.equal(t.form.elements.name.getAttribute('aria-describedby'),'f-name-help');assert.equal(t.posts.length,0);
  }finally{t.close();}
 });
 test(`${slug}: unknown vehicle details go directly to confirmation after real contact entry`,()=>{
  const t=setup(slug);try{
   t.complete();assert.equal(t.d.activeElement.textContent,'STEP 2｜入力内容の確認');
   assert.equal(t.form.elements.year.value,'わからない');assert.equal(t.form.elements.mileage.value,'わからない');assert.equal(t.form.elements.grade.value,'その他・わからない');
   assert.ok(t.d.getElementById('estimate-confirm').textContent.startsWith('ご連絡先'));
   assert.equal(t.d.querySelector('[aria-current="step"]').getAttribute('data-step-indicator'),'3');
   assert.equal(t.d.getElementById('optional-vehicle-details').open,false);
   assert.equal(t.events().filter(e=>e[1]==='generate_lead').length,0);assert.equal(t.posts.length,0);assert.ok(t.events().every(e=>e[2].form_variant==='contact_first_v1'));
  }finally{t.close();}
 });
 test(`${slug}: fast completion waits real five seconds and keeps the existing one-send guard`,async()=>{
  const t=setup(slug);try{
   t.complete();t.submit();t.submit();assert.equal(t.posts.length,0);assert.equal(t.d.getElementById('estimate-submit').disabled,true);
   await t.advance(4999);assert.equal(t.posts.length,0);await t.advance(1);assert.equal(t.posts.length,1);
   assert.equal(t.posts[0].payload.elapsedMs,5000);assert.equal(t.posts[0].payload.year,'わからない');assert.equal(t.posts[0].payload.phone,'09000000000');
   assert.equal(t.d.getElementById('estimate-done').hidden,false);assert.equal(t.events().filter(e=>e[1]==='generate_lead').length,1);
   assert.ok(!JSON.stringify(t.w.dataLayer).includes('09000000000')&&!JSON.stringify(t.w.dataLayer).includes('架空の動作確認'));
   assert.equal('case_id'in t.posts[0].payload,false);assert.equal('testToken'in t.posts[0].payload,false);
  }finally{t.close();}
 });
 test(`${slug}: known details/contact survive back and targeted edit, with accessible focus`,()=>{
  const t=setup(slug);try{
   const details=t.d.getElementById('optional-vehicle-details');details.open=true;
   const radio=t.form.querySelector('input[name=bodyType]');if(radio)radio.click();
   const grade=[...t.form.elements.grade.options].find(o=>o.value&&o.value!=='その他・わからない');if(grade)t.input('grade',grade.value);
   const year=[...t.form.elements.year.options].find(o=>o.value&&o.value!=='わからない').value;
   const mileage=[...t.form.elements.mileage.options].find(o=>o.value&&o.value!=='わからない').value;
   t.input('year',year);t.input('mileage',mileage);t.input('prefecture','岡山県');t.complete();
   t.form.querySelector('[aria-label="車両情報を修正"]').click();assert.equal(details.open,true);assert.ok(details.contains(t.d.activeElement));
   t.next(1);t.form.querySelector('[aria-label="ご連絡先を修正"]').click();
   assert.equal(t.d.getElementById('estimate-step-num').textContent,'1');assert.equal(t.form.elements.phone.value,'09000000000');
   assert.equal(t.form.elements.year.value,year);assert.equal(t.form.elements.mileage.value,mileage);if(grade)assert.equal(t.form.elements.grade.value,grade.value);
   t.next(1);assert.equal(t.form.elements.prefecture.value,'岡山県');assert.equal(t.posts.length,0);
  }finally{t.close();}
 });
 test(`${slug}: missing supported unknown option fails closed, opens its details and focuses the real error`,()=>{
  const t=setup(slug);try{
   [...t.form.elements.year.options].filter(o=>o.value==='わからない').forEach(o=>o.remove());
   t.input('name','確認');t.input('phone','09000000000');t.next(1);
   assert.equal(t.d.getElementById('estimate-step-num').textContent,'1');assert.equal(t.d.getElementById('optional-vehicle-details').open,true);
   assert.equal(t.d.activeElement.name,'year');assert.equal(t.form.elements.year.getAttribute('aria-invalid'),'true');assert.equal(t.posts.length,0);
  }finally{t.close();}
 });
 test(`${slug}: ordinary public form keeps three steps and mandatory details/contact`,()=>{
  const legacySlug=['bmw-3-series','jeep-avenger','audi-a3','defender'][slugs.indexOf(slug)];
  const t=setup(legacySlug,{legacy:true});try{
   assert.equal(t.form.getAttribute('data-details-optional'),null);assert.equal(t.events().some(e=>'form_variant'in e[2]),false);assert.equal(t.d.querySelectorAll('[data-step-indicator]').length,3);
   t.next(1);assert.equal(t.d.getElementById('estimate-step-num').textContent,'1');assert.equal(t.form.elements.year.value,'');assert.ok(t.form.querySelectorAll('.is-invalid').length>=3);
   const radio=t.form.querySelector('input[name=bodyType][data-body=unknown]');if(radio)radio.click();
   t.input('grade','その他・わからない');t.input('year','わからない');t.input('mileage','わからない');t.next(1);
   assert.equal(t.d.getElementById('estimate-step-num').textContent,'2');t.next(2);assert.equal(t.d.getElementById('estimate-step-num').textContent,'2');
   t.input('name','確認');t.input('phone','09000000000');t.next(2);assert.equal(t.d.getElementById('estimate-step-num').textContent,'3');assert.equal(t.posts.length,0);
  }finally{t.close();}
 });
}
for(const phone of ['','123','090123456789','letters'])test(`telephone remains required/validated: ${phone||'empty'}`,()=>{
 const t=setup(slugs[0]);try{t.input('name','確認');t.input('phone',phone);t.next(1);assert.equal(t.d.getElementById('estimate-step-num').textContent,'1');assert.equal(t.d.activeElement.name,'phone');assert.equal(t.posts.length,0);}finally{t.close();}
});
test('fullwidth phone normalizes only at confirmation/payload, without repeating contact entry',async()=>{
 const t=setup(slugs[0]);try{t.input('name','確認');t.input('phone','０９０−００００−００００');t.next(1);assert.ok(t.d.getElementById('estimate-confirm').textContent.includes('09000000000'));await t.advance(6000);t.submit();await settle();assert.equal(t.posts[0].payload.phone,'09000000000');}finally{t.close();}
});
test('Enter goes to confirmation without transmitting; editing back keeps details/contact',()=>{
 const t=setup(slugs[0]);try{t.input('name','確認');t.input('phone','09000000000');const e=new t.w.KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true});t.form.elements.phone.dispatchEvent(e);assert.equal(e.defaultPrevented,true);assert.equal(t.d.getElementById('estimate-step-num').textContent,'2');assert.equal(t.posts.length,0);t.form.querySelector('[data-step="3"] [data-prev]').click();assert.equal(t.form.elements.name.value,'確認');}finally{t.close();}
});
test('changes made after confirmation are revalidated before send and focus a visible contact input',()=>{
 const t=setup(slugs[0]);try{t.complete();t.form.elements.phone.value='';t.submit();assert.equal(t.d.getElementById('estimate-step-num').textContent,'1');assert.equal(t.d.activeElement.name,'phone');assert.equal(t.form.querySelector('[data-step="1"]').hidden,false);assert.equal(t.posts.length,0);}finally{t.close();}
});
test('confirmation treats user-provided markup as text',()=>{
 const t=setup(slugs[0]);try{t.input('name','<b>確認</b>');t.input('phone','09000000000');t.next(1);assert.ok(t.d.getElementById('estimate-confirm').textContent.includes('<b>確認</b>'));assert.equal(t.d.querySelectorAll('#estimate-confirm b').length,0);}finally{t.close();}
});
for(const options of [{reject:true},{reply:{ok:false}},{reply:null},{missingEndpoint:true}])test(`failed/unconfigured intake preserves input and offers both contact methods: ${JSON.stringify(options)}`,async()=>{
 const t=setup(slugs[0],options);try{t.complete();await t.advance(6000);t.submit();await settle();assert.equal(t.form.hidden,false);assert.equal(t.form.elements.phone.value,'09000000000');assert.equal(t.d.getElementById('estimate-contact-fallback').hidden,false);assert.equal(t.d.getElementById('estimate-contact-fallback').querySelectorAll('a').length,2);assert.equal(t.d.getElementById('estimate-submit').disabled,false);assert.equal(t.d.getElementById('estimate-submit').textContent,'この内容で査定相談を送る');assert.equal(t.events().some(e=>e[1]==='generate_lead'),false);const before=t.posts.length;await t.advance(60000);assert.equal(t.posts.length,before);}finally{t.close();}
});
test('a pending request times out without silently losing customer input or automatically sending again',async()=>{
 const t=setup(slugs[0],{waitForAbort:true});try{t.complete();await t.advance(6000);t.submit();assert.equal(t.posts.length,1);await t.advance(20000);await settle();assert.equal(t.d.getElementById('estimate-contact-fallback').hidden,false);assert.equal(t.form.elements.name.value,'架空の動作確認');await t.advance(60000);assert.equal(t.posts.length,1);}finally{t.close();}
});
for(const elapsed of [-1,24*60*60*1000+1])test(`clock outside accepted window never fabricates elapsed: ${elapsed}`,async()=>{
 const t=setup(slugs[0]);try{t.complete();t.shiftClock(elapsed);t.submit();await settle();assert.equal(t.posts.length,0);assert.equal(t.form.hidden,false);assert.equal(t.d.getElementById('estimate-submit').disabled,false);}finally{t.close();}
});
test('an already elapsed five seconds adds no artificial delay',async()=>{
 const t=setup(slugs[0]);try{t.complete();await t.advance(6000);t.submit();await settle();assert.equal(t.posts.length,1);assert.equal(t.posts[0].payload.elapsedMs,6000);}finally{t.close();}
});
test('test-mode acknowledgments are not counted as customer leads',async()=>{
 const t=setup(slugs[0],{reply:{ok:true,test:true}});try{t.complete();await t.advance(6000);t.submit();await settle();assert.equal(t.events().some(e=>e[1]==='generate_lead'),false);}finally{t.close();}
});
