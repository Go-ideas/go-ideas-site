(()=>{
 const form=document.querySelector('#project-inquiry');if(!form)return;
 const button=form.querySelector('[data-inquiry-submit]'),status=form.querySelector('[data-inquiry-status]'),mode=document.querySelector('[data-inquiry-mode]');
 const endpoint=window.GO_IDEAS_CONTACT?.endpoint||'';
 let validEndpoint=false;try{const url=new URL(endpoint);validEndpoint=url.protocol==='https:'&&url.hostname==='formspree.io'&&/^\/f\/[A-Za-z0-9]+$/.test(url.pathname)&&!url.search&&!url.hash&&!url.username&&!url.password}catch{}
 if(validEndpoint){form.action=endpoint;button.disabled=false;mode.hidden=true;}
 let sending=false;
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(sending)return;
  if(!validEndpoint){status.textContent='El envío todavía no está activo. Puedes escribir a contact@go-ideas.com.';status.dataset.state='error';return;}
  if(!form.reportValidity())return;
  if(form.elements._gotcha.value){status.textContent='No se pudo enviar. Escribe a contact@go-ideas.com si el problema continúa.';status.dataset.state='error';return;}
  const data=Object.fromEntries(new FormData(form));data._subject='Nueva consulta de proyecto | Go-Ideas';
  sending=true;button.disabled=true;button.textContent='Enviando…';form.setAttribute('aria-busy','true');status.textContent='Estamos enviando tu consulta.';delete status.dataset.state;
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),20000);
  try{
   const response=await fetch(endpoint,{method:'POST',headers:{'Accept':'application/json','Content-Type':'application/json'},body:JSON.stringify(data),signal:controller.signal});
   let result;try{result=await response.json()}catch{throw new Error('Respuesta no confirmada')}
   if(!response.ok||result.ok!==true)throw new Error('Envío no confirmado');
   status.textContent='Tu consulta se envió correctamente. El equipo de Go-Ideas podrá responderte al correo que compartiste.';status.dataset.state='success';form.reset();
  }catch{
   status.textContent='No pudimos confirmar el envío. Conservamos lo que escribiste; puedes reintentar o escribir a contact@go-ideas.com.';status.dataset.state='error';
  }finally{clearTimeout(timer);sending=false;button.disabled=false;button.textContent='Enviar consulta';form.removeAttribute('aria-busy')}
 });
})();
