select * from Vehicles
join Users on Vehicles.ownerId = Users.id
where firstname like $1;