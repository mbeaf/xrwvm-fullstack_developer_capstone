"""Load the sample car inventory into the local Django database."""

import json
from pathlib import Path

from .models import CarMake, CarModel


def initiate():
    records_path = Path(__file__).resolve().parent.parent / "database" / "data" / "car_records.json"
    with records_path.open(encoding="utf-8") as records_file:
        cars = json.load(records_file)["cars"]

    for car in cars:
        make, _ = CarMake.objects.get_or_create(name=car["make"])
        CarModel.objects.update_or_create(
            car_make=make,
            name=car["model"],
            year=car["year"],
            dealer_id=car["dealer_id"],
            defaults={
                "type": car["bodyType"],
                "mileage": car.get("mileage", 0),
            },
        )

    print(f"Loaded {len(cars)} car inventory records.")
