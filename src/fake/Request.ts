import {FAKE_PATH, FAKE_METHOD} from './common/const'

function Request(method: string){
  return function (path: string){
    return function(target: any, propertyKey: string){
      Reflect.defineMetadata(FAKE_METHOD, method, target ,propertyKey)
      Reflect.defineMetadata(FAKE_PATH, path, target ,propertyKey)
    }
  }
}

export const Get = Request('Get')
export const Post = Request('Post')
// ....