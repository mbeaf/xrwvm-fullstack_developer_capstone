from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class CarMake(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class CarModel(models.Model):
    class VehicleType(models.TextChoices):
        SEDAN = "Sedan", "Sedan"
        SUV = "SUV", "SUV"
        WAGON = "Wagon", "Wagon"
        COUPE = "Coupe", "Coupe"
        CONVERTIBLE = "Convertible", "Convertible"
        HATCHBACK = "Hatchback", "Hatchback"
        MINIVAN = "Minivan", "Minivan"
        PICKUP = "Pickup", "Pickup"
        TRUCK = "Truck", "Truck"
        VAN = "Van", "Van"

    car_make = models.ForeignKey(CarMake, on_delete=models.CASCADE, related_name="car_models")
    dealer_id = models.IntegerField(db_index=True)
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=VehicleType.choices)
    year = models.IntegerField(
        validators=[MinValueValidator(2015), MaxValueValidator(2023)]
    )
    mileage = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["car_make__name", "name", "year"]
        constraints = [
            models.UniqueConstraint(
                fields=["car_make", "name", "year", "dealer_id"],
                name="unique_dealer_car_model_year",
            )
        ]

    def __str__(self):
        return f"{self.car_make.name} {self.name} ({self.year})"
