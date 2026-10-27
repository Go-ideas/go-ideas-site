(()=>{
 const form=document.querySelector('#project-inquiry');if(!form)return;
 const dialog=document.querySelector('#inquiry-dialog');let opener=null;
 document.querySelectorAll('[data-open-inquiry]').forEach(trigger=>trigger.addEventListener('click',event=>{event.preventDefault();opener=trigger;if(!dialog.open)dialog.showModal();document.body.classList.add('inquiry-modal-open');form.querySelector('#inquiry-name').focus()}));
 dialog.querySelector('[data-close-inquiry]').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{const r=dialog.getBoundingClientRect();if(event.target===dialog&&(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom))dialog.close()});
 dialog.addEventListener('close',()=>{document.body.classList.remove('inquiry-modal-open');opener?.focus()});
 const button=form.querySelector('[data-inquiry-submit]'),status=form.querySelector('[data-inquiry-status]'),preference=form.elements.preference,phone=form.elements.phone,phoneField=form.querySelector('[data-inquiry-phone]'),fallback=form.querySelector('[data-inquiry-fallback]'),copyButton=form.querySelector('[data-inquiry-copy]'),copyText=form.querySelector('[data-inquiry-copy-text]');
 function updatePreference(){const whatsapp=preference.value==='whatsapp';phoneField.hidden=!whatsapp;phone.disabled=!whatsapp;phone.required=whatsapp;phone.setCustomValidity('')}
 preference.addEventListener('change',updatePreference);updatePreference();button.disabled=false;
 const endpoint=window.GO_IDEAS_CONTACT?.endpoint||'';
 let directEnabled=false;try{const url=new URL(endpoint);directEnabled=url.protocol==='https:'&&url.hostname==='formspree.io'&&/^\/f\/[A-Za-z0-9]+$/.test(url.pathname)&&!url.search&&!url.hash&&!url.username&&!url.password}catch{}
 let sending=false;
 const mode=document.querySelector('[data-inquiry-mode]'),privacy=document.querySelector('.inquiry-privacy');
 if(directEnabled){button.textContent='Enviar consulta';mode.textContent='Envía tu consulta desde esta página. Indica si prefieres que después te contactemos por correo o WhatsApp.';privacy.textContent='Usaremos tus datos para responder esta consulta por el canal que elijas. No te suscribes a comunicaciones comerciales. El envío se procesa mediante Formspree.';}

 form.addEventListener('input',event=>{if(sending)return;event.target.setCustomValidity?.('');fallback.hidden=true;status.textContent='';delete status.dataset.state});
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(sending)return;
  const name=form.elements.name,message=form.elements.message;
  if(!name.value.trim())name.setCustomValidity('Escribe tu nombre.');
  if(message.value.trim().length<20)message.setCustomValidity('Describe el reto con al menos 20 caracteres.');
  if(preference.value==='whatsapp'&&phone.value.replace(/\D/g,'').length<7)phone.setCustomValidity('Escribe tu número de WhatsApp con código de país.');
  if(!form.reportValidity())return;
  if(form.elements._gotcha.value){status.textContent='No pudimos preparar la consulta. Puedes escribir a contact@go-ideas.com.';return;}
  const channel=preference.value==='whatsapp'?'WhatsApp':'Correo electrónico';
  const lines=['Nueva consulta de proyecto | Go-Ideas','','Nombre: '+name.value.trim(),'Correo: '+form.elements.email.value.trim(),'Empresa: '+(form.elements.company.value.trim()||'No indicada'),'Preferencia para el seguimiento: '+channel];
  if(preference.value==='whatsapp')lines.push('WhatsApp (con código de país): '+phone.value.trim());
  lines.push('','Qué necesita resolver:',message.value.trim(),'','El prospecto solicita que el seguimiento se realice por '+channel+'.');
  const subject='Consulta de proyecto | Go-Ideas',body=lines.join('\n');
  const query=new URLSearchParams({to:'contact@go-ideas.com',subject,body});
  form.querySelector('[data-inquiry-outlook-personal]').href='https://outlook.live.com/mail/0/deeplink/compose?'+query.toString();
  form.querySelector('[data-inquiry-outlook-work]').href='https://outlook.office.com/mail/deeplink/compose?'+query.toString();
  const gmailQuery=new URLSearchParams({view:'cm',fs:'1',to:'contact@go-ideas.com',su:subject,body});
  form.querySelector('[data-inquiry-gmail]').href='https://mail.google.com/mail/?'+gmailQuery.toString();
  copyText.value='Para: contact@go-ideas.com\nAsunto: '+subject+'\n\n'+body;
  if(directEnabled){
   const payload={name:name.value.trim(),email:form.elements.email.value.trim(),company:form.elements.company.value.trim(),contact_preference:channel,message:message.value.trim(),_subject:subject,_gotcha:''};
   if(preference.value==='whatsapp')payload.phone=phone.value.trim();
   sending=true;fallback.hidden=true;form.setAttribute('aria-busy','true');status.textContent='Enviando tu consulta…';status.dataset.state='sending';
   const controls=[...form.querySelectorAll('input,select,textarea,button')].map(control=>({control,disabled:control.disabled}));
   controls.forEach(({control})=>{control.disabled=true});button.textContent='Enviando…';
   const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),20000);
   try{
    const response=await fetch(endpoint,{method:'POST',headers:{'Accept':'application/json','Content-Type':'application/json'},body:JSON.stringify(payload),signal:controller.signal});
    const result=await response.json();
    if(!response.ok||result.ok!==true)throw new Error('Envío no confirmado');
    status.textContent='Tu consulta se envió correctamente. Te contactaremos por '+(preference.value==='whatsapp'?'WhatsApp':'correo electrónico')+' con los datos que compartiste.';status.dataset.state='success';form.reset();
   }catch{
    status.textContent='No pudimos confirmar el envío. Conservamos tus datos; puedes reintentar o usar las opciones de correo que aparecen abajo.';status.dataset.state='error';fallback.hidden=false;
   }finally{
    clearTimeout(timer);controls.forEach(({control,disabled})=>{control.disabled=disabled});sending=false;updatePreference();button.textContent='Enviar consulta';form.removeAttribute('aria-busy');
   }
   return;
  }
  fallback.hidden=false;status.dataset.state='prepared';
  status.textContent='Tu mensaje está preparado, pero todavía no se ha enviado. Elige Outlook o Gmail, revisa el borrador y pulsa Enviar. Tu preferencia de seguimiento va incluida.';
 });
 copyButton.addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(copyText.value);status.textContent='Mensaje copiado. Pégalo en un correo dirigido a contact@go-ideas.com y pulsa Enviar.'}
  catch{copyText.focus();copyText.select();status.textContent='Seleccionamos el mensaje para que puedas copiarlo manualmente y enviarlo a contact@go-ideas.com.'}
 });
})();
