export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export function round(value, precision = 2) {
    return Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);
}

export function approx_equals(value, comparison, tolerance = 0.05) {
    return Math.abs(value - comparison) < tolerance;
}