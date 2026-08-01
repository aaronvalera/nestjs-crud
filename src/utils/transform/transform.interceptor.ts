import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';

export interface TransformedResponse<T = unknown> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<TransformedResponse> {
    const response = context.switchToHttp().getResponse<Response>();
    const statusCode = response.statusCode ?? 200;
    return next.handle().pipe(
      map((data: unknown) => ({
        statusCode,
        message: 'Success',
        data,
      })),
    );
  }
}
