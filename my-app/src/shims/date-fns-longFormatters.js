// Shim to provide a default export for AdapterDateFns which imports
// 'date-fns/_lib/format/longFormatters' as a default. The real file
// exports a named `longFormatters`, so we re-export it as default here.

// Import the actual implementation by absolute path to avoid triggering
// the alias mapping (which points AdapterDateFns -> this shim).
import { longFormatters } from '/Users/priyadharshini/Downloads/TS-app/my-app/node_modules/date-fns/_lib/format/longFormatters.js'

export default longFormatters
// Shim to satisfy imports for date-fns/_lib/format/longFormatters
// Re-export the ESM longFormatters implementation from date-fns package
export { default } from 'date-fns/esm/_lib/format/longFormatters/index.js';
