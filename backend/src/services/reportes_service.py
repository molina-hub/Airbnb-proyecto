from calendar import monthrange
from datetime import date, datetime, timedelta
from decimal import Decimal

from sqlalchemy.orm import Session

from src.db.models.usuario_model import Usuario
from src.dtos.reportes_dto import (
    DiaDisponibilidadDTO,
    DisponibilidadDTO,
    IngresoPropiedadDTO,
    IngresosAnfitrionDTO,
    PropiedadTopDTO,
)
from src.repositories.reportes_repository import ReportesRepository


class ReportesService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = ReportesRepository(db)

    def disponibilidad(self, propiedad_id: int, mes: str) -> DisponibilidadDTO:
        try:
            inicio = datetime.strptime(mes, "%Y-%m").date().replace(day=1)
        except ValueError as error:
            raise ValueError("mes debe tener formato YYYY-MM") from error
        if not self.repo.propiedad_existe(propiedad_id):
            raise LookupError("Propiedad no encontrada")
        fin = inicio.replace(day=monthrange(inicio.year, inicio.month)[1])
        ocupados: set[date] = set()
        for reserva in self.repo.reservas_confirmadas_en_mes(propiedad_id, inicio, fin):
            cursor = max(reserva.fecha_inicio, inicio)
            limite = min(reserva.fecha_fin, fin + timedelta(days=1))
            while cursor < limite:
                ocupados.add(cursor)
                cursor += timedelta(days=1)
        dias = [
            DiaDisponibilidadDTO(fecha=inicio + timedelta(days=offset), estado="ocupado" if inicio + timedelta(days=offset) in ocupados else "libre")
            for offset in range((fin - inicio).days + 1)
        ]
        return DisponibilidadDTO(propiedad_id=propiedad_id, mes=mes, dias=dias)

    def ingresos(self, anfitrion_id: int, desde: date, hasta: date) -> IngresosAnfitrionDTO:
        if desde > hasta:
            raise ValueError("'desde' no puede ser posterior a 'hasta'")
        anfitrion = self.db.get(Usuario, anfitrion_id)
        if not anfitrion or not anfitrion.es_anfitrion:
            raise LookupError("Anfitrión no encontrado")
        detalle: dict[int, IngresoPropiedadDTO] = {}
        total = Decimal("0.00")
        for reserva, propiedad in self.repo.ingresos_confirmados(anfitrion_id, desde, hasta):
            item = detalle.setdefault(propiedad.id, IngresoPropiedadDTO(propiedad_id=propiedad.id, titulo=propiedad.titulo, total_facturado=Decimal("0.00"), cantidad_reservas=0))
            item.total_facturado += reserva.total
            item.cantidad_reservas += 1
            total += reserva.total
        return IngresosAnfitrionDTO(anfitrion_id=anfitrion_id, desde=desde, hasta=hasta, total_facturado=total, detalle=list(detalle.values()))

    def top_propiedades(self, ciudad: str) -> list[PropiedadTopDTO]:
        if not ciudad.strip():
            raise ValueError("ciudad es obligatoria")
        return [
            PropiedadTopDTO(id=propiedad.id, titulo=propiedad.titulo, ciudad=propiedad.ciudad, precio_noche=propiedad.precio_noche, promedio=promedio, cantidad_resenas=cantidad)
            for propiedad, promedio, cantidad in self.repo.top_propiedades_por_ciudad(ciudad)
        ]
