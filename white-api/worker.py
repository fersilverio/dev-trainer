import asyncio
import logging

from nats_client import NatsClient
from crew import TechTeam


def white_api_kickoff_handler (nats_payload: dict) -> dict:
    """
    Processes the request received via NATS for the TechTeam kickoff.
    This handler fits the contract of `NatsClient.subscribe_for_replies`.

    Args:
        nats_payload (dict): The NATS message payload, already as a dictionary.
                                     It is expected to contain the 'inputs' for the kickoff logic.

    Returns:
        dict: A dictionary with the result of the operation or an error dictionary.
    """

    
    inputs = {
        'language': 'Typescript',
        'framework': 'React JS',
        'project': 'Food Delivery Service'
    }

    #inputs = nats_payload

    if not inputs:
        logging.info("[WORKER - Handler] Empty payload received from NATS. Returning error or using defaults.")

        return {
            "error": "Inputs not provided",
            "message": "The NATS request payload was empty, but inputs are required for 'tech.team.kickoff'."
        }
    
    try:
        result = TechTeam().crew().kickoff(inputs=inputs)
        return result.json_dict

    except ValueError as ve:
        logging.error(f"[WORKER - Handler] Validation error in TechTeam logic: {ve}")
        return {
            "error": "Failed to validate inputs for TechTeam",
            "details": str(ve),
            "suggested_status_code": 400
        }
    except Exception as e:
        original_error_message = f"An error occurred while running the crew: {e}"
        logging.error(f"[WORKER - Handler] Exception in business logic: {original_error_message}")
        return {
            "error": "Error executing TechTeam kickoff",
            "details": original_error_message,
            "status": 500
        }

    

async def main():
    nats = NatsClient()
    await nats.connect()

    if nats.is_connected:
        listened_subject = "tech.team.kickoff"
        logging.info(f"[WORKER - Main] Configuring NATS listener for subject: {listened_subject}")

        await nats.subscribe(subject=listened_subject, user_request_handler=white_api_kickoff_handler)

        logging.info(f"[WORKER - Main] White API is listening on '{listened_subject}'.")

        # Keep the worker running to listen for messages
        try:
            while True:
                await asyncio.sleep(3600)
        except KeyboardInterrupt:
            logging.info("\n[WORKER - Main] Worker terminated by user.")
        finally:
            if nats.is_connected:
                logging.info("[WORKER - Main] Closing NATS connection...")
                await nats.nc.drain()
            logging.info("[WORKER - Main] Worker finished.")
    else:
        logging.info("[WORKER - Main] Could not connect to NATS. Worker not started.")

if __name__ == "__main__":
    asyncio.run(main())