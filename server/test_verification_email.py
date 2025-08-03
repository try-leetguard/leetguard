#!/usr/bin/env python3

import resend
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set API key
resend.api_key = os.getenv('RESEND_API_KEY')
print(f"API Key: {resend.api_key[:10]}...")
print(f"FROM_EMAIL: {os.getenv('FROM_EMAIL')}")

try:
    print("Testing verification email...")
    
    # HTML template for verification email (exact same as server)
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - LeetGuard</title>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }}
            .content {{ background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }}
            .code {{ background: #1f2937; color: white; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; border-radius: 6px; margin: 20px 0; }}
            .footer {{ text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>LeetGuard</h1>
                <p>Verify Your Email Address</p>
            </div>
            <div class="content">
                <h2>Email Verification</h2>
                <p>Thank you for signing up for LeetGuard! To complete your registration, please enter the following verification code:</p>
                
                <div class="code">123456</div>
                
                <p><strong>This code will expire in 10 minutes.</strong></p>
                
                <p>If you didn't create an account with LeetGuard, you can safely ignore this email.</p>
                
                <p>Need help? Contact our support team.</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 LeetGuard. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    # Plain text version
    text_content = f"""
    Email Verification - LeetGuard
    
    Thank you for signing up for LeetGuard! To complete your registration, please enter the following verification code:
    
    123456
    
    This code will expire in 10 minutes.
    
    If you didn't create an account with LeetGuard, you can safely ignore this email.
    
    Need help? Contact our support team.
    
    © 2024 LeetGuard. All rights reserved.
    """
    
    # Send email via Resend (exact same as server)
    response = resend.emails._emails.Emails.send({
        "from": os.getenv('FROM_EMAIL'),
        "to": ["nguyenanh.tr2006@gmail.com"],
        "subject": "Verify Your Email - LeetGuard",
        "html": html_content,
        "text": text_content
    })
    
    print(f"✅ SUCCESS! Response: {response}")
    
except Exception as e:
    print(f"❌ Error: {type(e).__name__}: {str(e)}")
    print(f"Error details: {e}") 