select count(*) as count from Users
join Vehicles on Users.id = vehicles.ownerId
where Users.id = $1;