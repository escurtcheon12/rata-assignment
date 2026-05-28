// import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
// import {
//   SuperLogger,
//   SuperHelper,
//   RequestLog,
// } from '@super-library/super-shared';
// import { isFunction, isObject } from '@nestjs/common/utils/shared.utils';

// @Catch()
// export class RestExceptionFilter implements ExceptionFilter {
//   constructor(
//     private readonly logger: SuperLogger,
//     private readonly loggerHelper: SuperHelper,
//   ) {}

//   catch(exception: any, host: ArgumentsHost) {
//     const context = host.switchToHttp();
//     const response = context.getResponse();
//     const request = context.getRequest();

//     //set default error message & error code
//     let statusCode = 500;
//     let message = exception.message ?? 'unkonwn error';
//     let errorCode = statusCode.toString();

//     if (isFunction(exception?.getStatus)) {
//       // Hanlde Throw Exception
//       statusCode = exception.getStatus();
//       errorCode = statusCode.toString();

//       //Ovverride error message & error code if it has custom function
//       if (isFunction(exception.getResponse)) {
//         const exceptionRes = exception?.getResponse();
//         if (isObject(exceptionRes)) {
//           if (exceptionRes['code']) {
//             errorCode = exceptionRes['code'];
//           }
//           if (exceptionRes['message']) {
//             message = Array.isArray(exceptionRes['message'])
//               ? exceptionRes['message'][0]
//               : exceptionRes['message'];
//           }
//         }
//       }
//     } else {
//       statusCode = exception.code ?? 500;
//       // check statusCode is number or not
//       if (isNaN(statusCode)) {
//         statusCode = 500;
//       }
//       errorCode = statusCode.toString();
//       if (isFunction(exception?.bags) && exception.bags.length > 0) {
//         errorCode = 'DTO-001'; // Error Code for DTO Validation
//         message = exception.bags[0];
//       }
//     }

//     const urlSplit = request.url.split('/');
//     const methodName = urlSplit[urlSplit.length - 1];
//     const req: RequestLog = {
//       method: request.method,
//       url: request.url,
//       headers: request.headers,
//       body: request.body,
//       params: request.params,
//       query: request.query,
//     };

//     const res = {
//       status_code: statusCode,
//       error_code: errorCode,
//       timestamp: new Date().toISOString(),
//       path: request.url,
//       message,
//     };
//     this.logger.fromTransport('HTTP', 'error', req, res, methodName, exception);

//     response.status(statusCode).send({ ...res });
//   }
// }
