#!/usr/bin/env python3
"""
Test script for the new blocklist and activity API endpoints
"""

import requests
import json

# Base URL for the API
BASE_URL = "http://localhost:8000"

def test_health():
    """Test the health endpoint"""
    print("Testing health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Health check: {response.status_code} - {response.json()}")
    return response.status_code == 200

def test_auth_flow():
    """Test authentication flow"""
    print("\nTesting authentication...")
    
    # Try to get blocklist without auth (should fail)
    response = requests.get(f"{BASE_URL}/api/blocklist")
    print(f"Unauthenticated blocklist request: {response.status_code}")
    
    if response.status_code == 401:
        print("✅ Authentication required - good!")
        return True
    else:
        print("❌ Authentication not working properly")
        return False

def test_blocklist_endpoints():
    """Test blocklist endpoints (will fail without auth, but test structure)"""
    print("\nTesting blocklist endpoints...")
    
    # Test add blocklist item
    data = {"website": "test.com"}
    response = requests.post(f"{BASE_URL}/api/blocklist/add", json=data)
    print(f"Add blocklist item: {response.status_code}")
    
    # Test get blocklist
    response = requests.get(f"{BASE_URL}/api/blocklist")
    print(f"Get blocklist: {response.status_code}")
    
    # Test check blocklist
    response = requests.get(f"{BASE_URL}/api/blocklist/check/test.com")
    print(f"Check blocklist: {response.status_code}")

def test_activity_endpoints():
    """Test activity endpoints (will fail without auth, but test structure)"""
    print("\nTesting activity endpoints...")
    
    # Test add activity
    data = {
        "problem_name": "Two Sum",
        "problem_url": "https://leetcode.com/problems/two-sum/",
        "difficulty": "Easy",
        "topic_tags": ["Array", "Hash Table"],
        "status": "solved"
    }
    response = requests.post(f"{BASE_URL}/api/activity", json=data)
    print(f"Add activity: {response.status_code}")
    
    # Test get activities
    response = requests.get(f"{BASE_URL}/api/activity")
    print(f"Get activities: {response.status_code}")
    
    # Test get activity stats
    response = requests.get(f"{BASE_URL}/api/activity/stats")
    print(f"Get activity stats: {response.status_code}")

def main():
    """Run all tests"""
    print("🚀 Testing LeetGuard API Endpoints")
    print("=" * 50)
    
    # Test health endpoint
    if not test_health():
        print("❌ Server not running or health check failed")
        return
    
    # Test authentication
    if not test_auth_flow():
        print("❌ Authentication not working")
        return
    
    # Test endpoints (will show 401 errors, which is expected without auth)
    test_blocklist_endpoints()
    test_activity_endpoints()
    
    print("\n" + "=" * 50)
    print("✅ API structure tests completed!")
    print("📝 Note: 401 errors are expected without authentication")
    print("🔐 To test with real data, you'll need to:")
    print("   1. Create a user account")
    print("   2. Get an authentication token")
    print("   3. Include the token in requests")

if __name__ == "__main__":
    main()
