import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

conn = psycopg2.connect(os.environ["TIMESCALE_SERVICE_URL"])
cur = conn.cursor()

cur.execute("""
    SELECT ticker, ts, open, close, volume
    FROM price_history
    ORDER BY ts DESC
    LIMIT 5;
""")

rows = cur.fetchall()

for r in rows:
    print(r)

cur.close()
conn.close()
