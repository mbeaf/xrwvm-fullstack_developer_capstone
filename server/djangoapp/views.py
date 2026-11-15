# Uncomment the required imports before adding the code

# from django.shortcuts import render
# from django.http import HttpResponseRedirect, HttpResponse
# from django.contrib.auth.models import User
# from django.shortcuts import get_object_or_404, render, redirect
# from django.contrib.auth import logout
# from django.contrib import messages
# from datetime import datetime

from django.http import JsonResponse
from .models import CarMake
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.models import User
import logging
import json
from django.views.decorators.csrf import csrf_exempt
# from .populate import initiate


# Get an instance of a logger
logger = logging.getLogger(__name__)


def get_car_makes(request):
    """Return every car make with its models as JSON."""
    if request.method != 'GET':
        return JsonResponse({'error': 'Use GET to retrieve car makes.'}, status=405)

    makes = CarMake.objects.prefetch_related('car_models').all()
    data = [
        {
            'id': make.id,
            'name': make.name,
            'description': make.description,
            'models': [
                {
                    'id': car_model.id,
                    'name': car_model.name,
                    'dealer_id': car_model.dealer_id,
                    'type': car_model.type,
                    'year': car_model.year,
                    'mileage': car_model.mileage,
                }
                for car_model in make.car_models.all()
            ],
        }
        for make in makes
    ]
    return JsonResponse({'CarMakes': data})


# Create your views here.

# Create a `login_request` view to handle sign in request
@csrf_exempt
def login_user(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Use POST to sign in.'}, status=405)

    try:
        data = json.loads(request.body)
        username = data['userName'].strip()
        password = data['password']
    except (json.JSONDecodeError, KeyError, TypeError, AttributeError):
        return JsonResponse({'error': 'Username and password are required.'}, status=400)

    user = authenticate(username=username, password=password)
    if user is None:
        return JsonResponse({'userName': username, 'error': 'Invalid username or password.'}, status=401)

    login(request, user)
    return JsonResponse({'userName': username, 'status': 'Authenticated'})

# Create a `logout_request` view to handle sign out request
@csrf_exempt
def logout_request(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Use POST to sign out.'}, status=405)
    username = request.user.get_username() if request.user.is_authenticated else ''
    logout(request)
    return JsonResponse({'userName': username})

# Create a `registration` view to handle sign up request
@csrf_exempt
def registration(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Use POST to register.'}, status=405)
    try:
        data = json.loads(request.body)
        username = data['userName'].strip()
        first_name = data['firstName'].strip()
        last_name = data['lastName'].strip()
        email = data['email'].strip()
        password = data['password']
        if not all((username, first_name, last_name, email, password)):
            raise ValueError
    except (json.JSONDecodeError, KeyError, TypeError, AttributeError, ValueError):
        return JsonResponse({'error': 'All fields are required.'}, status=400)

    if User.objects.filter(username=username).exists():
        return JsonResponse({'error': 'That username is already taken.'}, status=409)
    if User.objects.filter(email=email).exists():
        return JsonResponse({'error': 'An account with that email already exists.'}, status=409)

    user = User.objects.create_user(
        username=username,
        first_name=first_name,
        last_name=last_name,
        email=email,
        password=password,
    )
    login(request, user)
    return JsonResponse({'userName': user.username, 'status': 'Registered'}, status=201)

# # Update the `get_dealerships` view to render the index page with
# a list of dealerships
# def get_dealerships(request):
# ...

# Create a `get_dealer_reviews` view to render the reviews of a dealer
# def get_dealer_reviews(request,dealer_id):
# ...

# Create a `get_dealer_details` view to render the dealer details
# def get_dealer_details(request, dealer_id):
# ...

# Create a `add_review` view to submit a review
# def add_review(request):
# ...
