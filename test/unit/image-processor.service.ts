import * as fs from 'fs';
import { ImageProcessorService } from '../../src/domain/services/image-processor.service';

xdescribe('ImageProcessorService', () => {
  let service: ImageProcessorService;

  beforeEach(() => {
    service = new ImageProcessorService();
  });

  it('debe procesar una imagen y generar dos variantes', async () => {
    const testImagePath = 'src/tests/test-image.jpg';
    fs.writeFileSync(testImagePath, Buffer.alloc(100));

    const result = await service.processImage(testImagePath);

    expect(result).toHaveLength(2);
    expect(result[0].resolution).toBe('1024');
    expect(result[1].resolution).toBe('800');

    fs.unlinkSync(testImagePath);
  });
});
