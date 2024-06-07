SELECT  g.id buildingId, g.name building, g.address, g.lat, g.lng, g.locationId, l.name location,
          o.id, o.name office, o.carpetArea, c.id as cabinId,c.name cabin,c.deskType,c.deskSize, c.totalArea, c.usedArea, d.id as deskId, d.name desk,bd.status, bd.ended, b.id bookingId
          FROM buildings g
          left join offices o on o.buildingId=g.id
          left join locations l on g.locationId=l.id
          left join cabins c on c.officeId=o.id 
          left join desks d on d.cabinId=c.id 
          left join booked_desks bd on bd.deskId = d.id and bd.status !='Released'
          left join bookings b on b.id = bd.bookingId
          where  c.deskType='FlexiDesk'  
          and g.locationId=1 and g.companyId=1 group by o.id, c.id, d.id 
          order by d.id, c.id;





