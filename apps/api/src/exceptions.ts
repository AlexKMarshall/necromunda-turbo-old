export class ApplicationException extends Error {}

type HTTPStatusCode = 400 | 401 | 403 | 404 | 409

export class UserFacingException extends ApplicationException {
  constructor(status: HTTPStatusCode, message?: string) {
    super(message)
  }
}

export class ResourceConflictException extends UserFacingException {
  constructor(message?: string) {
    super(409, message)
  }
}
