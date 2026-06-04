import os
import csv
import json
import requests
import asyncio
from dotenv import load_dotenv
from google.antigravity import Agent, LocalAgentConfig

load_dotenv()

CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDOfWTT2RBDmwXpcbV53fwCcnXR_RC-CEssZPHGyjwnZyA56SwGTIRilKJPi56ZZ_YuGnpazQN55-K/pub?output=csv"
PROCESSED_FILE = "processed_requests.json"

async def process_request(req):
    print(f"\n🚀 Processing new request from {req['Client Name']}: {req['Change Requested']}")
    
    config = LocalAgentConfig(
        system_instructions=f"""
You are an autonomous AI Webmaster. 
Your task is to modify the local codebase at '/Users/dr3/Documents/Antigravity Designs/money/safe haven dog ranch' to fulfill this client request:

Client: {req['Client Name']}
Target Page: {req['Target URL/Page']}
Change Requested: {req['Change Requested']}

Use your tools to edit the HTML/CSS/JS files accordingly. Do not ask for user permission, just execute the code changes and verify they are correct.
"""
    )
    
    try:
        async with Agent(config) as agent:
            response = await agent.chat("Please implement the requested change in the codebase.")
            print(f"✅ AI Agent completed task. Response:\n{await response.text()}")
            return True
    except Exception as e:
        print(f"❌ Error running agent: {e}")
        return False

async def main():
    if not os.environ.get("GEMINI_API_KEY"):
        print("⚠️ GEMINI_API_KEY environment variable is not set!")
        print("Please set it in your environment. You can get a key at https://aistudio.google.com/app/api-keys")
        return

    # Load previously processed requests to avoid duplicates
    processed = []
    if os.path.exists(PROCESSED_FILE):
        with open(PROCESSED_FILE, 'r') as f:
            processed = json.load(f)

    # Fetch CSV from the public URL
    print("📡 Fetching latest client requests from Google Sheets...")
    response = requests.get(CSV_URL)
    response.raise_for_status()
    
    lines = response.text.splitlines()
    reader = csv.DictReader(lines)
    
    new_processed = list(processed)
    for row in reader:
        # Create a unique ID for the row based on timestamp and email
        row_id = f"{row.get('Timestamp', '')}_{row.get('Contact Email', '')}"
        status = row.get('Status', '').lower()
        
        if row_id not in processed and status == 'pending':
            success = await process_request(row)
            if success:
                new_processed.append(row_id)
                
    # Save processed history
    with open(PROCESSED_FILE, 'w') as f:
        json.dump(new_processed, f)
    
    print("🏁 Check complete. Sleeping until next run.")

if __name__ == "__main__":
    asyncio.run(main())
