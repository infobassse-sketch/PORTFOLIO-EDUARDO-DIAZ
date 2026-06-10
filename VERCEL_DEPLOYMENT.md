# Guía de Despliegue en Vercel — Ecosistema BASSSE

Hemos configurado y optimizado con éxito el repositorio de BASSSE para ser completamente compatible con la infraestructura de **Vercel** (`prj_F0a0wK94TEJMzRXqTPEM0i6VYdyE`) utilizando un enfoque híbrido de alto rendimiento.

---

## 1. Arquitectura de Despliegue Híbrida

Para garantizar velocidades de carga instantáneas (LCP óptimo para SEO) y mantener la operatividad de nuestra API comercial, el despliegue se divide automáticamente de la siguiente manera:

1. **Frontend (Vite + React + Tailwind v4 + Motion)**:
   Se compila estáticamente y se sirve a través de la Red Global Edge de Vercel (CDN). Carga ultra rápida, sin latencia ni servidores intermedios para renderizar el portfolio.
2. **Backend API (Express.js)**:
   Se ejecuta bajo demanda mediante **Vercel Serverless Functions** (`/api`), respondiendo de forma instantánea a las llamadas de consulta, creación de propuestas (`proposals`) e insignias de estado de salud del sistema, sin coste de servidores levantados 24/7.

---

## 2. Archivos Añadidos a la Raíz

Para lograr la integración nativa y transparente, hemos creado y configurado los siguientes archivos en la raíz del proyecto:

* **`vercel.json`**: El archivo de control de enrutamiento que define:
  * El mapeo de todas las rutas `/api/*` hacia nuestra Serverless Function central.
  * El enrutamiento de caída (fallback/rewrite) para que React Router (`index.html`) gestione las rutas virtuales del sitio de forma limpia en el navegador.
* **`api/index.ts`**: El punto de entrada serverless que importa e inicializa la aplicación Express de BASSSE de manera controlada y sin colisiones de puertos de enlace en producción.

---

## 3. Instrucciones de Configuración y Desposicionamiento en Vercel

Sigue estos sencillos pasos en tu Panel de Control de Vercel para conectar el proyecto `prj_F0a0wK94TEJMzRXqTPEM0i6VYdyE` a tu repositorio de GitHub:

### Paso 1: Vincula tu Repositorio de GitHub
1. Dirígete a tu [Panel de Control de Vercel](https://vercel.com/dashboard).
2. Selecciona tu proyecto o haz clic en **"Add New"** > **"Project"**.
3. Importa tu repositorio de GitHub: `https://github.com/infobassse-sketch/PORTFOLIO.git`.
4. El proyecto de Vercel está identificado internamente con el ID: `prj_F0a0wK94TEJMzRXqTPEM0i6VYdyE`.

### Paso 2: Configura los Ajustes de Construcción (Build Settings)
Vercel detectará automáticamente que es un proyecto de **Vite**. Asegúrate de verificar los siguientes parámetros en la pestaña "Build & Development Settings":
* **Framework Preset**: `Vite` (o `Other` si deseas control manual).
* **Build Command**: `npm run build` o `vite build`
* **Output Directory**: `dist`

### Paso 3: Define las Variables de Entorno (Environment Variables)
Agrega las siguientes variables en la sección **Environment Variables** de tu proyecto en Vercel para conectar persistencia de datos (Supabase):

| Nombre de la Variable | Valor Sugerido | Descripción |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | *Tu URL de Proyecto de Supabase* | Permite realizar la consulta directa al portfolio dinámico desde el cliente. |
| `VITE_SUPABASE_ANON_KEY` | *Tu Clave Pública de Supabase (anon public)*| Clave segura para interactuar con la API de Supabase de lectura/escritura pública. |

*(Nota: Estas claves deben coincidir con tu configuración en Supabase detallada en la guía `SUPABASE_Y_IMAGENES.md`)*.

---

## 4. Desplegar y Validar el Ecosistema

1. Una vez guardadas las variables de entorno, haz clic en **Deploy**.
2. Cada vez que realices un `git push` a la rama `main` en tu repositorio `PORTFOLIO.git`, Vercel compilará y actualizará el portfolio web en menos de 30 segundos de forma automatizada.
3. Puedes constatar el funcionamiento del backend accediendo a los siguientes endpoints virtuales en tu URL de producción en Vercel:
   * `https://tu-dominio.vercel.app/api/health` (Estado de salud del sistema, estadísticas de memoria y registros de Supabase).
   * `https://tu-dominio.vercel.app/api/projects` (Descarga directa del catálogo de portfolio actual).

---

¡Tu ecosistema BASSSE está completamente blindado y listo para brillar en producción con estándares de rendimiento y fiabilidad del máximo nivel industrial!
