import os
import psycopg2
from dotenv import load_dotenv

# Load the backend .env explicitly
load_dotenv(dotenv_path="/home/noahsnoahs/StockSight/backend/.env")

print("TIMESCALE_SERVICE_URL =", os.environ.get("TIMESCALE_SERVICE_URL"))

conn = psycopg2.connect(os.environ["TIMESCALE_SERVICE_URL"])
cur = conn.cursor()
cur.execute("SELECT NOW();")
print(cur.fetchone())

cur.close()
conn.close()
