import asyncio
import json

from nats.aio.client import Client as NATS

class NatsClient:
    def __init__(self, servers=None):
        self.nc = NATS()
        self.servers = servers or ['nats://nats:4222']

    async def connect(self):
        await self.nc.connect(servers=self.servers)
        print("Connected to NATS")
    
    async def emit(self, subject: str, payload: dict):
        """Pubilsh a message to a subject"""
        data = json.dumps(payload).encode()
        await self.nc.publish(subject, data)
    
    async def send(self, subject: str, payload: dict, timeout=2):
        """Send a message and wait for a response"""
        data = json.dumps(payload).encode()
        msg = await self.nc.request(subject, data, timeout=timeout)
        response = json.loads(msg.data.decode())
        return response

    async def subscribe(self, subject: str, handler):
        """Subscribe in an event to handle messages"""
        async def wrapper(msg):
            data = json.loads(msg.data.decode())
            reply = await handler(data)
            if msg.reply:
                await self.nc.publish(msg.reply, json.dumps(reply).encode())

        await self.nc.subscribe(subject, cb=wrapper)
    
    def encode(self, data):
        return json.dumps(data).encode()

    async def drain(self):
        """Close connection in a clean way"""
        await self.nc.drain()
