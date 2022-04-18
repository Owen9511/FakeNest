import {FAKE_BASE_PATH, FAKE_METHOD, FAKE_PATH, FAKE_INJECTABLE_WATERMARK} from './common/const'
import express, { Express } from 'express'

class FakeFactory {
  private app: Express
  private types: Record<string, any>

  constructor(){
    // 实例化Express
    this.app = express()
    // types将缓存所有Provider，保证其只被实例化一次
    this.types = {}
  }

  // 调用该方法以注册所需信息至Express实例并返回
  create(module: any): Express{
    // 获取Module中注册的Controllers
    const Controllers = Reflect.getMetadata('controllers', module)
    this.initControllers(Controllers)
    // 返回Express实例
    return this.app
  }

  // 初始化所有Controllers
  initControllers(Controllers: any[]): void{
    Controllers.forEach((Controller: any) => {
      // 获取constructor所需provider
      const paramtypes = Reflect.getMetadata('design:paramtypes', Controller)
      // 不考虑provider需要注入的情况
      const args = paramtypes.map((Type: any) => {
        // 若未被Injectable装饰则报错
        if(!Reflect.getMetadata(FAKE_INJECTABLE_WATERMARK, Type)){
          throw new Error(`${Type.name} is not injectable!`)
        }
        // 返回缓存的type或新建type（只初始化一个Type实例）
        return this.types[Type.name] ?
          this.types[Type.name] :
          this.types[Type.name] = new Type()
      })
      const controller = new Controller(...args)
      // 获取该Controller根路径
      const basePath = Reflect.getMetadata(FAKE_BASE_PATH, Controller)
      // 初始化路由
      this.initRoute(controller, basePath)
    });
  }

  // 初始化一个controller实例上所有的监听方法
  initRoute(controller: any, basePath: string): void{
    // 获取Controller上的所有方法名
    const proto = Reflect.getPrototypeOf(controller) 
    if(!proto){
      return
    }
    const methodsNames = Object.getOwnPropertyNames(proto)
      .filter(item => item !== 'constructor' && typeof proto[item] === 'function')

    methodsNames.forEach(methodName => {
      const fn = proto[methodName]
      // 取出定义的 metadata
      const method = Reflect.getMetadata(FAKE_METHOD, controller, methodName)
      const path = Reflect.getMetadata(FAKE_PATH, controller, methodName)
      // 忽略未装饰方法
      if(!method || !path){
        return
      }
      // 构造并注册路由
      const route = {
        path: basePath + path,
        method: method.toLowerCase(),
        fn: fn.bind(controller)
      }
      this.registerRoute(route)
    })
  }

  registerRoute(route: {path: string, method: string, fn: Function}): void{
    const {path, method, fn} = route
    // Express实例上注册路由
    this.app[method](path, (req: any, res: any) => { 
      res.send(fn(req))
    })
  }
}

export default new FakeFactory()


// import express from 'express'

// const app = express()
// const port = 3000

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })