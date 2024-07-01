export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export function round(value, precision = 2) {
    return Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);
}