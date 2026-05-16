import os
from typing import Dict, Any, List

def call_watsonx(prompt: str) -> str:
    """
    Calls the IBM Watsonx AI service.
    Currently mocked until credentials are provided.
    """
    api_key = os.getenv("WATSONX_API_KEY")
    project_id = os.getenv("WATSONX_PROJECT_ID")
    url = os.getenv("WATSONX_URL", "https://us-south.ml.cloud.ibm.com")
    
    # Check if we have real credentials
    if api_key and api_key != "your_watsonx_api_key_here" and project_id and project_id != "your_watsonx_project_id_here":
        try:
            from ibm_watsonx_ai.foundation_models import ModelInference
            from ibm_watsonx_ai.metanames import GenTextParamsMetaNames as GenParams

            credentials = {
                "url": url,
                "apikey": api_key
            }

            model_id = "ibm/granite-8b-code-instruct"

            parameters = {
                GenParams.DECODING_METHOD: "greedy",
                GenParams.MAX_NEW_TOKENS: 2048,
                GenParams.STOP_SEQUENCES: ["<|endoftext|>"]
            }

            model = ModelInference(
                model_id=model_id,
                params=parameters,
                credentials=credentials,
                project_id=project_id
            )

            return model.generate_text(prompt)
        except Exception as e:
            print(f"Error calling Watsonx AI: {e}")
            # Fall back to mock on error for robustness during demo
            pass
    
    # MOCK RESPONSE (Fallback)
    if "Generate unit tests" in prompt:
        return "```python\nimport unittest\n\nclass MockTest(unittest.TestCase):\n    def test_mock(self):\n        self.assertTrue(True)\n```"
    elif "Generate API documentation" in prompt:
        return "# Mock API Documentation\n\n## `GET /mock`\nReturns a mock response."
    elif "Explain" in prompt:
        return "This is a mocked explanation of the provided code snippet."
    
    return "Mocked completion from Watsonx AI."
