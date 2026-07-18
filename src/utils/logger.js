// Logger utility for consistent logging
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function timestamp() {
  return new Date().toISOString();
}

function info(message, data = null) {
  const log = `${colors.cyan}[${timestamp()}] [INFO]${colors.reset} ${message}`;
  if (data) {
    console.log(log, data);
  } else {
    console.log(log);
  }
}

function success(message, data = null) {
  const log = `${colors.green}[${timestamp()}] [SUCCESS]${colors.reset} ${message}`;
  if (data) {
    console.log(log, data);
  } else {
    console.log(log);
  }
}

function warning(message, data = null) {
  const log = `${colors.yellow}[${timestamp()}] [WARNING]${colors.reset} ${message}`;
  if (data) {
    console.warn(log, data);
  } else {
    console.warn(log);
  }
}

function error(message, err = null) {
  const log = `${colors.red}[${timestamp()}] [ERROR]${colors.reset} ${message}`;
  if (err) {
    console.error(log);
    console.error(err);
  } else {
    console.error(log);
  }
}

function debug(message, data = null) {
  if (process.env.DEBUG === 'true') {
    const log = `${colors.magenta}[${timestamp()}] [DEBUG]${colors.reset} ${message}`;
    if (data) {
      console.log(log, data);
    } else {
      console.log(log);
    }
  }
}

function http(method, path, status) {
  const statusColor =
    status >= 400 ? colors.red : status >= 300 ? colors.yellow : colors.green;
  const log = `${colors.blue}[${timestamp()}] [HTTP]${colors.reset} ${statusColor}${method.padEnd(
    6
  )} ${path} ${status}${colors.reset}`;
  console.log(log);
}

module.exports = {
  info,
  success,
  warning,
  error,
  debug,
  http,
};
