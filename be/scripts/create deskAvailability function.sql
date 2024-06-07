drop function if exists deskAvailability;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `deskAvailability`(`startDate` datetime,`cabin` int,`days` int,`deskType` varchar(50)) RETURNS int(11)
BEGIN
        declare booked INT;
        declare inventory INT;
        declare available INT;

        DECLARE fromDate DATE;
        DECLARE toDate DATE;

        SET fromDate = startDate;
        SET toDate = (SELECT DATE_ADD(fromDate, INTERVAL days DAY));

        select count(*)
        into inventory
        from desks where cabinId=cabin;

        set booked = 0;

        SELECT count(*)
        into booked
        FROM desks d
        left join cabins c on c.id=d.cabinId
        left join booked_desks bd on d.id=bd.deskId
        where 1=1 and c.id=cabin and deskId is not null;

        set available = inventory - booked;

        return available;
END ;;
DELIMITER ;


drop function if exists geodistance;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `geodistance`(`lat1` double,`lon1` double,`lat2` double,`lon2` double,`unit` char) RETURNS double
BEGIN
  declare theta double;
  declare distance double;

  set theta = lon1 - lon2;
  set distance = sin(radians(lat1)) * sin(radians(lat2)) + cos(radians(lat1)) * cos(radians(lat2)) * cos(radians(theta));

  set distance = acos(distance);
  set distance = degrees(distance);
  set distance = distance * 60 * 1.1515;

  if(unit = 'K') THEN
     set distance = distance * 1.609344;
  elseif (unit = 'N') then
     set distance = distance * 0.8684;
  end if;

  RETURN distance;
END