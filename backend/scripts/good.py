import psycopg2, os
from dotenv import load_dotenv

load_dotenv("/home/noahsnoahs/StockSight/backend/.env")
conn = psycopg2.connect(os.environ["TIMESCALE_SERVICE_URL"])
cur = conn.cursor()

cur.execute("SELECT COUNT(*) FROM price_history;")
print("Rows in price_history:", cur.fetchone())

cur.execute("SELECT * FROM price_history LIMIT 5;")
for r in cur.fetchall():
    print(r)

cur.close()
conn.close()