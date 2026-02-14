import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('healthz')
  healthz() {
    return { status: 'ok' };
  }

  @Get('readyz')
  readyz() {
    return { ready: true };
  }

  @Get('metrics')
  metrics() {
    return '# Prometheus placeholder\n';
  }
}
