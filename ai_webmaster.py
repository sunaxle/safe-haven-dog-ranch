import os
import csv
import json
import requests
import asyncio
import subprocess
import urllib.parse
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
            
            # Send completion directive to Sparky via Dropzone
            dropzone_path = "/Users/dr3/Library/CloudStorage/GoogleDrive-romerodeab@gmail.com/My Drive/Work/Agent Dropzone"
            payload = {
                "agent_task_package": {
                    "batch_id": f"completed_task_{req.get('Timestamp', '').replace(' ', '_')}",
                    "priority": "high",
                    "tasks": [
                        {
                            "task_id": 1,
                            "type": "update_csv_completed",
                            "target_project": "Safe Haven",
                            "description": "Sparky marks a Google Sheet request as Completed.",
                            "instructions": [
                                "echo '🚨 DIRECTIVE TO SPARKY 🚨'",
                                f"echo 'Sparky, the Webmaster just successfully fulfilled the request for {req.get('Target URL/Page', 'Unknown Page')} (Requested by {req.get('Client Name')}).'",
                                "echo 'Please open the Safe Haven Google Sheet and change Column G (Status) from Pending to Completed for this request!'",
                                "say 'Woof! The AI Webmaster finished a task. I am updating the Google Sheet to Completed!'"
                            ]
                        }
                    ]
                }
            }
            try:
                if os.path.exists(dropzone_path):
                    json_filename = os.path.join(dropzone_path, f"instruction_complete_{req.get('Timestamp', '').replace(' ', '_').replace(':', '')}.json")
                    with open(json_filename, 'w') as f:
                        json.dump(payload, f, indent=2)
                    print(f"📁 Dropped completion instruction for Sparky at {json_filename}")
            except Exception as dropzone_err:
                print(f"⚠️ Could not drop completion instruction for Sparky: {dropzone_err}")
                
            return True
    except Exception as e:
        print(f"❌ Error running agent: {e}")
        print("Generating Webmaster Push Request email...")
        subject = f"Webmaster Push Request: {req['Client Name']} ({req.get('Target URL/Page', 'General')})"
        body = f"The AI Webmaster encountered an error or a request too complex to fulfill.\n\nClient: {req['Client Name']}\nContact: {req.get('Contact Email', 'N/A')}\nTarget URL: {req.get('Target URL/Page', 'N/A')}\nChange Requested: {req.get('Change Requested', 'N/A')}\n\nError details: {e}\n\nPlease manually execute this request in the Antigravity codebase."
        mailto_url = f"mailto:romerodeab@gmail.com?subject={urllib.parse.quote(subject)}&body={urllib.parse.quote(body)}"
        subprocess.run(['open', mailto_url])
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
