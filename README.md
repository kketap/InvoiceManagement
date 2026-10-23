# Invoice Management

Aplicación para la gestión de facturas.

El sistema permite importar facturas desde un archivo JSON ya definido en el backend, persistir la información en una base de datos SQLite, consultar y administrar facturas, registrar notas de crédito, calcular automáticamente estados de factura y pago, y visualizar reportes y métricas mediante una interfaz web.

---

## Objetivo

Implementar un sistema web para gestionar facturas a partir de información proporcionada mediante un archivo JSON.

La solución contempla:

- Importación y persistencia de facturas.
- Validación de consistencia de los montos.
- Cálculo automático del estado de factura.
- Cálculo automático del estado de pago.
- Búsqueda y filtrado de facturas.
- Registro de notas de crédito.
- Reportes.
- Dashboard de indicadores.
- Interfaz responsive para escritorio, tablet y móvil.

---

# Tecnologías utilizadas

## Backend

- .NET 8
- ASP.NET Core Web API
- Entity Framework Core
- SQLite
- Swagger

## Frontend

- React
- TypeScript
- Vite
- Ant Design
- Tailwind CSS
- React Router DOM
- Recharts
- Lucide React

## Base de datos

- SQLite
- Entity Framework Core Migrations
- Vista SQL para búsqueda de facturas

---

# Estructura del proyecto

```
InvoiceManagement/
│
├── backend/
│   └── InvoiceManagement.Api/
│       │
│       ├── Controllers/
│       ├── Data/
│       │   └── Views/
│       ├── DataFiles/
│       ├── Domain/
│       ├── DTO/
│       ├── Exceptions/
│       ├── Middleware/
│       ├── Migrations/
│       ├── Services/
│       ├── Properties/
│       │
│       ├── Program.cs
│       └── InvoiceManagement.Api.csproj
│
├── frontend/
│   └── invoice-management-web/
│       │
│       ├── src/
│       │   ├── api/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── types/
│       │   └── ...
│       │
│       ├── package.json
│       └── vite.config.ts
│
├── .gitignore
├── InvoiceManagement.sln
└── README.md
```

---

# Arquitectura y patrón de diseño

La aplicación utiliza una separación por capas y responsabilidades.

## Backend

El backend se divide principalmente en:

### Controllers

Responsables de recibir solicitudes HTTP, validar los parámetros básicos de entrada y retornar las respuestas correspondientes.

### Services

Contienen la lógica de negocio de la aplicación.

### Data

Contiene la configuración de Entity Framework Core, acceso a datos y definición de vistas SQL.

### Domain

Contiene las entidades principales del dominio.

### DTO

Contiene los tipos de datos utilizados para solicitudes y respuestas de la API.

### Exceptions

Contiene excepciones específicas utilizadas para representar errores de validación, datos inexistentes y reglas de negocio.

### Middleware

Se utiliza middleware global para centralizar el tratamiento de errores y devolver respuestas HTTP consistentes.

---

## Frontend

El frontend utiliza una arquitectura basada en componentes.

```
src/
├── api/
├── components/
├── pages/
├── types/
└── ...
```

### pages

Contiene las vistas principales del sistema.

### components

Contiene componentes reutilizables como:

- Tablas.
- Filtros.
- Métricas.
- Modales.
- Navbar.
- Estados visuales.

### api

Centraliza las llamadas HTTP al backend.

### types

Contiene los tipos de datos utilizados por el frontend.

---

# Funcionalidades implementadas

## 1. Importación de facturas

El sistema utiliza el archivo JSON base incluido en el backend.

La importación puede ejecutarse desde:

```http
POST /api/import/invoices
```

También puede ejecutarse desde el módulo:

Importar datos del frontend.

Durante la importación se realizan las siguientes validaciones:

- invoice_number debe ser único.
- Se calcula la suma de los subtotales de los productos.
- Se compara esa suma con total_amount.
- Se identifican automáticamente las facturas inconsistentes.
- Las facturas inconsistentes se almacenan en la base de datos.
- Las facturas inconsistentes se excluyen del sistema activo.
- Los registros previamente importados se omiten para evitar duplicados.

---

# Facturas inconsistentes

Una factura se considera inconsistente cuando:

total_amount != suma de subtotales de productos

Estas facturas:

- Permanecen almacenadas en SQLite.
- No aparecen en el sistema activo de facturas.
- Sí aparecen en el reporte de inconsistencias.

Con el archivo proporcionado para el ejercicio se detectan:

2 facturas inconsistentes

Entonces son:

50 facturas procesadas
48 facturas activas y consistentes
2 facturas inconsistentes

---

# Estado de factura

El estado se calcula automáticamente en función de las notas de crédito.

## Issued

Factura sin notas de crédito.

Total NC = 0

## Partial

La suma de las notas de crédito es inferior al total de la factura.

0 < Total NC < Total factura

## Cancelled

La suma de las notas de crédito es igual al total de la factura.

Total NC = Total factura

El estado no depende del valor almacenado originalmente en el archivo JSON, sino que se recalcula utilizando las reglas de negocio.

---

# Estado de pago

El estado de pago también se determina automáticamente.

## Paid

Existe una fecha de pago registrada.

payment_date != null

## Pending

La factura no tiene pago y aún se encuentra dentro del plazo.

payment_due_date >= fecha actual

## Overdue

La factura no tiene pago y su fecha de vencimiento ya fue superada.

payment_due_date < fecha actual

---

# Búsqueda de facturas

El sistema permite buscar y filtrar facturas por:

- Número de factura.
- Estado de factura.
- Estado de pago.

Ejemplos:

```http
GET /api/invoices?invoiceNumber=10
```

```http
GET /api/invoices?invoiceStatus=Issued
```

```http
GET /api/invoices?paymentStatus=Overdue
```

También es posible combinar filtros:

```http
GET /api/invoices?invoiceStatus=Issued&paymentStatus=Overdue
```

---

# Vista SQL

Para apoyar la búsqueda de facturas se utiliza una vista de base de datos:

vw_invoice_search

La vista relaciona los datos principales de:

- Facturas.
- Clientes.
- Estado de factura.
- Información necesaria para realizar búsquedas.

Su creación se encuentra incluida en las migraciones de Entity Framework Core.

---

# Gestión de notas de crédito

El sistema permite registrar una nueva nota de crédito mediante:

```http
POST /api/invoices/{id}/credit-notes
```

Ejemplo:

```json
{
  "creditNoteNumber": 1001,
  "amount": 50000
}
```

Se aplican las siguientes validaciones:

- La factura debe existir.
- La factura debe ser consistente.
- El número de nota de crédito no puede estar duplicado.
- El monto debe ser mayor a cero.
- La factura debe mantener saldo pendiente.
- El monto no puede superar el saldo pendiente.
- La fecha de creación se asigna automáticamente.
- Después de crear la nota se recalcula el estado de la factura.

---

# Reportes

## Facturas vencidas por más de 30 días

Endpoint:

```http
GET /api/reports/overdue
```

Incluye únicamente facturas:

- Consistentes.
- Con más de 30 días de atraso.
- Sin pago registrado.
- Sin notas de crédito.

---

## Resumen por estado de pago

Endpoint:

```http
GET /api/reports/payment-summary
```

Entrega:

- Total de facturas.
- Cantidad de facturas pagadas.
- Cantidad de facturas pendientes.
- Cantidad de facturas vencidas.
- Porcentaje correspondiente a cada estado.

Estados:

Paid
Pending
Overdue

---

## Facturas inconsistentes

Endpoint:

```http
GET /api/reports/inconsistent
```

Entrega información como:

- Número de factura.
- Cliente.
- Total declarado.
- Total calculado desde los productos.
- Diferencia detectada.

---

# Dashboard

El frontend incluye un dashboard general construido utilizando la información disponible desde la API.

Presenta:

- Total de facturas activas.
- Facturas pagadas.
- Facturas vencidas.
- Facturas inconsistentes.
- Resumen financiero.
- Total facturado.
- Monto asociado a facturas pagadas.
- Saldo pendiente.
- Distribución por estado de pago.
- Facturas que requieren atención.
- Accesos rápidos a los principales módulos.

---

# Resumen financiero por año

El dashboard permite seleccionar:

Todos los años o un año específico.

Al seleccionar un año se actualizan:

- Total facturado.
- Total pagado.
- Saldo pendiente.
- Cantidad de facturas.

Cuando se seleccionan todos los años, se muestra un gráfico agrupado por año.

Cuando se selecciona un año específico, se muestra la distribución de facturas por mes.

---

# Frontend

La aplicación incluye los siguientes módulos principales:

- Dashboard
- Facturas
- Reportes
- Importar datos

---

## Dashboard

Muestra información general y financiera del sistema.

---

## Facturas

Permite:

- Visualizar facturas activas.
- Buscar facturas.
- Filtrar por estado.
- Filtrar por estado de pago.
- Ordenar columnas.
- Paginar resultados.
- Visualizar el detalle de una factura.
- Crear notas de crédito.

Las columnas numéricas y de fecha permiten ordenamiento ascendente y descendente.

---

## Detalle de factura

Permite revisar:

- Información general.
- Cliente.
- Productos.
- Total.
- Saldo pendiente.
- Fecha de vencimiento.
- Estado de factura.
- Estado de pago.
- Pago registrado.
- Notas de crédito.

---

## Reportes

Incluye:

- Resumen de estados de pago.
- Desglose de facturas por estado.
- Facturas vencidas por más de 30 días.
- Facturas inconsistentes.

Las tablas permiten ordenamiento por campos como:

- Número.
- Cliente.
- Fechas.
- Montos.
- Días vencidos.
- Diferencias.

---

## Importar datos

Permite ejecutar la importación del archivo JSON configurado en el backend.

Después del proceso se muestran:

- Registros procesados.
- Registros creados.
- Registros omitidos.
- Facturas inconsistentes.

---

# Diseño responsive

El frontend fue diseñado para adaptarse a diferentes tamaños de pantalla.

Se consideran:

- Escritorio.
- Notebook.
- Tablet.
- Móvil.

Se utilizó diseño responsive mediante Tailwind CSS.

Las tablas utilizan desplazamiento horizontal en pantallas pequeñas para mantener disponible toda la información.

La navegación cambia automáticamente entre:

### Desktop

Menú horizontal.

### Tablet y móvil

Menú de navegación compacto.

Los grids, tarjetas, gráficos, botones y formularios también modifican su distribución según el tamaño disponible.

---

# Requisitos previos

Antes de ejecutar el proyecto se recomienda tener instalado:

- .NET SDK 8
- Node.js
- npm
- Entity Framework Core CLI

Verificar .NET:

```bash
dotnet --version
```

Verificar Node.js:

```bash
node --version
```

Verificar npm:

```bash
npm --version
```

---

# Entity Framework CLI

Si `dotnet ef` no se encuentra instalado:

```bash
dotnet tool install --global dotnet-ef
```

Verificar:

```bash
dotnet ef --version
```

Instalar certificado de desarrollo HTTPS, para evitar visualizar errores de privacidad en el navegador 

```bash
dotnet dev-certs https --trust
```

---

# Instalación

## 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
```

Entrar al proyecto:

```bash
cd InvoiceManagement
```

---

# Backend

Entrar al proyecto:

```bash
cd backend/InvoiceManagement.Api
```

Restaurar dependencias:

```bash
dotnet restore
```

Compilar:

```bash
dotnet build
```

Aplicar migraciones:

```bash
dotnet ef database update
```

Ejecutar mediante el perfil HTTPS:

```bash
dotnet run --launch-profile https
```

La API queda disponible en:

```text
https://localhost:7272
```

También existe el perfil HTTP:

```text
http://localhost:5053
```

---

# Swagger

Con el backend ejecutándose, Swagger se encuentra disponible en:

```text
https://localhost:7272/swagger
```

---

# Base de datos

El sistema utiliza:

SQLite

La base de datos local corresponde a:

backend/InvoiceManagement.Api/invoices.db

La estructura se administra mediante:

Entity Framework Core Migrations

No es necesario crear manualmente las tablas.

---

# Crear la base de datos desde cero

Desde:

backend/InvoiceManagement.Api

ejecutar:

```bash
dotnet ef database update
```

Esto crea automáticamente:

- Tablas.
- Relaciones.
- Índices.
- Vista de búsqueda.

---

# Reiniciar completamente la base de datos

En PowerShell:

```powershell
Remove-Item .\invoices.db -ErrorAction SilentlyContinue
```

Luego:

```powershell
dotnet ef database update
```

Esto deja una base de datos vacía preparada para probar nuevamente la importación.

---

# Frontend

Abrir otra terminal.

Desde la raíz del repositorio:

```bash
cd frontend/invoice-management-web
```

Instalar dependencias:

```bash
npm install
```

---

# Variables de entorno

Crear un archivo:

.env

dentro de:

frontend/invoice-management-web

Agregar:

```env
VITE_API_URL=https://localhost:7272/api
```

---

# Ejecutar frontend

```bash
npm run dev
```

Vite mostrará la dirección local utilizada.

Normalmente:

```text
http://localhost:5173
```

---

# Primera ejecución

Con backend y frontend funcionando:

1. Abrir la aplicación web.
2. Ir a `Importar datos`.
3. Presionar `Importar facturas`.
4. Confirmar la operación.
5. Revisar el resultado.

En una base de datos vacía se espera:

```text
Procesadas:       50
Creadas:          50
Omitidas:          0
Inconsistentes:    2
```

Después de la importación:

```text
Facturas persistidas:    50
Facturas activas:         48
Facturas inconsistentes:   2
```

---

# Reimportación

La importación fue diseñada para evitar duplicados.

Si se ejecuta nuevamente sobre la misma base:

```text
Procesadas:       50
Creadas:           0
Omitidas:         50
Inconsistentes:    2
```

---

# Endpoints principales

## Importación

```http
POST /api/import/invoices
```

---

## Facturas

Obtener facturas:

```http
GET /api/invoices
```

Obtener una factura por ID:

```http
GET /api/invoices/{id}
```

---

## Filtros

Por número:

```http
GET /api/invoices?invoiceNumber=10
```

Por estado:

```http
GET /api/invoices?invoiceStatus=Issued
```

Por estado de pago:

```http
GET /api/invoices?paymentStatus=Overdue
```

---

## Notas de crédito

```http
POST /api/invoices/{id}/credit-notes
```

---

## Reportes

```http
GET /api/reports/payment-summary
```

```http
GET /api/reports/overdue
```

```http
GET /api/reports/inconsistent
```

---

# Códigos HTTP

La API utiliza códigos HTTP acordes al resultado de las operaciones.

## 200 OK

Consulta ejecutada correctamente.

## 201 Created

Recurso creado correctamente.

Ejemplo:

```text
Nota de crédito
```

## 400 Bad Request

La solicitud contiene datos inválidos.

Ejemplos:

- Monto igual o inferior a cero.
- Datos obligatorios incorrectos.

## 404 Not Found

El recurso solicitado no existe.

Ejemplo:

```text
Factura no encontrada
```

## 409 Conflict

La operación entra en conflicto con una regla de negocio.

Ejemplos:

- Nota de crédito superior al saldo pendiente.
- Número de nota de crédito duplicado.
- Factura sin saldo disponible.

## 500 Internal Server Error

Error inesperado del servidor.

El detalle interno del error no se expone directamente al cliente.

---

# Manejo de errores

El backend utiliza un middleware global para centralizar el tratamiento de excepciones.

Se utilizan excepciones específicas para distintos escenarios:

```text
NotFoundException
RequestValidationException
BusinessRuleException
```

Esto permite devolver respuestas HTTP consistentes.

---

# Validaciones principales

La aplicación contempla, entre otras, las siguientes validaciones:

- Factura existente.
- Número de factura único.
- Consistencia entre total declarado y productos.
- Nota de crédito con monto mayor a cero.
- Nota de crédito no superior al saldo pendiente.
- Número de nota de crédito no duplicado.
- Factura con saldo disponible.
- Factura consistente antes de permitir operaciones.
- Estados calculados automáticamente.

---

# Flujo recomendado para evaluar la aplicación

## 1. Limpiar base de datos

```powershell
cd backend\InvoiceManagement.Api

Remove-Item .\invoices.db -ErrorAction SilentlyContinue
```

## 2. Aplicar migraciones

```bash
dotnet ef database update
```

## 3. Ejecutar backend

```bash
dotnet run --launch-profile https
```

## 4. Ejecutar frontend

```bash
cd frontend/invoice-management-web
npm install
npm run dev
```

## 5. Importar datos

Desde el frontend:

```text
Importar datos -> Importar facturas
```

Resultado esperado:

```text
50 procesadas
50 creadas
2 inconsistentes
```

## 6. Revisar Facturas

Resultado esperado:

```text
48 facturas activas
```

## 7. Probar filtros

Probar:

- Número.
- Estado de factura.
- Estado de pago.

## 8. Revisar una factura

Abrir el detalle mediante el botón de visualización (el icon de ojo).

## 9. Crear nota de crédito

Seleccionar una factura con saldo pendiente y registrar una nueva nota de crédito.

Comprobar:

- Nuevo saldo.
- Nuevo estado de factura.
- Registro de la nota.

## 10. Revisar reportes

Validar:

- Resumen por estado de pago.
- Facturas vencidas por más de 30 días.
- Facturas inconsistentes.

## 11. Probar reimportación

Volver a ejecutar:

```text
Importar facturas
```

y confirmar que los registros existentes sean omitidos.

---

# Decisiones técnicas

## Facturas inconsistentes

Se decidió conservar las facturas inconsistentes en la base de datos en lugar de eliminarlas.

Se excluyen únicamente del flujo operativo principal.

---

## Estados calculados

Los estados de factura y pago se calculan a partir de la información almacenada y las reglas de negocio.

Esto evita depender de un estado potencialmente incorrecto proveniente del archivo de origen.

---

## Vista de base de datos

La búsqueda utiliza una vista SQL para cumplir con el requerimiento de consulta mediante vistas.

La vista utilizada es:

```text
vw_invoice_search
```

---

## Importación soporta ejecución múltiple

La importación puede ejecutarse múltiples veces sin crear facturas duplicadas.

Los registros previamente procesados son detectados y omitidos.

---

## Separación entre sistema activo y reportes

El sistema activo trabaja únicamente con facturas consistentes.

Los reportes pueden utilizar un universo distinto cuando corresponde, incluyendo las facturas inconsistentes para mantener trazabilidad sobre todos los datos procesados.

---

# Autenticación de usuarios

La autenticación fue considerada opcional y no fue incluida en esta implementación.

---

# Estado final del proyecto

Las funcionalidades requeridas se encuentran implementadas:

- [x] Importación desde JSON.
- [x] Persistencia en SQLite.
- [x] Entity Framework Core.
- [x] Validación de facturas inconsistentes.
- [x] Estados de factura calculados.
- [x] Estados de pago calculados.
- [x] Búsqueda por número.
- [x] Filtro por estado de factura.
- [x] Filtro por estado de pago.
- [x] Vista SQL para búsqueda.
- [x] Creación de notas de crédito.
- [x] Validación de saldo pendiente.
- [x] Reporte de vencidas +30 días.
- [x] Reporte de estados de pago.
- [x] Reporte de inconsistencias.
- [x] API REST.
- [x] Swagger.
- [x] Manejo de códigos HTTP.
- [x] Middleware global de errores.
- [x] React + TypeScript.
- [x] Validaciones en frontend.
- [x] Dashboard.
- [x] Tablas con ordenamiento y paginación.
- [x] Diseño responsive.
- [x] Navegación adaptable a móvil y escritorio.
