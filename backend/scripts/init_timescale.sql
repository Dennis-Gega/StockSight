CREATE EXTENSION IF NOT EXISTS timescaledb;

CREATE TABLE IF NOT EXISTS tickers (
  ticker TEXT PRIMARY KEY,
  name   TEXT,
  sector TEXT,
  industry TEXT,
  exchange TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS price_history (
  ticker   TEXT NOT NULL,
  ts       TIMESTAMPTZ NOT NULL,
  "open"   DOUBLE PRECISION,
  high     DOUBLE PRECISION,
  low      DOUBLE PRECISION,
  "close"  DOUBLE PRECISION,
  volume   BIGINT,
  interval TEXT NOT NULL,         -- '1d','1h', etc.
  PRIMARY KEY (ticker, ts, interval)
);
SELECT create_hypertable('price_history', 'ts', if_not_exists => TRUE);
