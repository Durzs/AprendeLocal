# El demo del stand

`/congreso` es una versión corta del cuaderno para mostrar en un stand: quien
pasa arma una ruta en cuatro pasos, sin cuenta, y al final deja su correo y se
lleva su número para el sorteo del cierre. `/demo` lleva al mismo lugar.

Todo lo que muestra sale del mismo catálogo que usa el cuaderno: las
problemáticas con sus noticias verificadas, los ángulos por asignatura, los
objetivos de las Bases Curriculares y las técnicas de terreno. El demo solo
agrega el énfasis para un congreso de educación para el desarrollo sostenible:
los ODS de cada problemática, qué asignaturas son STEM, y las especies que
iNaturalist tiene registradas en el lugar elegido.

Es de la edición chilena. Un navegador en portugués también la ve en Chile.

## Los pasos

1. **La problemática.** Las once del catálogo chileno, con sus ODS. Al elegir
   una aparece abajo la noticia con que empieza la clase.
2. **Las asignaturas.** Hasta tres. A la derecha, cuántas son STEM y cuántos
   Objetivos de Aprendizaje abre la ruta, agrupados por asignatura.
3. **El lugar.** Seis lugares de ejemplo o «Aquí, donde estoy». Muestra las
   especies más observadas a 5 km según iNaturalist, con foto y autoría.
4. **Tu ruta.** Las seis etapas, cada una con lo concreto de esta ruta: la
   noticia, los conceptos y técnicas, el lugar y las especies para buscar, y
   qué hallazgo sale del análisis.
5. **El sorteo.** El correo, el número, el QR para abrir la ruta en el
   teléfono, y lo que trae el cuaderno con una cuenta.

## La tablet del stand

Abrir **`https://www.aprendelocal.com/congreso?kiosco`** y tocar el botón de
pantalla completa (arriba a la derecha). En modo kiosco:

- No hay cabecera del sitio: nadie se va a otra página por accidente.
- Si nadie toca la pantalla en 90 segundos, pregunta «¿Sigues ahí?» y a los 15
  segundos vuelve al inicio, borrando la ruta y el correo de la persona
  anterior.
- Al abrirse, con señal, deja guardadas las especies de los seis lugares de
  ejemplo. Si después se cae el wifi, esos lugares siguen mostrando lo de
  iNaturalist. Un lugar sin guardar muestra especies nativas que el sitio ya
  trae, y lo dice.
- Si se cae el wifi justo al pedir el número, el pedido queda en la tablet y
  sale solo cuando vuelve la conexión (se reintenta cada minuto). La persona
  ve que su correo llegará con el número.
- Los enlaces a iNaturalist no se abren, para no sacar a nadie del demo.

**No iniciar sesión en la tablet.** Con una cuenta abierta, quien pase podría
ver o tocar sus datos. Para crear cuenta está el QR, que abre la ruta en el
teléfono de cada persona con el botón «Crear mi cuenta».

## El número y el sorteo

El número es **uno por persona**: si la misma persona arma otra ruta con el
mismo correo, recibe la ruta nueva con el mismo número. La pantalla se lo
dice. Así nadie suma chances armando rutas de más.

Cada ruta queda en la tabla `rutas_demo` de Supabase. Para sortear, en el
editor SQL:

```sql
select numero, correo, creada
from public.rutas_demo
where evento = 'congreso'
order by random()
limit 1;
```

Para ver cuántas se armaron y cuántos correos salieron:

```sql
select count(*) as personas,
       count(*) filter (where enviado) as correos_enviados,
       count(*) filter (where not enviado) as por_revisar
from public.rutas_demo
where evento = 'congreso';
```

Las que tengan `enviado = false` tienen el motivo en `error_envio`. Esas
personas tienen su número igual: hay que mandarles el correo a mano.

Las cuentas que se abran desde el demo quedan marcadas con `origen: congreso`
en sus metadatos.

**Después del congreso**, poner `HAY_SORTEO = false` en
`src/frontend/src/modules/congreso/ruta.ts`. El demo sigue funcionando y el
número queda como número de la ruta, sin hablar de sorteo.

## Lo que hay que configurar una vez

El correo lo manda la función `enviar-ruta` de Supabase con
[Resend](https://resend.com), que es el proveedor que ya figura en
`docs/COSTES.md`. Sin esto el demo funciona igual y guarda los números, pero
no salen los correos.

1. **La tabla.** Aplicar la migración `supabase/migrations/0008_rutas_demo.sql`.
2. **El dominio en Resend.** Verificar `aprendelocal.com` en Resend (registros
   DNS). Sin dominio verificado Resend solo deja escribirse a uno mismo.
3. **Los secretos** (Supabase → Edge Functions → Secrets). Ojo: van en
   Supabase, no en Vercel ni en los secretos de GitHub, que la función no ve.
   Nunca en el repositorio ni en variables `VITE_*`:
   - `RESEND_API_KEY`: la clave de Resend.
   - `CORREO_REMITENTE` (opcional): por defecto `AprendeLocal <hola@aprendelocal.com>`.
   - La función también reconoce `RESEND_KEY` para la clave y `RESEND_FROM`
     o `EMAIL_FROM` para el remitente.
   - Opcionales: `CORREO_COPIA` (por defecto `aprendelocal@gmail.com`),
     `SITIO_URL` (por defecto `https://www.aprendelocal.com`) y `HASH_SAL`.
   - **Sin acceso al DNS: el respaldo por Gmail.** Si el dominio no se puede
     verificar a tiempo, la función manda por SMTP desde la casilla del
     equipo. En la cuenta de Google de `aprendelocal@gmail.com`, con la
     verificación en dos pasos activada, crear una contraseña de aplicación
     en <https://myaccount.google.com/apppasswords> y cargar dos secretos:
     `SMTP_USER` = `aprendelocal@gmail.com` y `SMTP_PASS` = la contraseña de
     16 letras (con o sin espacios). La función intenta Resend primero y, si
     falla, Gmail; cuando el dominio quede verificado vuelve sola a Resend.
     Gmail deja unos 500 destinatarios al día, y cada correo cuenta dos (la
     persona y la copia al equipo). Otra casilla sirve igual con `SMTP_HOST`
     (por ejemplo `mail.privateemail.com`); el puerto es 465, porque Supabase
     no deja salir por el 587.
4. **La función** se despliega sola al fusionar en `main`, con el flujo
   `.github/workflows/desplegar-funciones.yml`, que al final comprueba que
   responde. Si hace falta a mano: `supabase functions deploy enviar-ruta
   --no-verify-jwt`.
5. **Probar** con un correo propio desde `/congreso` antes del día.

Si un correo no sale, la columna `error_envio` de `rutas_demo` dice por qué
(por ejemplo, «falta RESEND_API_KEY o SMTP_USER y SMTP_PASS… (la función no
ve ningún secreto de correo)», o el error que devolvió Resend o Gmail). Cuando un correo sí sale, la
función reintenta sola, de a cinco, los que habían quedado pendientes: no hay
que pedirle a nadie que vuelva a inscribirse.

Mientras falte algo de esto, el demo no pierde a nadie: si la función no está
desplegada o la tabla no existe, el pedido queda en la fila de la tablet y se
reintenta cada minuto; si faltan los secretos de Resend, la persona recibe su
número en pantalla y queda en la tabla con `enviado = false`.

**La cuota.** La función deja de enviar después de 90 correos en 24 horas, para
no agotar la cuota del plan gratuito de Resend en medio del congreso. Las
personas siguen recibiendo su número en pantalla y quedan en la tabla. Si se
esperan más visitas, subir el plan de Resend y el valor `TOPE_DIARIO` en la
función.

## Por qué el correo lo escribe el servidor

Un formulario público que manda correos es, si se descuida, un servicio de
spam gratuito con nuestro remitente. El navegador manda solo identificadores
(problemática, asignaturas, lugar); el texto sale de `catalogo.json`, que se
genera desde los archivos del sitio con `node scripts/catalogo-correo.mjs`. El
build falla si ese JSON quedó viejo. Además hay un campo trampa para robots y
límites por conexión y por persona.

## Dónde está cada cosa

| Qué | Dónde |
|---|---|
| La página y el modo kiosco | `src/frontend/src/modules/congreso/CongresoPage.tsx` |
| Las cinco pantallas | `modules/congreso/Pasos.tsx` |
| ODS por problemática, qué es STEM, colores | `modules/congreso/ods.ts` |
| Lugares de ejemplo | `modules/congreso/lugares.ts` |
| iNaturalist y el respaldo sin red | `modules/congreso/especies.ts` |
| Enlace, paso al cuaderno, correo y fila | `modules/congreso/ruta.ts` |
| La función del correo | `supabase/functions/enviar-ruta/` |
| La tabla | `supabase/migrations/0008_rutas_demo.sql` |
