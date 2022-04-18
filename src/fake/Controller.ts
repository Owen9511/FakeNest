import {FAKE_BASE_PATH} from './common/const'

function Controller(path: string){
  return function(target: any){
    Reflect.defineMetadata(FAKE_BASE_PATH, path, target)
  }
}

export default Controller