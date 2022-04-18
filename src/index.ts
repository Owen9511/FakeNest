import 'reflect-metadata'

// import { NestFactory } from '@nestjs/core';
// import { Module, Controller, Get, Injectable } from '@nestjs/common'

import { FakeFactory, Module, Controller, Get, Injectable } from './fake'

// Service
@Injectable()
export class CatsService {
  private readonly cats: string[] = ['Lucy', 'Ketty'];

  hello(): string{
    return this.cats.join(',') + ' meow'
  }
}

// Controller
@Controller('/cats')
class CatsController{
  constructor(private catsService: CatsService) {}

  @Get('/hello')
  hello(){
    return this.catsService.hello()
  }
}


// Module
@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}

// Start
async function bootstrap() {
  // const app = await NestFactory.create(CatsModule);
  const app = await FakeFactory.create(CatsModule);
  await app.listen(3000);
  console.log("Server is listening on port 3000!")
}
bootstrap();