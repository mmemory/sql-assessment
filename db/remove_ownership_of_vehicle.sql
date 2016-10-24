update Vehicles
set ownerid = NULL
where id = $1 and ownerid = $2