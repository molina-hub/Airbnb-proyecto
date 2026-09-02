# Modelo de datos — Proyecto Airbnb

```mermaid
erDiagram
    USUARIOS ||--o{ PROPIEDADES : publica
    USUARIOS ||--o{ RESERVAS : realiza
    PROPIEDADES ||--o{ RESERVAS : recibe
    RESERVAS ||--o| RESENAS : genera
    USUARIOS ||--o{ RESENAS : escribe
    PROPIEDADES ||--o{ PROPIEDAD_AMENIDADES : tiene
    AMENIDADES ||--o{ PROPIEDAD_AMENIDADES : clasifica
    USUARIOS ||--o{ FAVORITOS : guarda
    PROPIEDADES ||--o{ FAVORITOS : es_guardada

    USUARIOS { int id PK
               string email UK
               string nombre
               datetime fecha_registro
               boolean es_anfitrion
               string password_hash }
    PROPIEDADES { int id PK
                  string titulo
                  string direccion
                  string ciudad
                  string descripcion
                  string imagen_url
                  decimal precio_noche
                  int capacidad
                  int anfitrion_id FK }
    RESERVAS { int id PK
               int propiedad_id FK
               int huesped_id FK
               date fecha_inicio
               date fecha_fin
               string estado
               decimal total }
    RESENAS { int id PK
              int reserva_id FK_UK
              int autor_id FK
              int puntaje
              string comentario
              datetime fecha }
    AMENIDADES { int id PK
                 string nombre UK }
    PROPIEDAD_AMENIDADES { int propiedad_id PK_FK
                            int amenidad_id PK_FK }
    FAVORITOS { int usuario_id PK_FK
                int propiedad_id PK_FK
                datetime fecha }
```

## Seguridad y reglas de integridad

- `usuarios.password_hash` es obligatorio y guarda exclusivamente hashes bcrypt; la contraseña original nunca se persiste.
- `resenas.reserva_id` es único: cada reserva finalizada y confirmada puede generar una única reseña de 1 a 5 puntos.
- `favoritos` y `propiedad_amenidades` son tablas de relación N:M. `favoritos.fecha` registra cuándo se guardó la propiedad.
- `reservas.total` conserva el importe total calculado al crear la reserva. La calculadora de gastos compartidos del frontend solo deriva cuotas por viajero y no crea datos adicionales.
