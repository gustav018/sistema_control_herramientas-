# Sistema de Control de Herramientas

Este proyecto consiste en un sistema de control de herramientas que requieren calibración periódica, desarrollado en el stack MERN (MongoDB, Express, React, Node.js).

## Descripción del Proyecto

El sistema consta de dos etapas de desarrollo:

### Parte 1 - Desarrollo por Gustavo Fleitas

En esta etapa se desarrollaron las siguientes funcionalidades:

- **Autenticación**: Incluye registro de usuarios y inicio de sesión.
- **Gestión de Herramientas**: Permite crear, editar, eliminar y listar herramientas con los siguientes campos:
  - Identificación
  - Descripción
  - Ubicación
  - Calibrado por
  - Certificado N°
  - Frecuencia de calibración
  - Última fecha de calibración
  - Próxima fecha de calibración
  - Responsable (colaborador)
- **Gestión de Empleados (Colaboradores)**: Permite listar, editar y eliminar empleados con los siguientes campos:
  - Nombre
  - Apellido
  - Correo
  - Cédula
  - Teléfono
- **Reporte en PDF**: Genera reportes en formato ISO 9001.

### Parte 2 - Desarrollo Colaborativo junto con Jorge Rodríguez

En esta etapa se añadieron las siguientes características:

- **Recuperación de Contraseña**: Permite a los usuarios restablecer sus contraseñas en caso de olvido.
- **Notificaciones por Correo**: Envía notificaciones por correo electrónico sobre herramientas vencidas y a punto de vencer.
- **Estado de Herramientas**: Actualiza el estado de las herramientas enviadas a calibración y actualiza los certificados de calibración.

## Características

- **Gestión de Herramientas por Sucursal/Usuario**: Permite asignación y seguimiento por sucursal y usuario.
- **Calendario de Vencimiento**: Establece fechas de vencimiento para la calibración de las herramientas.

## Desarrolladores

Gustavo Fleitas ([GitHub](https://github.com/gustav018/))
Jorge Rodríguez ([GitHub](https://github.com/jorge-rdi/))
