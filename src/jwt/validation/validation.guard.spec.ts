import { ValidationGuard } from './validation.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('ValidationGuard', () => {
  let jwtService: JwtService;
  let configService: ConfigService;
  let guard: ValidationGuard;

  beforeEach(() => {
    jwtService = new JwtService({
      secret: 'test-secret',
      signOptions: { expiresIn: '100d' },
    });
    configService = new ConfigService();
    guard = new ValidationGuard(jwtService, configService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
