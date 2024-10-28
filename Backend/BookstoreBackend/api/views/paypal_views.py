import requests
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

def get_paypal_access_token():
    """
    Helper function to get PayPal access token using client credentials.
    """
    auth = (settings.PAYPAL_CLIENT_ID, settings.PAYPAL_CLIENT_SECRET)
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
    }
    data = "grant_type=client_credentials"
    response = requests.post(f"{settings.PAYPAL_BASE_URL}/v1/oauth2/token", headers=headers, data=data, auth=auth)
    if response.status_code == 200:
        return response.json().get("access_token")
    else:
        raise Exception("Failed to retrieve PayPal access token")

@api_view(["POST"])
def create_paypal_order(request):
    """
    Django view to create a PayPal order.
    Expects `amount` in the request body.
    """
    amount = request.data.get("amount")
    
    # Validate amount
    if not amount:
        return Response({"error": "Amount is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Get PayPal access token
        access_token = get_paypal_access_token()
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}",
    }
    order_data = {
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "amount": {
                    "currency_code": "USD",
                    "value": amount,  # Use dynamic amount from frontend
                },
            }
        ],
    }

    # Send request to PayPal to create order
    response = requests.post(f"{settings.PAYPAL_BASE_URL}/v2/checkout/orders", headers=headers, json=order_data)
    
    if response.status_code == 201:
        return Response(response.json())
    else:
        return Response(response.json(), status=response.status_code)

@api_view(["POST"])
def capture_paypal_order(request, order_id):
    """
    Django view to capture a PayPal order.
    Expects `order_id` as a URL parameter.
    """
    try:
        # Get PayPal access token
        access_token = get_paypal_access_token()
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}",
    }

    # Send request to PayPal to capture the order
    response = requests.post(f"{settings.PAYPAL_BASE_URL}/v2/checkout/orders/{order_id}/capture", headers=headers)
    
    if response.status_code == 201:
        return Response(response.json())
    else:
        return Response(response.json(), status=response.status_code)
