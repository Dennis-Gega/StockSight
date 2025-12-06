import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

conn = psycopg2.connect(os.environ["TIMESCALE_SERVICE_URL"])
cur = conn.cursor()

cur.execute("SELECT NOW();")
print(cur.fetchone())
