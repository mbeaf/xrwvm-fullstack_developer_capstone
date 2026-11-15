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
from . import restapis
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


def get_dealers(request, state=None):
    """Return dealer records from the external dealership service."""
    if request.method != 'GET':
        return JsonResponse({'status': 405, 'error': 'Use GET to retrieve dealers.'}, status=405)

    try:
        endpoint = 'fetchDealers' if not state or state.lower() == 'all' else f'fetchDealers/{state}'
        dealers = restapis.get_request(endpoint)
        return JsonResponse({'status': 200, 'dealers': dealers})
    except restapis.requests.RequestException:
        logger.exception('Could not retrieve dealers from the dealership service.')
        return JsonResponse({'status': 502, 'error': 'Dealership service is unavailable.'}, status=502)


def get_dealerships(request):
    """Return all dealerships through the backend proxy."""
    return get_dealers(request)


def get_dealer_details(request, dealer_id):
    """Return details for one dealership from the backend."""
    if request.method != 'GET':
        return JsonResponse({'status': 405, 'error': 'Use GET to retrieve dealer details.'}, status=405)
    try:
        dealer = restapis.get_request(f'fetchDealer/{dealer_id}')
        return JsonResponse({'status': 200, 'dealer': [dealer]})
    except restapis.requests.HTTPError as error:
        if error.response is not None and error.response.status_code == 404:
            return JsonResponse({'status': 404, 'error': 'Dealership not found.'}, status=404)
        logger.exception('Could not retrieve dealer %s.', dealer_id)
        return JsonResponse({'status': 502, 'error': 'Dealership service is unavailable.'}, status=502)
    except restapis.requests.RequestException:
        logger.exception('Could not retrieve dealer %s.', dealer_id)
        return JsonResponse({'status': 502, 'error': 'Dealership service is unavailable.'}, status=502)


def get_dealer_reviews(request, dealer_id):
    """Return reviews for one dealership from the backend."""
    if request.method != 'GET':
        return JsonResponse({'status': 405, 'error': 'Use GET to retrieve dealer reviews.'}, status=405)
    try:
        reviews = restapis.get_request(f'fetchReviews/dealer/{dealer_id}')
        return JsonResponse({'status': 200, 'reviews': reviews})
    except restapis.requests.RequestException:
        logger.exception('Could not retrieve reviews for dealer %s.', dealer_id)
        return JsonResponse({'status': 502, 'error': 'Review service is unavailable.'}, status=502)


@csrf_exempt
def add_review(request):
    """Forward a review payload to the backend review service."""
    if request.method != 'POST':
        return JsonResponse({'status': 405, 'error': 'Use POST to submit a review.'}, status=405)
    try:
        data = json.loads(request.body)
        required_fields = (
            'name', 'dealership', 'review', 'purchase', 'purchase_date',
            'car_make', 'car_model', 'car_year',
        )
        if not isinstance(data, dict) or any(field not in data for field in required_fields):
            return JsonResponse({'status': 400, 'error': 'Review fields are missing.'}, status=400)
        result = restapis.post_review(data)
        return JsonResponse({'status': 200, 'review': result})
    except (json.JSONDecodeError, TypeError):
        return JsonResponse({'status': 400, 'error': 'Invalid JSON review payload.'}, status=400)
    except restapis.requests.RequestException:
        logger.exception('Could not submit review to the dealership service.')
        return JsonResponse({'status': 502, 'error': 'Dealership service is unavailable.'}, status=502)


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
