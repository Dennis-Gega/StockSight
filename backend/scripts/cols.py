import os, psycopg2
from dotenv import load_dotenv

load_dotenv("/home/noahsnoahs/StockSight/backend/.env")
conn = psycopg2.connect(os.environ["TIMESCALE_SERVICE_URL"])
cur = conn.cursor()
cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name='price_history';")
print(cur.fetchall())
