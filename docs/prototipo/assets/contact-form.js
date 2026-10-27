(()=>{
 const form=document.querySelector('#project-inquiry');if(!form)return;
 const dialog=document.querySelector('#inquiry-dialog');let opener=null;
 document.querySelectorAll('[data-open-inquiry]').forEach(trigger=>trigger.addEventListener('click',event=>{event.preventDefault();opener=trigger;if(!dialog.open)dialog.showModal();document.body.classList.add('inquiry-modal-open');form.querySelector('#inquiry-name').focus()}));
 dialog.querySelector('[data-close-inquiry]').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{const r=dialog.getBoundingClientRect();if(event.target===dialog&&(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom))dialog.close()});
 dialog.addEventListener('close',()=>{document.body.classList.remove('inquiry-modal-open');opener?.focus()});
 const button=form.querySelector('[data-inquiry-submit]'),status=form.querySelector('[data-inquiry-status]'),preference=form.elements.preference,phone=form.elements.phone,phoneField=form.querySelector('[data-inquiry-phone]'),fallback=form.querySelector('[data-inquiry-fallback]'),mailLink=form.querySelector('[data-inquiry-mail-link]'),copyButton=form.querySelector('[data-inquiry-copy]'),copyText=form.querySelector('[data-inquiry-copy-text]');
 function updatePreference(){const whatsapp=preference.value==='whatsapp';phoneField.hidden=!whatsapp;phone.disabled=!whatsapp;phone.required=whatsapp;phone.setCustomValidity('')}
 preference.addEventListener('change',updatePreference);updatePreference();button.disabled=false;
 form.addEventListener('input',event=>{event.target.setCustomValidity?.('');fallback.hidden=true;status.textContent='';delete status.dataset.state});
 form.addEventListener('submit',event=>{
  event.preventDefault();
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
  mailLink.href='mailto:contact@go-ideas.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  const query=new URLSearchParams({to:'contact@go-ideas.com',subject,body});
  form.querySelector('[data-inquiry-outlook-personal]').href='https://outlook.live.com/mail/0/deeplink/compose?'+query.toString();
  form.querySelector('[data-inquiry-outlook-work]').href='https://outlook.office.com/mail/deeplink/compose?'+query.toString();
  copyText.value='Para: contact@go-ideas.com\nAsunto: '+subject+'\n\n'+body;
  fallback.hidden=false;status.dataset.state='prepared';
  status.textContent='Tu mensaje está preparado, pero todavía no se ha enviado. Elige Outlook u otra aplicación, revisa el borrador y pulsa Enviar. Tu preferencia de seguimiento va incluida.';
 });
 copyButton.addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(copyText.value);status.textContent='Mensaje copiado. Pégalo en un correo dirigido a contact@go-ideas.com y pulsa Enviar.'}
  catch{copyText.focus();copyText.select();status.textContent='Seleccionamos el mensaje para que puedas copiarlo manualmente y enviarlo a contact@go-ideas.com.'}
 });
})();
