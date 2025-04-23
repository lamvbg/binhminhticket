import { Test, TestingModule } from '@nestjs/testing';
import { CtvOrderService } from './ctv-order.service';

describe('CtvOrderService', () => {
  let service: CtvOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CtvOrderService],
    }).compile();

    service = module.get<CtvOrderService>(CtvOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
