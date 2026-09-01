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
               boolean es_anfitrion }
    PROPIEDADES { int id PK
                  string titulo
                  string direccion
                  string ciudad
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
