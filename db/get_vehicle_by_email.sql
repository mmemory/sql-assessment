select * from Vehicles
join Users on Vehicles.ownerId = Users.id
where email = $1