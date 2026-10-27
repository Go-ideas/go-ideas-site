# Activar recepción de consultas

El destinatario solicitado es contact@go-ideas.com. El formulario vive en el prototipo hasta su revisión.

## Configuración

1. Crear o seleccionar un formulario de Formspree y configurar/verificar contact@go-ideas.com como receptor. Revisar el plan gratuito y sus condiciones vigentes en la cuenta del titular.
2. Añadir el endpoint público https://formspree.io/f/IDENTIFICADOR a docs/prototipo/assets/contact-config.js y dist/prototipo/assets/contact-config.js. No incluir contraseñas, claves de API ni credenciales. El destinatario real se configura en Formspree, no en el código del navegador.
3. Revisar antispam y restricciones de dominio del receptor; completar el aviso de privacidad aplicable antes de publicar el formulario de recepción.
4. Probar desde go-ideas.com/prototipo/, verificar recepción en la bandeja, contenido y dirección de respuesta. Una respuesta aceptada por el proveedor no acredita entrega en la bandeja.
5. Tras la aprobación, incorporar HTML, estilos y scripts de contacto a la página principal y volver a probar recepción.

## Comportamiento

- Sin endpoint válido, permanece el flujo actual de borrador en Outlook/Gmail y copia.
- Con endpoint válido, el envío se hace por HTTPS desde el formulario, sin salir de la página.
- La preferencia de contacto siempre se incluye. El número es obligatorio solo para WhatsApp.
- No hay éxito simulado: se confirma únicamente si Formspree devuelve una respuesta satisfactoria explícita.
- Mientras se envía, se bloquean edición y envíos duplicados. Si falla, se conservan datos y se ofrecen los enlaces de respaldo.
- Los tests con respuestas simuladas no equivalen a validar recepción real.
