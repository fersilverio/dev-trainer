import asyncio
import json

from nats.aio.client import Client as NATS
from nats_client import NatsClient
from crew import TechTeam


def run():
    inputs = {
        'language': 'Typescript',
        'framework': 'React JS',
        'project': 'Food Delivery Service'
    }
    
    try:
        result = TechTeam().crew().kickoff(inputs=inputs)

        return result

    except Exception as e:
        raise Exception(f"An error occurred while running the crew: {e}")
	

async def main():
    nats = NatsClient()
    await nats.connect()

    async def handler(msg):
        print("Cheguei aqui no handler do white api entrada")
        result = run()
        await msg.respond(nats.encode(result))
    
    await nats.subscribe("tech.team.kickoff", handler)
    print("Python service listening on 'tech.team.kickoff'...")

    # Keep the service running
    while True:
        await asyncio.sleep(1)

asyncio.run(main())
