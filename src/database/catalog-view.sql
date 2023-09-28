DROP VIEW IF EXISTS catalogo;
CREATE view catalogo as
SELECT
	c.id,
	c.poster,
	c.titulo,
	c.resumen,
	c.trailer,
	case
		when c.temporadas is null then 'N/A'
		else c.temporadas
	end as temporadas,
	c2.nombre as categoria,
	GROUP_CONCAT(DISTINCT g.nombre SEPARATOR ', ') as genero,
	GROUP_CONCAT(DISTINCT a.nombre SEPARATOR ', ') as reparto
FROM contenido c
join categorias c2 on idCategoria = c2.id
join generosContenido gc on gc.idContenido = c.id
JOIN generos g on g.id = gc.idGenero
JOIN actoresContenido ac on ac.idContenido = c.id
JOIN actores a on a.id = ac.idActor
GROUP BY c.id;
