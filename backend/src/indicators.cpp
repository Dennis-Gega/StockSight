#include "indicators.hpp"
#include <cmath>
#include <algorithm>

// Internal helpers with extra options
namespace {
    std::vector<double> ema_internal(const std::vector<double>& x, int n, bool doubleEMA) {
        std::vector<double> out(x.size(), NAN);
        if (n <= 0 || x.empty()) return out;

        double k = 2.0 / (n + 1.0);
        double e = x[0];
        out[0] = e;

        for (size_t i = 1; i < x.size(); ++i) {
            e = x[i] * k + e * (1.0 - k);
            out[i] = e;
        }

        if (doubleEMA) {
            // EMA of EMA
            std::vector<double> double_out(x.size(), NAN);
            double d = out[0];
            double_out[0] = d;
            for (size_t i = 1; i < x.size(); ++i) {
                d = out[i] * k + d * (1.0 - k);
                double_out[i] = d;
            }
            return double_out;
        }

        return out;
    }

    std::vector<double> rsi_internal(const std::vector<double>& c, int n, bool wilder) {
        std::vector<double> out(c.size(), NAN);
        if (c.size() < 2 || n <= 0) return out;

        double gain = 0.0, loss = 0.0;
        for (int i = 1; i <= n && i < (int)c.size(); ++i) {
            double ch = c[i] - c[i - 1];
            if (ch > 0) gain += ch;
            else        loss -= ch;
        }

        double avgG = gain / n;
        double avgL = loss / n;

        for (size_t i = n; i < c.size(); ++i) {
            if (i > (size_t)n) {
                double ch = c[i] - c[i - 1];
                double g = ch > 0 ? ch : 0.0;
                double l = ch < 0 ? -ch : 0.0;

                if (wilder) {
                    // Wilder smoothing
                    avgG = (avgG * (n - 1) + g) / n;
                    avgL = (avgL * (n - 1) + l) / n;
                } else {
                    // Simple smoothed RSI (same formula here, but you could change it)
                    avgG = (avgG * (n - 1) + g) / n;
                    avgL = (avgL * (n - 1) + l) / n;
                }
            }

            double rs = (avgL == 0.0) ? INFINITY : avgG / avgL;
            out[i] = 100.0 - (100.0 / (1.0 + rs));
        }

        return out;
    }

    MACD macd_internal(const std::vector<double>& c,
                       int fast, int slow, int sig,
                       bool doubleEMA) {
        MACD m;
        if (c.empty()) return m;

        auto emaF = ema_internal(c, fast, doubleEMA);
        auto emaS = ema_internal(c, slow, doubleEMA);

        size_t n = c.size();
        m.macd.assign(n, NAN);
        m.signal.assign(n, NAN);
        m.hist.assign(n, NAN);

        for (size_t i = 0; i < n; ++i) {
            if (!std::isnan(emaF[i]) && !std::isnan(emaS[i])) {
                m.macd[i] = emaF[i] - emaS[i];
            }
        }

        m.signal = ema_internal(m.macd, sig, doubleEMA);

        for (size_t i = 0; i < n; ++i) {
            if (!std::isnan(m.macd[i]) && !std::isnan(m.signal[i])) {
                m.hist[i] = m.macd[i] - m.signal[i];
            }
        }

        return m;
    }
} // namespace

// === Public API matching indicators.hpp ===

// Simple EMA as declared in the header
std::vector<double> ema(const std::vector<double>& x, int n) {
    return ema_internal(x, n, false);
}

// RSI with signature from the header
std::vector<double> rsi(const std::vector<double>& c, int n) {
    // pick whether you want Wilder's style (true) or simple (false)
    return rsi_internal(c, n, true);
}

// MACD with signature from the header
MACD macd(const std::vector<double>& c, int fast, int slow, int sig) {
    // use normal EMA for MACD; set to true if you want double EMA behaviour
    return macd_internal(c, fast, slow, sig, false);
}

// Bollinger Bands (unchanged)
BB bollinger(const std::vector<double>& c, int period, double k) {
    BB b;
    size_t n = c.size();
    b.upper.assign(n, NAN);
    b.middle.assign(n, NAN);
    b.lower.assign(n, NAN);

    if (n < (size_t)period) return b;

    for (size_t i = period - 1; i < n; ++i) {
        double sum = 0.0, sumsq = 0.0;

        for (int j = 0; j < period; ++j) {
            double v = c[i - j];
            sum += v;
            sumsq += v * v;
        }

        double mean = sum / period;
        double var = (sumsq / period) - mean * mean;
        double sd = std::sqrt(std::max(0.0, var));

        b.middle[i] = mean;
        b.upper[i]  = mean + k * sd;
        b.lower[i]  = mean - k * sd;
    }

    return b;
}
