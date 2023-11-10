let timeout: any;
/**
 * The debounce function is used to limit the frequency of function calls by
 * delaying the execution until a certain amount of time has passed without any
 * further function calls.
 * @param func - The `func` parameter is the function that you want to debounce. It
 * is the function that will be called after the debounce period has passed.
 * @param wait - The `wait` parameter is the amount of time in milliseconds that
 * the function should wait before executing.
 * @param [immediate=false] - The `immediate` parameter is a boolean value that
 * determines whether the function should be called immediately or after the
 * specified `wait` time has passed. If `immediate` is set to `true`, the function
 * will be called immediately and then debounced. If `immediate` is set to
 * @returns The debounce function is returning a new function that will be executed
 * when called.
 */

export default function debounce (func: any, wait: any, immediate = false) {
  console.log('debouncing');
  return () => {
    const context = null;
    const args = arguments;
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
