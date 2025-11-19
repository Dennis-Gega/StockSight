import psycopg2
import os
from dotenv import load_dotenv
from pathlib import Path
from datetime import datetime, timedelta
from datetime import timezone

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(env_path)

conn = psycopg2.connect(os.getenv("TIMESCALE_SERVICE_URL"))
cur = conn.cursor()

symbol = "AAPL"
now = datetime.now(timezone.utc)

sample_rows = []

# generate 30 fake closing days
for i in range(30):
    t = now - timedelta(days=i)
    sample_rows.append((
        symbol,
        t,
        100 + i,     # open
        101 + i,     # high
        99 + i,      # low
        100.5 + i,   # close
        1000000      # volume
    ))

cur.executemany("""
    INSERT INTO price_history (symbol, time, open, high, low, close, volume)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    ON CONFLICT DO NOTHING;
""", sample_rows)

conn.commit()
print("Sample data inserted.")
