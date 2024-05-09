import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './core/filters/all-exceptions.filter';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { setupSwagger } from './config/swagger.config';
import helmet from 'helmet';
import { SecurityHeadersMiddleware } from './core/middlewares/security_headers.middleware';
const PORT = process.env.PORT || 3001;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:5173'],
    credentials: true,
    optionsSuccessStatus: 200,
    preflightContinue: false, // enforce CORS policy consistently across the application's endpoints.
    methods: ['GET', 'POST', 'DELETE', 'PATCH'],
  });

  app.use(helmet()); // header security

  // security header middleware
  const securityHeadersMiddleware = new SecurityHeadersMiddleware();
  app.use(securityHeadersMiddleware.use.bind(securityHeadersMiddleware));

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  setupSwagger(app);

  app.listen(PORT).then(() => {
    console.log(`App running on port ${PORT}`)
  })
}
bootstrap();
