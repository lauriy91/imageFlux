import { Catch, ExceptionFilter, ArgumentsHost, HttpException, HttpStatus, NotFoundException } from "@nestjs/common";
import { Response, Request } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    } else if (exception instanceof NotFoundException) {
      status = HttpStatus.NOT_FOUND;
      message = "La tarea solicitada no existe.";
    } else if (exception instanceof TypeError) {
      status = HttpStatus.BAD_REQUEST;
      message = "Error en los datos enviados.";
    } else if (exception instanceof SyntaxError) {
      status = HttpStatus.BAD_REQUEST;
      message = "Error de sintaxis en la solicitud.";
    } else if (exception.code === "ECONNREFUSED") {
      status = HttpStatus.SERVICE_UNAVAILABLE;
      message = "Error de conexión a la base de datos.";
    } else if (exception.code === "ETIMEOUT") {
      status = HttpStatus.GATEWAY_TIMEOUT;
      message = "Error de tiempo de espera.";
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: message,
    });
  }
}
