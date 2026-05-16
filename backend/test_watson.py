from dotenv import load_dotenv
load_dotenv()

from services.watsonx_service import call_watsonx

try:
    print("Testing Watsonx call...")
    response = call_watsonx("Generate API documentation for a test function.")
    print("Response:")
    print(response)
except Exception as e:
    print(f"Error: {e}")
