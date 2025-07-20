import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { NatsService } from "./nats.service";

@Module({
    providers: [NatsService],
    imports: [
        ClientsModule.register([
            {
                name: 'NATS_SERVICE',
                transport: Transport.NATS,
                options: {
                    servers: process.env.NATS_URL,
                }
            }
        ])
    ],
    exports: [
        ClientsModule.register([
            {
                name: 'NATS_SERVICE',
                transport: Transport.NATS,
                options: {
                    servers: process.env.NATS_URL,
                }
            }
        ]),
        NatsService,
    ],
})
export class NatsClientModule { }