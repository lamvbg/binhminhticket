import { Test, TestingModule } from '@nestjs/testing';
import { CtvOrderController } from './ctv-order.controller';

describe('CtvOrderController', () => {
  let controller: CtvOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CtvOrderController],
    }).compile();

    controller = module.get<CtvOrderController>(CtvOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
