# Guía de Conexión a Supabase e Inserción de Imágenes

Esta guía detalla los pasos exactos para configurar tu base de datos de **Supabase** y gestionar tus **Imágenes** con éxito en tu ecosistema BASSSE.

---

## 1. Conexión y Configuración de Supabase

Hemos configurado tu aplicación para enviar el briefing interactivo directamente a la tabla `proposals` de tu proyecto Supabase (`oxriwlpjxdikdgpejnxk`).

### Paso 1: Crear la Tabla en Supabase
Entra en tu [Panel de Supabase](https://supabase.com), navega al apartado **SQL Editor**, crea una nueva consulta e introduce el siguiente script para habilitar la tabla con soporte de Seguridad de Fila (RLS) que admita inserciones públicas:

```sql
-- 1. Crear la tabla de propuestas (leads)
create table proposals (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  needs text[] default '{}'::text[],
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Habilitar la seguridad a nivel de fila (RLS)
alter table proposals enable row level security;

-- 3. Crear una política que permita a cualquiera insertar propuestas (clientes que envían el formulario)
create policy "Permitir inserciones públicas"
on proposals for insert
with check (true);

-- 4. Crear una política para que puedas ver las propuestas de entrada (reemplaza si tienes usuarios autenticados)
create policy "Permitir lectura para el administrador"
on proposals for select
using (true); 
```

### Paso 2: Validación en Tiempo Real
Una vez creada la tabla, cada vez que un usuario complete la sección de **"Solicitar Propuesta Express"** en la web, los datos se registrarán inmediatamente en tu base de datos listos para que los gestiones.

---

## 2. Configura tu Tabla de Proyectos Dinámicos (`projects`)

Hemos implementado un custom React Hook (`useProjects.ts`) que consulta la tabla `'projects'` en tu Supabase. Si la tabla no está creada o está vacía, la web seguirá funcionando recuperando las imágenes de tu portfolio offline de manera segura.

### Paso 1: Crea la tabla `projects` en tu panel SQL de Supabase
Entra en el editor SQL de tu panel de Supabase y ejecuta el siguiente script para crear la tabla y configurar las consultas públicas ilimitadas:

```sql
-- 1. Crear la tabla de proyectos
create table projects (
  id text primary key,
  name text not null,
  branch text not null,
  "branchLabel" text not null,
  type text not null,
  category text not null,
  year text not null,
  description text not null,
  "detailedDescription" text,
  image text not null,
  tags text[] default '{}'::text[],
  link text,
  metrics jsonb default '[]'::jsonb,
  "accentColor" text
);

-- 2. Habilitar la seguridad RLS (Row Level Security)
alter table projects enable row level security;

-- 3. Permitir lectura pública de los proyectos para que funcionen en la web
create policy "Lectura pública de proyectos"
on projects for select
using (true);

-- 4. Permitir inserción y edición (puedes limitarla a administradores en el futuro)
create policy "Gestión integral para administrador"
on projects for all
using (true)
with check (true);
```

### Paso 2: Inserta el Portfolio de Inicio en tu base de datos
Para migrar el portfolio de base de forma automática, puedes ejecutar este script SQL de inserción en tu panel:

```sql
insert into projects (id, name, branch, "branchLabel", type, category, year, description, "detailedDescription", image, tags, link, metrics, "accentColor")
values
(
  'dskonnect-web', 'dskonnect.com', 'web', '01 — Web', 'CLIENTE BASSSE', 'WEB · MUSIC INDUSTRY', '2025',
  'Diseñé y desarrollé una web a medida para una de las agencias de contratación de DJs y artistas electrónicos más importantes de Europa. Apliqué un enfoque estratégico en rendimiento, indexación y usabilidad.',
  'Realicé el rediseño completo de la plataforma dskonnect.com. Redefiní la experiencia de navegación para promotores de todo el mundo, integrando un catálogo interactivo de artistas que optimicé para carga ultra rápida.',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
  array['DISEÑO WEB', 'DIRECCIÓN VISUAL', 'ARQUITECTURA DE CONTENIDOS', 'CONVERSIÓN', 'CULTURA MUSICAL'],
  'https://dskonnect.com',
  '[{"label":"Carga Web","value":"0.8s"},{"label":"Booking Leads","value":"+45%"}]'::jsonb,
  '#0052FF'
),
(
  'technoexperience-web', 'technoexperience.es', 'web', '01 — Web', 'PROYECTO PROPIO', 'WEB · EDITORIAL · TECHNO CULTURE', '2026',
  'Diseñé y desarrollé mi propia plataforma líder en divulgación de la cultura de club internacional. Es un portal editorial de alto tráfico con un claro enfoque en mi estrategia de conversión de entradas.',
  'Creé desde cero la web technoexperience.es, combinando una revista digital con agendas dinámicas de festivales y clubes. Optimicé personalmente el embudo de recomendación, el CMS editorial y el posicionamiento orgánico.',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop',
  array['WEBSITE', 'DIRECCIÓN CREATIVA', 'CMS EDITORIAL', 'SEO AGRESIVO', 'RENTABILIDAD', 'CLUBBING'],
  'https://technoexperience.es',
  '[{"label":"Visitas Mensuales","value":"80K+"},{"label":"Tráfico Orgánico","value":"72%"}]'::jsonb,
  '#0052FF'
),
(
  'dskonnect-bookings-branding', 'Dskonnect Bookings', 'branding', '02 — Branding', 'CLIENTE BASSSE', 'BRANDING · MUSIC INDUSTRY', '2025',
  'Construí y refiné la identidad gráfica para la rama internacional de contratación de artistas. Desarrollé una estética modular, futurista e imperecedera.',
  'Desarrollé un sistema visual cohesivo que equilibra la sobriedad corporativa de una gran agencia con la rebeldía estética de la música de vanguardia. Diseñé logotipos responsivos, paletas cromáticas neutras de alto impacto.',
  'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200&auto=format&fit=crop',
  array['IDENTIDAD VISUAL', 'LOGOTIPO', 'DIRECCIÓN CREATIVA', 'SISTEMA MODULAR', 'NARRATIVA DE MARCA'],
  null,
  '[{"label":"Formatos Diseñados","value":"40+"},{"label":"Coherencia de Marca","value":"100%"}]'::jsonb,
  '#0052FF'
);
```

---

## 3. Cómo Insertar y Gestionar Imágenes del Portfolio

Tienes tres métodos óptimos para añadir tus propias imágenes al sitio web:

### Método A: Usar enlaces (URLs) externos (Recomendado y más rápido)
Puedes guardar la imagen en cualquier servidor externo (Imgur, Unsplash, Pinterest, Cloudinary o el propio **Supabase Storage**) y reemplazar el enlace correspondiente en `src/data.ts`.

Por ejemplo, busca la propiedad `image` en el archivo `src/data.ts` y sustitúyela así:
```typescript
{
  id: 'dskonnect-web',
  name: 'dskonnect.com',
  // ...
  image: 'https://tu-host.com/ruta-de-tu-imagen.jpg', 
}
```

### Método B: Usar la carpeta pública del proyecto (`public/`)
Si quieres almacenar las imágenes directamente dentro del código de tu página:
1. Crea una carpeta llamada `public` en la raíz del proyecto (si no existe).
2. Coloca tus archivos de imagen allí (por ejemplo: `proyecto-dskonnect.png`).
3. En tu archivo `src/data.ts`, utiliza una ruta absoluta que comience con `/`:
   ```typescript
   image: '/proyecto-dskonnect.png',
   ```

### Método C: Cargar imágenes mediante Supabase Storage
Puedes subir fotos directamente a tu bucket de almacenamiento de Supabase y enlazarlas como URLs públicas:
1. En tu panel de Supabase, ve a **Storage** y crea un Bucket llamado `portfolio` con acceso **Público**.
2. Sube tus mockups o imágenes.
3. Copia el **enlace público** proporcionado (Get Public URL) y pégalo directamente en la propiedad `image` de tu archivo `src/data.ts`.

---

## 4. Soporte directo para tu CSV de Framer CMS (Importación Directa)

Para tu máxima comodidad, el hook `useProjects.ts` reconoce automáticamente los nombres exactos de las columnas de tu exportación de Framer (`Slug`, `Title`, `Category`, `Year`, `Featured Image`, `Description`, `Bloque`, y `Casos`).

Si deseas importar tu archivo CSV directamente sin adaptarlo, puedes crear la tabla en Supabase ejecutando esta estructura SQL:

```sql
create table projects (
  "Slug" text primary key,
  "Title" text not null,
  "Category" text,
  "Year" text,
  "Description" text,
  "Featured Image" text,
  "Link" text,
  "Bloque" text,
  "Casos" text,
  "Client" text,
  "Draft" text
);

-- Habilitar RLS y lectura para visualizar en la web
alter table projects enable row level security;

create policy "Permitir lectura para todos" on projects
  for select using (true);
```

¡Una vez creada esta tabla, podrás utilizar el importador de Supabase ("Import data via CSV") para subir tu archivo CSV directamente! La web se actualizará al instante leyendo los nuevos proyectos dinámicamente.
