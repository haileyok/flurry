export const usernameRegex = /^[a-zA-Z0-9_.]+$/;
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// SO https://stackoverflow.com/questions/106179/regular-expression-to-match-dns-hostname-or-ip-address
export const hostRegex =
  /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/;
