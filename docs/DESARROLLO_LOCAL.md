# Correr el proyecto en local

## Lo más rápido: solo la interfaz

Si lo que quieres es ver cómo va quedando el diseño, **no necesitas nada más que
esto**. Ni claves, ni base de datos, ni backend:

```bash
cd src/frontend
npm ci
npm run dev
```

Abre <http://localhost:5173/preparar>.

`npm run dev` activa el **modo de demostración**: los objetivos de aprendizaje,
los lugares y la secuencia son datos de ejemplo. La pantalla lo dice con un
aviso ámbar permanente, para que nadie confunda esto con un entorno
funcionando.

Verás también un segundo aviso abajo a la izquierda si faltan las variables de
Supabase. En desarrollo la aplicación arranca igual —de otro modo no se podría
ni mirar la interfaz sin credenciales— pero la sesión y los cursos no
funcionarán. En producción, en cambio, faltar esas variables sigue bloqueando
el arranque con la pantalla de configuración: ahí callarlo era lo que dejaba el
sitio en blanco.

> El modo de demostración **nunca** se activa en un build de producción normal,
> y **nunca** actúa como respaldo silencioso si la API falla. Enmascarar un
> fallo escondería justo lo que hay que ver. Para forzarlo en un build, hay que
> poner `VITE_DEMO=1` a propósito.

## Con datos reales

Necesitas un `.env.local` dentro de `src/frontend`:

```bash
VITE_SUPABASE_URL=https://<ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<la clave anon, nunca la service_role>
VITE_API_URL=http://127.0.0.1:8000
```

Con `VITE_SUPABASE_*` definidas desaparece el aviso de abajo y funcionan sesión
y cursos. El modo de demostración sigue activo mientras uses `npm run dev`.

## Con el backend también

En otra terminal, desde la raíz del repositorio:

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements-api.txt
uvicorn src.api.main:app --reload --port 8000
```

Necesita su propio `.env` en la raíz con `SUPABASE_URL`, `SUPABASE_KEY` y
`ANTHROPIC_API_KEY`. Sin esta última, `/health` responde `"generator": "no_key"`
y los endpoints de generación devuelven 503.

Para que la interfaz llame a esta API en vez de usar los datos de ejemplo,
compila en modo producción apuntando al backend local:

```bash
cd src/frontend
VITE_API_URL=http://127.0.0.1:8000 npm run build && npm run preview
```

## Pruebas

```bash
# Lógica de secuencias — no necesita red ni claves
python -m pytest tests/ -q

# La interfaz compila y tipa
cd src/frontend && npm run build
```
