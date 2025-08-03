#!/usr/bin/env python3

import resend
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set API key
resend.api_key = os.getenv('RESEND_API_KEY')
print(f"API Key: {resend.api_key[:10]}...")

# Test different from emails
from_emails = [
    "onboarding@resend.dev",
    "noreply@resend.dev", 
    "hello@resend.dev",
    "test@resend.dev",
    "noreply@leetguard.co"  # Your custom domain
]

for from_email in from_emails:
    try:
        print(f"\nTesting with from: {from_email}")
        
        response = resend.emails._emails.Emails.send({
            "from": from_email,
            "to": ["nguyenanh.tr2006@gmail.com"],
            "subject": f"Test from {from_email}",
            "text": f"This is a test email from {from_email}"
        })
        
        print(f"✅ SUCCESS with {from_email}!")
        print(f"Response: {response}")
        break
        
    except Exception as e:
        print(f"❌ Failed with {from_email}: {str(e)}")
        continue 