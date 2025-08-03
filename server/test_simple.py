#!/usr/bin/env python3

import resend
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set API key
resend.api_key = os.getenv('RESEND_API_KEY')
print(f"API Key: {resend.api_key[:10]}...")

try:
    print("Testing simple email...")
    
    # Try with minimal parameters
    response = resend.emails._emails.Emails.send({
        "from": "onboarding@resend.dev",
        "to": ["nguyenanh.tr2006@gmail.com"],
        "subject": "Test",
        "text": "Test email"
    })
    
    print(f"Success! Response: {response}")
    
except Exception as e:
    print(f"Error: {type(e).__name__}: {str(e)}")
    print(f"Error details: {e}")
    
    # Try to get more info about the error
    if hasattr(e, 'status_code'):
        print(f"Status code: {e.status_code}")
    if hasattr(e, 'message'):
        print(f"Message: {e.message}") 