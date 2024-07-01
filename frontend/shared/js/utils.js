export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export function round(value, precision = 2) {
    return Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);
}

export function approx_equals(value, comparison, tolerance = 0.05) {
    return Math.abs(value - comparison) < tolerance;
}

export function lerp(start, end, weight) {
    let total_distance = Math.abs(end - start);
    let completion = 0;
    
    if (total_distance != 0)
        completion = weight / total_distance;

    return start + completion * (end - start);
}