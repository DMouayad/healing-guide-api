export const APP_ERR_CODES = {
	SERVER: "SERVER_ERROR",
	BAD_REQUEST: "BAD_REQUEST",
	ROUTE_NOT_FOUND: "ROUTE_NOT_FOUND",
	EMPTY_REQUEST_BODY: "EMPTY_REQUEST_BODY",
	INVALID_CONTENT_TYPE: "INVALID_CONTENT_TYPE",
	EXTERNAL: "EXTERNAL",
	FORBIDDEN: "FORBIDDEN",
	UNAUTHORIZED: "UNAUTHORIZED", // when a request doesn't have the right auth credentials
	INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
	VALIDATION: "VALIDATION",
	EMAIL_ALREADY_TAKEN: "EMAIL_ALREADY_TAKEN",
	ENTITY_NOT_FOUND: "ENTITY_NOT_FOUND",
	INVALID_PAT: "INVALID_PAT", // invalid personal access token
	TOKEN_EXPIRED: "TOKEN_EXPIRED",
	UNVERIFIED_EMAIL_OR_PHONE: "UNVERIFIED_EMAIL_OR_PHONE",
	UNVERIFIED_EMAIL_AND_PHONE: "UNVERIFIED_EMAIL_AND_PHONE",
} as const;

type ObjectValues<T> = T[keyof T];
export type AppErrCode = ObjectValues<typeof APP_ERR_CODES>;

// class ErrorsInfo {
//     DEV_IMPLEMENTATION: { description: 'Development implementation error', status: 500, code: 'DEV_IMPLEMENTATION_ERROR' },
//     NO_ARGUMENT: { description: 'Required arguments not supplied', status: 500, code: 'NO_ARGUMENT_ERROR' },
//     ARGUMENT_TYPE: { description: 'Wrong argument type', status: 500, code: 'ARGUMENT_TYPE_ERROR' },
//     ALERT: { message: 'Operation forbidden by security policy', status: 418, code: 'ALERT_ERROR' }, // hacker tryout case errors
//     SESSION_EXPIRED: { description: 'Session(refresh token) expired', status: 419, code: 'SESSION_EXPIRED_ERROR' },
//     INVALID_REFRESH_SESSION: { description: 'Invalid session. Wrong fingerprint', status: 401, code: 'INVALID_REFRESH_SESSION_ERROR' },
//     TOKEN_NOT_SIGNED: { description: 'Token not signed', status: 500, code: 'TOKEN_NOT_SIGNED_ERROR' },
//     TOKEN_VERIFY: { description: 'Token verify error', status: 401, code: 'TOKEN_VERIFY_ERROR' },
//     BAD_REFRESH_TOKEN: { description: 'Bad Refresh token', status: 401, code: 'BAD_REFRESH_TOKEN_ERROR' },
//     WRONG_RESET_PASSWORD_TOKEN: { description: 'Reset password token is not registered. Probably it already used', status: 401, code: 'WRONG_RESET_PASSWORD_TOKEN_ERROR' },
//     WRONG_EMAIL_CONFIRM_TOKEN: { description: 'Confirm email token is not registered. Probably it already used', status: 401, code: 'WRONG_EMAIL_CONFIRM_TOKEN_ERROR' },
//     PARSE_TOKEN: { description: 'Trying get data from access token. Something wrong', status: 401, code: 'PARSE_TOKEN_ERROR' },
//     SEND_EMAIL: { description: 'Send email error', status: 500, code: 'SEND_EMAIL_ERROR' },
//     NOT_FOUND: { description: 'Empty response, not found', status: 404, code: 'NOT_FOUND_ERROR' },
//     UNPROCESSABLE_ENTITY: { description: 'Unprocessable entity', status: 422, code: 'UNPROCESSABLE_ENTITY_ERROR' },
//     DB_DUPLICATE_CONFLICT: { description: 'Duplicate conflict. Resource already exists', status: 409, code: 'DB_DUPLICATE_CONFLICT_ERROR' },
//     DB_NOTNULL_CONFLICT: { description: 'Not null conflict', status: 500, code: 'DB_NOTNULL_CONFLICT_ERROR' },
//     DB: { description: 'Database error occurred', status: 500, code: 'DB_ERROR' }
// }
