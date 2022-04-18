import { FAKE_INJECTABLE_WATERMARK } from './common/const'

function Injectable() {
  return (target: any) => {
    Reflect.defineMetadata(FAKE_INJECTABLE_WATERMARK, true, target);
  };
}

export default Injectable;