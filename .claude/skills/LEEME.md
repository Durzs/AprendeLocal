# Skills de video

De donde salen y por que estan aca.

Diego pidio instalar `wilwaldon/Claude-Code-Video-Toolkit`. Ese repositorio no
es una skill: es un README, una lista de herramientas de video para Claude
Code, sin nada instalable. La lista apunta al toolkit que si existe y se llama
igual, `digitalsamba/claude-code-video-toolkit` (MIT), y de ahi salen estas
cinco skills y el comando `/record-demo`.

## Que quedo instalado

| Skill | Para que sirve | Necesita |
|---|---|---|
| `remotion-official` | Remotion completo: hooks, animacion, render | Node |
| `remotion` | Los agregados del toolkit sobre Remotion | Node |
| `ffmpeg` | Convertir, recortar, comprimir, sacar audio | ffmpeg |
| `playwright-recording` | Grabar el navegador en video | Playwright |
| `moviepy` | Composicion de video en Python | Python |

El comando `/record-demo` graba una demostracion del sitio con Playwright.

Para AprendeLocal el par que sirve de inmediato es `playwright-recording` mas
`ffmpeg`: graban la plataforma andando y dejan el archivo liviano para
mandarselo a un socio.

## Que quedo fuera, y por que

El toolkit trae ocho skills mas: `elevenlabs`, `ideogram4`, `qwen-edit`,
`ltx2`, `acestep`, `runpod`, `frontend-design` y el comando `/video`. Todas
menos la penultima piden cuenta y clave de un servicio pagado (voz sintetica,
generacion de imagen, GPU en la nube). No se instalaron porque sin esas claves
no hacen nada, y cada skill instalada ocupa lugar en el contexto de todas las
sesiones futuras del repositorio.

Si alguna vez se contrata uno de esos servicios, la skill se copia desde
`digitalsamba/claude-code-video-toolkit` y listo. La clave va en las variables
del entorno, nunca en el repositorio.

## Licencia

MIT, de Digital Samba. El texto completo esta en
`LICENCIA-video-toolkit.txt`.
