select Vehicles.id, Vehicles.make, Vehicles.model, Vehicles.year, Vehicles.ownerid, Users.firstname, Users.lastname  from Vehicles
join Users on Vehicles.ownerid = Users.id
where year > 2000
order by year desc;