"""Endpoints del dominio Airbnb que no pertenecen al CRUD básico."""

from calendar import monthrange
from datetime import date, datetime
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from src.db.connection import get_db
from src.db.models.amenidad_model import Amenidad
from src.db.models.favorito_model import Favorito
from src.db.models.propiedad_model import Propiedad
from src.db.models.resena_model import Resena
from src.db.models.reserva_model import Reserva
from src.db.models.usuario_model import Usuario
from src.middlewares.auth_middleware import get_current_user

router = APIRouter(tags=["airbnb"])
ESTADOS = {"pendiente", "confirmada", "rechazada", "cancelada"}


class ReservaCreate(BaseModel):
    propiedad_id: int = Field(gt=0)
    huesped_id: int = Field(gt=0)
    fecha_inicio: date
    fecha_fin: date


class EstadoReservaUpdate(BaseModel):
    estado: str
    anfitrion_id: int = Field(gt=0)


class ResenaCreate(BaseModel):
    reserva_id: int = Field(gt=0)
    autor_id: int | None = Field(default=None, gt=0)
    puntaje: int = Field(ge=1, le=5)
    comentario: str | None = Field(default=None, max_length=2000)


class AmenidadCreate(BaseModel):
    nombre: str = Field(min_length=1, max_length=50)


class PropiedadAmenidadesUpdate(BaseModel):
    amenidad_ids: list[int]


def fail(code: int, detail: str):
    raise HTTPException(status_code=code, detail=detail)


def propiedad_data(propiedad: Propiedad) -> dict:
    return {
        "id": propiedad.id,
        "titulo": propiedad.titulo,
        "direccion": propiedad.direccion,
        "ciudad": propiedad.ciudad,
        "precio_noche": propiedad.precio_noche,
        "capacidad": propiedad.capacidad,
        "anfitrion_id": propiedad.anfitrion_id,
        "descripcion": propiedad.descripcion,
        "imagen_url": propiedad.imagen_url,
        "amenidades": [{"id": a.id, "nombre": a.nombre} for a in propiedad.amenidades],
    }


def reserva_data(reserva: Reserva) -> dict:
    propiedad = reserva.propiedad
    return {
        "id": reserva.id, "propiedad_id": reserva.propiedad_id,
        "huesped_id": reserva.huesped_id, "fecha_inicio": reserva.fecha_inicio,
        "fecha_fin": reserva.fecha_fin, "estado": reserva.estado, "total": reserva.total,
        "propiedad": {"id": propiedad.id, "titulo": propiedad.titulo, "ciudad": propiedad.ciudad},
        "huesped": {"id": reserva.huesped.id, "nombre": reserva.huesped.nombre, "email": reserva.huesped.email},
        "anfitrion": {"id": propiedad.anfitrion.id, "nombre": propiedad.anfitrion.nombre},
    }


@router.get("/anfitriones/{anfitrion_id}/propiedades")
def propiedades_de_anfitrion(anfitrion_id: int, usuario: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    if usuario.id != anfitrion_id:
        fail(403, "Solo podés consultar tus propias propiedades")
    anfitrion = db.get(Usuario, anfitrion_id)
    if not anfitrion:
        fail(404, "Anfitrión no encontrado")
    if not anfitrion.es_anfitrion:
        fail(403, "El usuario no es anfitrión")
    propiedades = db.query(Propiedad).options(joinedload(Propiedad.amenidades)).filter_by(anfitrion_id=anfitrion_id).all()
    return [propiedad_data(p) for p in propiedades]


@router.get("/propiedades")
def buscar_propiedades(
    ciudad: str | None = None, desde: date | None = None, hasta: date | None = None,
    huespedes: int | None = Query(default=None, gt=0), precio_max: Decimal | None = Query(default=None, gt=0),
    amenidades: str | None = None, db: Session = Depends(get_db),
):
    if (desde is None) != (hasta is None):
        fail(422, "'desde' y 'hasta' deben enviarse juntos")
    if desde and desde >= hasta:
        fail(422, "La fecha de inicio debe ser anterior a la fecha de fin")
    query = db.query(Propiedad).options(joinedload(Propiedad.amenidades))
    if ciudad:
        query = query.filter(func.lower(Propiedad.ciudad) == ciudad.strip().lower())
    if huespedes:
        query = query.filter(Propiedad.capacidad >= huespedes)
    if precio_max:
        query = query.filter(Propiedad.precio_noche <= precio_max)
    if desde:
        ocupadas = db.query(Reserva.propiedad_id).filter(
            Reserva.estado == "confirmada", Reserva.fecha_inicio < hasta, Reserva.fecha_fin > desde
        )
        query = query.filter(~Propiedad.id.in_(ocupadas))
    nombres = [n.strip().lower() for n in amenidades.split(",") if n.strip()] if amenidades else []
    for nombre in set(nombres):
        query = query.filter(Propiedad.amenidades.any(func.lower(Amenidad.nombre) == nombre))
    return [propiedad_data(p) for p in query.order_by(Propiedad.id).all()]


@router.get("/propiedades/{propiedad_id:int}")
def obtener_propiedad(propiedad_id: int, db: Session = Depends(get_db)):
    propiedad = db.query(Propiedad).options(joinedload(Propiedad.amenidades)).get(propiedad_id)
    if not propiedad:
        fail(404, "Propiedad no encontrada")
    return propiedad_data(propiedad)


@router.post("/reservas", status_code=status.HTTP_201_CREATED)
def crear_reserva(payload: ReservaCreate, usuario: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    if payload.huesped_id != usuario.id:
        fail(403, "Solo podés crear reservas para tu propia cuenta")
    if payload.fecha_inicio >= payload.fecha_fin:
        fail(422, "La fecha de inicio debe ser anterior a la fecha de fin")
    propiedad = db.get(Propiedad, payload.propiedad_id)
    huesped = db.get(Usuario, payload.huesped_id)
    if not propiedad or not huesped:
        fail(404, "Propiedad o huésped no encontrado")
    if propiedad.anfitrion_id == payload.huesped_id:
        fail(403, "Un anfitrión no puede reservar su propia propiedad")
    solapada = db.query(Reserva.id).filter(
        Reserva.propiedad_id == propiedad.id, Reserva.estado.in_(["pendiente", "confirmada"]),
        Reserva.fecha_inicio < payload.fecha_fin, Reserva.fecha_fin > payload.fecha_inicio,
    ).first()
    if solapada:
        fail(409, "La propiedad no está disponible en esas fechas")
    noches = (payload.fecha_fin - payload.fecha_inicio).days
    reserva = Reserva(**payload.model_dump(), estado="pendiente", total=propiedad.precio_noche * noches)
    db.add(reserva); db.commit(); db.refresh(reserva)
    return reserva_data(db.query(Reserva).options(joinedload(Reserva.propiedad).joinedload(Propiedad.anfitrion), joinedload(Reserva.huesped)).get(reserva.id))


@router.patch("/reservas/{reserva_id}/estado")
@router.put("/reservas/{reserva_id}/estado")
def cambiar_estado_reserva(reserva_id: int, payload: EstadoReservaUpdate, usuario: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    if payload.anfitrion_id != usuario.id:
        fail(403, "Solo el anfitrión autenticado puede administrar sus reservas")
    if payload.estado not in ESTADOS:
        fail(422, "Estado inválido")
    reserva = db.query(Reserva).options(joinedload(Reserva.propiedad).joinedload(Propiedad.anfitrion)).get(reserva_id)
    if not reserva:
        fail(404, "Reserva no encontrada")
    if reserva.propiedad.anfitrion_id != payload.anfitrion_id:
        fail(403, "Solo el anfitrión dueño puede cambiar el estado")
    permitidos = {"pendiente": {"confirmada", "rechazada"}, "confirmada": {"cancelada"}}
    if payload.estado not in permitidos.get(reserva.estado, set()):
        fail(409, "Transición de estado no permitida")
    if payload.estado == "confirmada":
        conflicto = db.query(Reserva.id).filter(
            Reserva.propiedad_id == reserva.propiedad_id,
            Reserva.estado.in_(["pendiente", "confirmada"]),
            Reserva.id != reserva.id,
            Reserva.fecha_inicio < reserva.fecha_fin,
            Reserva.fecha_fin > reserva.fecha_inicio,
        ).first()
        if conflicto:
            fail(409, "No se puede confirmar: las fechas ya fueron ocupadas")
    reserva.estado = payload.estado
    resultado = {"penalizacion_porcentaje": 0, "importe_penalizacion": Decimal("0.00")}
    if payload.estado == "cancelada":
        dias = (reserva.fecha_inicio - date.today()).days
        porcentaje = 100 if dias < 2 else 50 if dias < 7 else 0
        resultado = {"penalizacion_porcentaje": porcentaje, "importe_penalizacion": reserva.total * porcentaje / 100}
    db.commit(); db.refresh(reserva)
    return {**reserva_data(reserva), **resultado}


def guardar_resena(propiedad_id: int, payload: ResenaCreate, usuario: Usuario, db: Session) -> dict:
    reserva = db.get(Reserva, payload.reserva_id)
    if not reserva or reserva.propiedad_id != propiedad_id:
        fail(404, "Reserva no encontrada para la propiedad")
    if payload.autor_id is not None and payload.autor_id != usuario.id:
        fail(403, "No podés crear reseñas en nombre de otra persona")
    if reserva.huesped_id != usuario.id:
        fail(403, "Solo el huésped de la reserva puede reseñar")
    if reserva.estado != "confirmada" or reserva.fecha_fin >= date.today():
        fail(409, "Solo se puede reseñar una estancia confirmada y finalizada")
    if db.query(Resena.id).filter_by(reserva_id=reserva.id).first():
        fail(409, "Ya existe una reseña para esta reserva")
    resena = Resena(reserva_id=reserva.id, autor_id=usuario.id, puntaje=payload.puntaje, comentario=payload.comentario)
    db.add(resena); db.commit(); db.refresh(resena)
    return {"id": resena.id, "reserva_id": resena.reserva_id, "autor_id": resena.autor_id, "puntaje": resena.puntaje, "comentario": resena.comentario, "fecha": resena.fecha}


@router.post("/resenas", status_code=status.HTTP_201_CREATED)
def crear_resena(payload: ResenaCreate, usuario: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    reserva = db.get(Reserva, payload.reserva_id)
    if not reserva:
        fail(404, "Reserva no encontrada")
    return guardar_resena(reserva.propiedad_id, payload, usuario, db)


@router.post("/propiedades/{propiedad_id}/resenas", status_code=status.HTTP_201_CREATED)
def crear_resena_para_propiedad(propiedad_id: int, payload: ResenaCreate, usuario: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    return guardar_resena(propiedad_id, payload, usuario, db)


@router.get("/propiedades/{propiedad_id}/resenas")
def listar_resenas(propiedad_id: int, db: Session = Depends(get_db)):
    if not db.get(Propiedad, propiedad_id): fail(404, "Propiedad no encontrada")
    filas = db.query(Resena).options(joinedload(Resena.autor)).join(Reserva).filter(Reserva.propiedad_id == propiedad_id).order_by(Resena.fecha.desc()).all()
    return [{"id": r.id, "reserva_id": r.reserva_id, "autor_id": r.autor_id, "autor": {"nombre": r.autor.nombre}, "puntaje": r.puntaje, "comentario": r.comentario, "fecha": r.fecha} for r in filas]


@router.get("/usuarios/{usuario_id}/favoritos")
def listar_favoritos(usuario_id: int, db: Session = Depends(get_db)):
    if not db.get(Usuario, usuario_id): fail(404, "Usuario no encontrado")
    propiedades = db.query(Propiedad).join(Favorito).options(joinedload(Propiedad.amenidades)).filter(Favorito.usuario_id == usuario_id).all()
    return [propiedad_data(p) for p in propiedades]


@router.get("/favoritos")
def mis_favoritos(usuario: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    return listar_favoritos(usuario.id, db)


@router.post("/favoritos/{propiedad_id}", status_code=status.HTTP_201_CREATED)
def agregar_mi_favorito(propiedad_id: int, usuario: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    return agregar_favorito(usuario.id, propiedad_id, db)


@router.delete("/favoritos/{propiedad_id}", status_code=status.HTTP_204_NO_CONTENT)
def quitar_mi_favorito(propiedad_id: int, usuario: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    return quitar_favorito(usuario.id, propiedad_id, db)


@router.post("/usuarios/{usuario_id}/favoritos/{propiedad_id}", status_code=status.HTTP_201_CREATED)
def agregar_favorito(usuario_id: int, propiedad_id: int, db: Session = Depends(get_db)):
    if not db.get(Usuario, usuario_id) or not db.get(Propiedad, propiedad_id): fail(404, "Usuario o propiedad no encontrado")
    if db.get(Favorito, (usuario_id, propiedad_id)): fail(409, "La propiedad ya está en favoritos")
    favorito = Favorito(usuario_id=usuario_id, propiedad_id=propiedad_id); db.add(favorito); db.commit(); db.refresh(favorito)
    return {"usuario_id": usuario_id, "propiedad_id": propiedad_id, "fecha": favorito.fecha}


@router.delete("/usuarios/{usuario_id}/favoritos/{propiedad_id}", status_code=status.HTTP_204_NO_CONTENT)
def quitar_favorito(usuario_id: int, propiedad_id: int, db: Session = Depends(get_db)):
    favorito = db.get(Favorito, (usuario_id, propiedad_id))
    if not favorito: fail(404, "Favorito no encontrado")
    db.delete(favorito); db.commit()


@router.get("/amenidades")
def listar_amenidades(db: Session = Depends(get_db)):
    return [{"id": a.id, "nombre": a.nombre} for a in db.query(Amenidad).order_by(Amenidad.nombre).all()]


@router.post("/amenidades", status_code=status.HTTP_201_CREATED)
def crear_amenidad(payload: AmenidadCreate, db: Session = Depends(get_db)):
    if db.query(Amenidad).filter(func.lower(Amenidad.nombre) == payload.nombre.strip().lower()).first(): fail(409, "La amenidad ya existe")
    amenidad = Amenidad(nombre=payload.nombre.strip()); db.add(amenidad); db.commit(); db.refresh(amenidad)
    return {"id": amenidad.id, "nombre": amenidad.nombre}


@router.put("/propiedades/{propiedad_id}/amenidades")
def asignar_amenidades(propiedad_id: int, payload: PropiedadAmenidadesUpdate, db: Session = Depends(get_db)):
    propiedad = db.query(Propiedad).options(joinedload(Propiedad.amenidades)).get(propiedad_id)
    if not propiedad: fail(404, "Propiedad no encontrada")
    ids = set(payload.amenidad_ids)
    amenidades = db.query(Amenidad).filter(Amenidad.id.in_(ids)).all() if ids else []
    if len(amenidades) != len(ids): fail(404, "Una o más amenidades no existen")
    propiedad.amenidades = amenidades; db.commit(); db.refresh(propiedad)
    return propiedad_data(propiedad)


@router.get("/propiedades/{propiedad_id}/disponibilidad")
def disponibilidad(propiedad_id: int, mes: str, db: Session = Depends(get_db)):
    try: inicio = datetime.strptime(mes, "%Y-%m").date().replace(day=1)
    except ValueError: fail(422, "mes debe tener formato YYYY-MM")
    if not db.get(Propiedad, propiedad_id): fail(404, "Propiedad no encontrada")
    fin = inicio.replace(day=monthrange(inicio.year, inicio.month)[1])
    ocupadas = set()
    reservas = db.query(Reserva).filter(Reserva.propiedad_id == propiedad_id, Reserva.estado == "confirmada", Reserva.fecha_inicio <= fin, Reserva.fecha_fin > inicio).all()
    for reserva in reservas:
        cursor = max(reserva.fecha_inicio, inicio)
        limite = min(reserva.fecha_fin, date.fromordinal(fin.toordinal() + 1))
        while cursor < limite:
            ocupadas.add(cursor); cursor = date.fromordinal(cursor.toordinal() + 1)
    dias = [{"fecha": date.fromordinal(inicio.toordinal() + offset), "estado": "ocupado" if date.fromordinal(inicio.toordinal() + offset) in ocupadas else "libre"} for offset in range((fin - inicio).days + 1)]
    return {"propiedad_id": propiedad_id, "mes": mes, "dias": dias}


@router.get("/anfitriones/{anfitrion_id}/ingresos")
def ingresos(anfitrion_id: int, desde: date, hasta: date, db: Session = Depends(get_db)):
    if desde > hasta: fail(422, "'desde' no puede ser posterior a 'hasta'")
    anfitrion = db.get(Usuario, anfitrion_id)
    if not anfitrion or not anfitrion.es_anfitrion: fail(404, "Anfitrión no encontrado")
    reservas = db.query(Reserva).join(Propiedad).filter(Propiedad.anfitrion_id == anfitrion_id, Reserva.estado == "confirmada", Reserva.fecha_fin >= desde, Reserva.fecha_fin <= hasta).all()
    detalle = {}
    for r in reservas:
        item = detalle.setdefault(r.propiedad_id, {"propiedad_id": r.propiedad_id, "titulo": r.propiedad.titulo, "total_facturado": Decimal("0.00"), "cantidad_reservas": 0})
        item["total_facturado"] += r.total; item["cantidad_reservas"] += 1
    return {"anfitrion_id": anfitrion_id, "desde": desde, "hasta": hasta, "total_facturado": sum((r.total for r in reservas), Decimal("0.00")), "detalle": list(detalle.values())}


@router.get("/anfitriones/{anfitrion_id}/reservas")
def reservas_de_anfitrion(anfitrion_id: int, estado: str | None = None, usuario: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    if usuario.id != anfitrion_id:
        fail(403, "Solo podés consultar las reservas de tus propiedades")
    anfitrion = db.get(Usuario, anfitrion_id)
    if not anfitrion or not anfitrion.es_anfitrion:
        fail(404, "Anfitrión no encontrado")
    query = db.query(Reserva).options(joinedload(Reserva.propiedad).joinedload(Propiedad.anfitrion), joinedload(Reserva.huesped)).join(Propiedad).filter(Propiedad.anfitrion_id == anfitrion_id)
    if estado:
        if estado not in ESTADOS: fail(422, "Estado inválido")
        query = query.filter(Reserva.estado == estado)
    return [reserva_data(r) for r in query.order_by(Reserva.fecha_inicio.desc()).all()]


@router.get("/propiedades/top")
def propiedades_top(ciudad: str | None = None, db: Session = Depends(get_db)):
    query = db.query(Propiedad, func.avg(Resena.puntaje).label("promedio"), func.count(Resena.id).label("cantidad_resenas")).join(Reserva, Reserva.propiedad_id == Propiedad.id).join(Resena, Resena.reserva_id == Reserva.id).group_by(Propiedad.id).having(func.count(Resena.id) >= 3)
    if ciudad: query = query.filter(func.lower(Propiedad.ciudad) == ciudad.strip().lower())
    filas = query.order_by(func.avg(Resena.puntaje).desc(), func.count(Resena.id).desc()).limit(10).all()
    return [{"id": p.id, "titulo": p.titulo, "ciudad": p.ciudad, "precio_noche": p.precio_noche, "promedio": promedio, "cantidad_resenas": cantidad} for p, promedio, cantidad in filas]


@router.get("/usuarios/{usuario_id}/reservas")
def reservas_de_usuario(usuario_id: int, estado: str | None = None, db: Session = Depends(get_db)):
    if estado and estado not in ESTADOS: fail(422, "Estado inválido")
    if not db.get(Usuario, usuario_id): fail(404, "Usuario no encontrado")
    query = db.query(Reserva).options(joinedload(Reserva.propiedad).joinedload(Propiedad.anfitrion), joinedload(Reserva.huesped)).filter(Reserva.huesped_id == usuario_id)
    if estado: query = query.filter(Reserva.estado == estado)
    return [reserva_data(r) for r in query.order_by(Reserva.fecha_inicio.desc()).all()]


@router.get("/reservas")
def mis_reservas(estado: str | None = None, usuario: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    return reservas_de_usuario(usuario.id, estado, db)
