#include "indicators.hpp"
#include <cmath>
#include <algorithm>

// --- Advanced EMA (Double EMA option) ---
std::vector<double> ema(const std::vector<double>& x, int n, bool doubleEMA=false){
    std::vector<double> out(x.size(), NAN);
    if (n <= 0 || x.empty()) return out;

    double k = 2.0 / (n + 1.0);
    double e = x[0];
    out[0] = e;

    for (size_t i = 1; i < x.size(); ++i){
        e = x[i] * k + e * (1.0 - k);
        out[i] = e;
    }

    if(doubleEMA){
        // Calculate EMA of EMA
        std::vector<double> double_out(x.size(), NAN);
        double d = out[0];
        double_out[0] = d;
        for (size_t i=1; i<x.size(); ++i){
            d = out[i] * k + d * (1.0 - k);
            double_out[i] = d;
        }
        return double_out;
    }

    return out;
}

// --- Smoothed / Wilder's RSI ---
std::vector<double> rsi(const std::vector<double>& c, int n, bool wilder=false){
    std::vector<double> out(c.size(), NAN);
    if (c.size() < 2 || n <= 0) return out;

    double gain=0, loss=0;
    for (int i=1; i<=n && i<(int)c.size(); ++i){
        double ch = c[i] - c[i-1];
        if (ch > 0) gain += ch;
        else loss -= ch;
    }

    double avgG = gain/n, avgL = loss/n;

    for (size_t i = n; i < c.size(); ++i){
        if (i > n){
            double ch = c[i] - c[i-1];
            double g = ch>0 ? ch : 0;
            double l = ch<0 ? -ch : 0;

            if(wilder){
                avgG = (avgG*(n-1)+g)/n;
                avgL = (avgL*(n-1)+l)/n;
            } else{
                avgG = (avgG*(n-1)+g)/n;
                avgL = (avgL*(n-1)+l)/n;
            }
        }

        double rs = (avgL == 0) ? INFINITY : avgG/avgL;
        out[i] = 100.0 - (100.0/(1.0+rs));
    }

    return out;
}

// --- Advanced MACD (adaptive + double EMA option) ---
MACD macd(const std::vector<double>& c, int fast, int slow, int sig, bool doubleEMA=false){
    MACD m;
    if (c.empty()) return m;

    auto emaF = ema(c, fast, doubleEMA);
    auto emaS = ema(c, slow, doubleEMA);

    size_t n = c.size();
    m.macd.resize(n, NAN);
    m.signal.resize(n, NAN);
    m.hist.resize(n, NAN);

    for (size_t i=0; i<n; ++i){
        if (!std::isnan(emaF[i]) && !std::isnan(emaS[i]))
            m.macd[i] = emaF[i] - emaS[i];
    }

    m.signal = ema(m.macd, sig, doubleEMA);

    for (size_t i=0; i<n; ++i){
        if (!std::isnan(m.macd[i]) && !std::isnan(m.signal[i]))
            m.hist[i] = m.macd[i] - m.signal[i];
    }

    return m;
}

// --- Trend detection helper (optional) ---
std::vector<int> trendDirection(const std::vector<double>& series, int window=3){
    // +1 = uptrend, -1 = downtrend, 0 = flat
    std::vector<int> trend(series.size(), 0);
    for(size_t i=window; i<series.size(); ++i){
        double diff = series[i] - series[i-window];
        trend[i] = (diff > 0) ? 1 : (diff < 0 ? -1 : 0);
    }
    return trend;
}

// --- Momentum score helper ---
std::vector<double> momentum(const std::vector<double>& series, int window=3){
    std::vector<double> mom(series.size(), NAN);
    for(size_t i=window; i<series.size(); ++i){
        mom[i] = series[i] - series[i-window];
    }
    return mom;
}


BB bollinger(const std::vector<double>& c, int period, double k){
    BB b;
    size_t n = c.size();
    b.upper.resize(n, NAN);
    b.middle.resize(n, NAN);
    b.lower.resize(n, NAN);

    if (n < period) return b;

    for (size_t i = period - 1; i < n; ++i){
        double sum = 0, sumsq = 0;

        for (int j=0; j<period; ++j){
            double v = c[i-j];
            sum += v;
            sumsq += v*v;
        }

        double mean = sum / period;
        double var = (sumsq / period) - mean*mean;
        double sd = std::sqrt(std::max(0.0, var));

        b.middle[i] = mean;
        b.upper[i] = mean + k*sd;
        b.lower[i] = mean - k*sd;
    }
    return b;
}
