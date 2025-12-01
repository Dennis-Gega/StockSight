import psycopg2
import os
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(env_path)

conn = psycopg2.connect(os.getenv("TIMESCALE_SERVICE_URL"))
cur = conn.cursor()

cur.execute("""
    CREATE TABLE IF NOT EXISTS price_history (
        symbol TEXT NOT NULL,
        time TIMESTAMPTZ NOT NULL,
        open DOUBLE PRECISION,
        high DOUBLE PRECISION,
        low DOUBLE PRECISION,
        close DOUBLE PRECISION,
        volume BIGINT,
        PRIMARY KEY(symbol, time)
    );
""")

cur.execute("SELECT create_hypertable('price_history', 'time', if_not_exists => TRUE);")

conn.commit()
print("Table created.")
