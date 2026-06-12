import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CentrifugoService {
  async publish(data: any) {
    await axios.post(
      'http://localhost:8000/api',
      {
        method: 'publish',
        params: {
          channel: 'chat',
          data,
        },
      },
      {
        headers: {
          'X-API-Key': 'api_key',
        },
      },
    );
  }
}