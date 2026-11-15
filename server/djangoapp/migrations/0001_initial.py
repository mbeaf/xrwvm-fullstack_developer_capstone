from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="CarMake",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=100, unique=True)),
                ("description", models.TextField(blank=True)),
            ],
            options={"ordering": ["name"]},
        ),
        migrations.CreateModel(
            name="CarModel",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("dealer_id", models.IntegerField(db_index=True)),
                ("name", models.CharField(max_length=100)),
                ("type", models.CharField(choices=[("Sedan", "Sedan"), ("SUV", "SUV"), ("Wagon", "Wagon"), ("Coupe", "Coupe"), ("Convertible", "Convertible"), ("Hatchback", "Hatchback"), ("Minivan", "Minivan"), ("Pickup", "Pickup"), ("Truck", "Truck"), ("Van", "Van")], max_length=20)),
                ("year", models.IntegerField(validators=[MinValueValidator(2015), MaxValueValidator(2023)])),
                ("mileage", models.PositiveIntegerField(default=0)),
                ("car_make", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="car_models", to="djangoapp.carmake")),
            ],
            options={"ordering": ["car_make__name", "name", "year"]},
        ),
        migrations.AddConstraint(
            model_name="carmodel",
            constraint=models.UniqueConstraint(fields=("car_make", "name", "year", "dealer_id"), name="unique_dealer_car_model_year"),
        ),
    ]
