import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { join } from 'path';

type CentrifugoApiClient = {
  publish: (
    req: { channel: string; data: Buffer },
    metadata: grpc.Metadata,
    cb: (err: grpc.ServiceError | null, res: { error?: { code: number; message: string } }) => void,
  ) => void;
};

@Injectable()
export class CentrifugoService implements OnModuleInit, OnModuleDestroy {
  private client: CentrifugoApiClient;
  private metadata = new grpc.Metadata();

  onModuleInit() {
    const protoPath = join(__dirname, 'proto', 'api.proto');

    const packageDef = protoLoader.loadSync(protoPath, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });

    const proto = grpc.loadPackageDefinition(packageDef) as any;
    const CentrifugoApi = proto.centrifugal.centrifugo.api.CentrifugoApi;

    this.client = new CentrifugoApi(
      'localhost:10000',
      grpc.credentials.createInsecure(),
    );

    this.metadata.set('authorization', 'apikey api_key');
  }

  publish(channel: string, data: unknown): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(
        {
          channel,
          data: Buffer.from(JSON.stringify(data)),
        },
        this.metadata,
        (err, res) => {
          if (err) return reject(err);
          if (res?.error?.code) {
            return reject(new Error(`${res.error.code}: ${res.error.message}`));
          }
          resolve();
        },
      );
    });
  }

  onModuleDestroy() {
    (this.client as any).close?.();
  }
}
