import { Controller, Get } from '@nestjs/common';

@Controller('jokes')
export class JokesController {
  @Get()
  getJokes() {
    return [
      { id: 1, content: 'Knock knock!', likes: 5 },
      { id: 2, content: 'Sana all!', likes: 10 }
    ];
  }
}
