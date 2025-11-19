#include "indicators.hpp"
#include <cmath>
#include <algorithm>

std::vector<double> ema(const std::vector<double>& x, int n){
    std::vector<double> out(x.size(), NAN);
    if (n <= 0 || x.empty()) return out;
    double k = 2.0 / (n + 1.0);
    double e = x[0];
    out[0] = e;

    for (size_t i = 1; i < x.size(); ++i){
        e = x[i] * k + e * (1.0 - k);
        out[i] = e;
    }
    return out;
}

std::vector<double> rsi(const std::vector<double>& c, int n){
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
            avgG = (avgG*(n-1)+g)/n;
            avgL = (avgL*(n-1)+l)/n;
        }

        double rs = (avgL == 0) ? INFINITY : avgG/avgL;
        out[i] = 100.0 - (100.0/(1.0+rs));
    }
    return out;
}

MACD macd(const std::vector<double>& c, int fast, int slow, int sig){
    MACD m;
    if (c.empty()) return m;

    auto emaF = ema(c, fast);
    auto emaS = ema(c, slow);

    size_t n = c.size();
    m.macd.resize(n, NAN);

    for (size_t i=0; i<n; ++i){
        if (!std::isnan(emaF[i]) && !std::isnan(emaS[i]))
            m.macd[i] = emaF[i] - emaS[i];
    }

    m.signal = ema(m.macd, sig);
    m.hist.resize(n, NAN);

    for (size_t i=0; i<n; ++i){
        if (!std::isnan(m.macd[i]) && !std::isnan(m.signal[i]))
            m.hist[i] = m.macd[i] - m.signal[i];
    }

    return m;
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
