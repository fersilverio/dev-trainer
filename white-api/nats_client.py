import logging
import json
import os

from nats.aio.client import Client as NATS
from nats.aio.errors import ErrTimeout, ErrConnectionClosed
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO, format='%(asctime)s - NATS_CLIENT - %(levelname)s - %(message)s')

class NatsClient:
    def __init__(self, servers=None):
        self.nc = NATS()
        self.servers = servers or [os.getenv("NATS_URL")]

    async def connect(self):
        if self.nc.is_connected:
            logging.info(f"NATS connected at {self.nc.connected_url.netloc}.")
            return

        logging.info(f"Trying to connect NATS at {self.servers}...")
        
        try:
            await self.nc.connect(servers=self.servers)
            logging.info(f"Successfully connect to NATS! Server connected: {self.nc.connected_url.netloc}")
        except Exception as e:
            logging.error(f"Connection failed to NATS: {e}")
            raise
    
    
    @property
    def is_connected(self) -> bool:
        # return true if client connected false otherwise
        return self.nc.is_connected
    
    
    
    """
       Send message to a 'subject' and wait for response (request-reply).

        Args:
            subject (str): O 'subject' (topic) to send request.
            payload (dict): data to be sent (JSON parsed).
            timeout (float, optional): Time in seconds for delay. Default: 5.0.

        Returns:
            dict: The given response (JSON to dict converted).

        Raises:
            ConnectionError: If client is not connected.
            nats.aio.errors.ErrTimeout: If takes too long to respond.
            json.JSONDecodeError: If response is not a valid JSON.
            Exception: Other exceptions.
    """
    
    async def request(self, subject: str, payload: dict, timeout: float = 5.0):
        
        if not self.is_connected:
            logging.error("NATS not connected. Unable to send request.")
            raise ConnectionError("NATS client not connected.")

        logging.debug(f"Sending request to '{subject}' with payload: {payload} (timeout: {timeout}s)")

        try:
            data_to_send = json.dumps(payload).encode('utf-8')
            response_msg = await self.nc.request(subject, data_to_send, timeout=timeout)
            
            logging.debug(f"Response received from '{subject}': {response_msg.data.decode('utf-8')[:100]}...")
            
            response_payload = json.loads(response_msg.data.decode('utf-8'))
            
            return response_payload
        
        except ErrTimeout:
            logging.warning(f"Timeout ({timeout}s) waiting for '{subject}' response.")
            raise
        except json.JSONDecodeError as e:
            logging.error(f"Error decoding JSON response from '{subject}': {e}. Received data: {response_msg.data.decode('utf-8') if 'response_msg' in locals() else 'N/A'}")
            raise
        except ErrConnectionClosed:
            logging.error(f"NATS connection closed when trying to make a request to '{subject}'.")
            raise
        except Exception as e:
            logging.error(f"Unexpected error sending request to '{subject}': {e}")
            raise

    async def subscribe(self, subject: str, user_request_handler: callable):
        """
        Subscribe to a'subject' to receive requests and repl them.
        
        Args:
            subject (str): The 'subject' that will listen requests.
            user_request_handler (callable): Async function (async def) that will be called
                                             with request data (dict).
                                             Should return a dict that will be response payload.
        Raises:
            ConnectionError: If client is not connected.
            Exception: Other exceptions.
        """
        if not self.is_connected:
            logging.error(f"Not connected to NATS. Cannot subscribe to subject '{subject}'.")
            raise ConnectionError("NATS client is not connected.")

        async def internal_handler_wrapper(msg):
            logging.debug(f"Request message received on '{msg.subject}' (reply_to: '{msg.reply}')")
            
            if not msg.reply:
                logging.warning(f"Message received on '{msg.subject}' without 'reply subject'. Ignoring for request/reply purposes.")
                return

            try:
                request_data = json.loads(msg.data.decode('utf-8'))
            except json.JSONDecodeError:
                logging.error(f"Error decoding JSON from request on '{msg.subject}'. Payload: {msg.data.decode('utf-8')[:100]}...")
                error_response_payload = {"error": "Invalid request payload (not JSON)."}
                await self.nc.publish(msg.reply, json.dumps(error_response_payload).encode('utf-8'))
                return

            try:
                response_payload_from_handler = user_request_handler(request_data)

                if type(response_payload_from_handler) == dict:
                    response_payload_from_handler.update( { "status" : 200 } )
                    response_data_encoded = json.dumps(response_payload_from_handler).encode('utf-8')
                    
                    await self.nc.publish(msg.reply, response_data_encoded)
                    logging.debug(f"Response sent to '{msg.reply}' with payload: {response_payload_from_handler}")
                else:
                    logging.error(f"The 'user_request_handler' for '{msg.subject}' did not return a dict. Returned: {type(response_payload_from_handler)}. No response sent.")
                    
                    error_response_payload = {"error": "Internal server error while processing the request (handler did not return dict)."}
                    await self.nc.publish(msg.reply, json.dumps(error_response_payload).encode('utf-8'))

            except Exception as e:
                logging.error(f"Error executing 'user_request_handler' for subject '{msg.subject}': {e}", exc_info=True)
                error_response_payload = {"error": "Internal server error while processing the request.", "details": str(e), "status": 500}
                try:
                    await self.nc.publish(msg.reply, json.dumps(error_response_payload).encode('utf-8'))
                except Exception as pub_err:
                    logging.error(f"Additional failure when trying to send error response to '{msg.reply}': {pub_err}")

        logging.info(f"Subscribing to subject '{subject}' to respond to requests.")
        try:
            subscription = await self.nc.subscribe(subject, cb=internal_handler_wrapper)
            return subscription
        except Exception as e:
            logging.error(f"Error trying to subscribe (for replies) to subject '{subject}': {e}")
            raise

