// Actual generated HTML + existing scripts in JSDOM. No browser, server, native navigation or real transport.
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{JSDOM}=require('jsdom');
const root=process.env.BIMPORT_FORM_INITIALIZATION_ROOT||path.join(__dirname,'..');
function setup(mode){
 const slug=mode==='home'?'':mode==='pilot'?'bmw-x1':'bmw-3-series';
 const dom=new JSDOM(fs.readFileSync(path.join(root,'dist',slug,'index.html'),'utf8'),{url:'https://bimport.jp/'+(slug?slug+'/':''),runScripts:'outside-only'});
 const w=dom.window,d=w.document,form=d.getElementById('estimate-form');
 w.matchMedia=()=>({matches:true});w.HTMLElement.prototype.scrollIntoView=function(){};
 let requests=0;w.fetch=()=>{requests++;throw Error('Unexpected transport during setup');};
 const script=fs.readFileSync(path.join(root,'src/assets/js',mode==='home'?'home-estimate.js':'estimate-form.js'),'utf8');
 return{w,d,form,script,requests:()=>requests,run:()=>w.eval(script),close:()=>w.close()};
}
function assertInert(t){
 const {form,d,w}=t;
 assert.equal(form.method,'post','native fallback must never default to a query-string submission');
 for(const name of ['name','phone'])assert(form.elements[name].matches(':disabled'),name+' must be disabled before setup finishes');
 assert(d.getElementById('estimate-submit').matches(':disabled'));
 form.elements.name.value='架空の確認';form.elements.phone.value='09000000000';
 const data=new w.FormData(form);assert.equal(data.has('name'),false);assert.equal(data.has('phone'),false);
 const fallback=d.getElementById('estimate-init-fallback');assert(fallback&&!fallback.hidden);
 assert(fallback.querySelector('a[href^="tel:"]'));assert(fallback.querySelector('a[href^="https://lin.ee/"]'));
 assert.equal(t.requests(),0);
}
for(const mode of ['home','legacy','pilot']){
 test(`${mode}: without JavaScript personal values are excluded and both existing alternatives remain`,()=>{
  const t=setup(mode);try{assertInert(t);}finally{t.close();}
 });
 test(`${mode}: ready handlers enable contact fields without erasing values or triggering a request`,()=>{
  const t=setup(mode);try{
   assertInert(t);t.run();
   for(const name of ['name','phone'])assert.equal(t.form.elements[name].matches(':disabled'),false);
   assert.equal(t.form.elements.name.value,'架空の確認');assert.equal(t.form.elements.phone.value,'09000000000');
   assert.equal(t.form.querySelectorAll('[data-init-locked]').length,0);
   assert.equal(t.d.getElementById('estimate-init-fallback').hidden,true);
   const event=new t.w.Event('submit',{bubbles:true,cancelable:true});t.form.dispatchEvent(event);
   assert.equal(event.defaultPrevented,true,'existing handler intercepts native submission before confirmation');
   assert.equal(t.requests(),0);assert.equal(t.form.hidden,false);
  }finally{t.close();}
 });
 test(`${mode}: missing configuration leaves safe inputs and visible telephone/LINE instead of half-ready fields`,()=>{
  const t=setup(mode);try{t.d.getElementById('estimate-config').remove();t.run();assertInert(t);}finally{t.close();}
 });
 test(`${mode}: invalid configuration cannot enable fields or serialize personal values`,()=>{
  const t=setup(mode);try{t.d.getElementById('estimate-config').textContent='{';assert.throws(()=>t.run());assertInert(t);}finally{t.close();}
 });
 test(`${mode}: an interrupted initial setup before the handler leaves no personal form-data entries`,()=>{
  const t=setup(mode);try{t.d.getElementById('f-year').remove();assert.throws(()=>t.run());assertInert(t);}finally{t.close();}
 });
 test(`${mode}: failure while attaching the submit handler does not enable an unguarded form`,()=>{
  const t=setup(mode);try{
   const listen=t.form.addEventListener.bind(t.form);
   t.form.addEventListener=function(type,...args){if(type==='submit')throw Error('synthetic failed setup');return listen(type,...args);};
   assert.throws(()=>t.run(),/synthetic failed setup/);assertInert(t);
  }finally{t.close();}
 });
}
