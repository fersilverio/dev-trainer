import logging
import json

from nats.aio.client import Client as NATS
from nats.aio.errors import ErrNoServers, ErrTimeout, ErrConnectionClosed

# Configuração de logging mínima para ver o que está acontecendo.
logging.basicConfig(level=logging.INFO, format='%(asctime)s - NATS_CLIENT - %(levelname)s - %(message)s')

class NatsClient:
    def __init__(self, servers=None):
        self.nc = NATS()
        self.servers = servers or ['nats://nats:4222']

    async def connect(self):
        if self.nc.is_connected:
            logging.info(f"Já está conectado ao NATS em {self.nc.connected_url.netloc}.")
            return

        logging.info(f"Tentando conectar ao NATS em {self.servers}...")
        try:
            # A chamada `await self.nc.connect()` tentará se conectar.
            # A biblioteca tem reconexão automática por padrão.
            # Se esta chamada falhar na conexão inicial, ela levantará uma exceção.
            await self.nc.connect(servers=self.servers)
            logging.info(f"Conectado com sucesso ao NATS! Servidor conectado: {self.nc.connected_url.netloc}")
        except Exception as e:
            # Captura qualquer exceção durante a tentativa de conexão para logar
            # e depois re-levanta para que o chamador possa tratar.
            logging.error(f"Falha ao conectar ao NATS: {e}")
            raise # Importante: Re-levantar a exceção para o chamador.
    
    
    @property
    def is_connected(self) -> bool:
        """Retorna True se o cliente NATS estiver conectado, False caso contrário."""
        return self.nc.is_connected
    


    # --- Novos métodos para Request/Reply ---

    async def request(self, subject: str, payload: dict, timeout: float = 5.0):
        """
        Envia uma mensagem para um 'subject' e aguarda uma resposta (request-reply).
        Esta é a função para QUANDO ESTA API (white_api) QUER FAZER UMA PERGUNTA.

        Args:
            subject (str): O 'subject' (tópico) para o qual enviar a requisição.
            payload (dict): Os dados a serem enviados (serão convertidos para JSON).
            timeout (float, optional): Tempo em segundos para aguardar uma resposta. Padrão: 5.0.

        Returns:
            dict: A resposta recebida (convertida de JSON para dict).

        Raises:
            ConnectionError: Se o cliente não estiver conectado.
            nats.aio.errors.ErrTimeout: Se a resposta não for recebida dentro do tempo limite.
            json.JSONDecodeError: Se a resposta recebida não for um JSON válido.
            Exception: Outras exceções da biblioteca NATS ou de conexão.
        """
        if not self.is_connected:
            logging.error("Não conectado ao NATS. Não é possível enviar a requisição.")
            raise ConnectionError("Cliente NATS não está conectado.") # Ou uma exceção customizada

        logging.debug(f"Enviando requisição para '{subject}' com payload: {payload} (timeout: {timeout}s)")
        try:
            data_to_send = json.dumps(payload).encode('utf-8')
            # self.nc.request envia a mensagem e espera uma resposta no 'inbox' temporário que ele cria.
            response_msg = await self.nc.request(subject, data_to_send, timeout=timeout)
            logging.debug(f"Resposta recebida de '{subject}': {response_msg.data.decode('utf-8')[:100]}...") # Loga apenas parte da resposta
            
            # Decodifica a resposta de JSON para dict
            response_payload = json.loads(response_msg.data.decode('utf-8'))
            return response_payload
        except ErrTimeout:
            logging.warning(f"Timeout ({timeout}s) ao aguardar resposta de '{subject}'.")
            raise # Re-levanta ErrTimeout para o chamador tratar
        except json.JSONDecodeError as e:
            # Se a resposta não for um JSON válido
            logging.error(f"Erro ao decodificar resposta JSON de '{subject}': {e}. Dados recebidos: {response_msg.data.decode('utf-8') if 'response_msg' in locals() else 'N/A'}")
            raise
        except ErrConnectionClosed:
            logging.error(f"Conexão com NATS fechada ao tentar fazer request para '{subject}'.")
            raise
        except Exception as e:
            logging.error(f"Erro inesperado ao enviar requisição para '{subject}': {e}")
            raise

    async def subscribe(self, subject: str, user_request_handler: callable):
        """
        Subscreve a um 'subject' para receber mensagens de requisição e respondê-las.
        Esta é a função para QUANDO ESTA API (white_api) PRECISA RESPONDER A PERGUNTAS.

        Args:
            subject (str): O 'subject' (tópico) no qual escutar por requisições.
            user_request_handler (callable): Uma função assíncrona (async def) que será chamada
                                             com os dados da requisição (dict).
                                             Esta função DEVE retornar um dict que será o payload da resposta.
                                             Exemplo: async def meu_handler(dados_requisicao: dict) -> dict:
                                                         # processa dados_requisicao
                                                         return {"resultado": "processado"}

        Returns:
            nats.aio.client.Subscription: O objeto de subscrição, que pode ser usado para `unsubscribe`.

        Raises:
            ConnectionError: Se o cliente não estiver conectado.
            Exception: Outras exceções da biblioteca NATS durante a subscrição.
        """
        if not self.is_connected:
            logging.error(f"Não conectado ao NATS. Não é possível subscrever ao subject '{subject}'.")
            raise ConnectionError("Cliente NATS não está conectado.")

        async def internal_handler_wrapper(msg):
            logging.debug(f"Mensagem de requisição recebida em '{msg.subject}' (reply_to: '{msg.reply}')")
            
            if not msg.reply: # Se não houver um 'reply subject', não é uma requisição que espera resposta.
                logging.warning(f"Mensagem recebida em '{msg.subject}' sem 'reply subject'. Ignorando para fins de request/reply.")
                return

            try:
                # Decodifica os dados da mensagem de JSON para dict
                request_data = json.loads(msg.data.decode('utf-8'))
            except json.JSONDecodeError:
                logging.error(f"Erro ao decodificar JSON da requisição em '{msg.subject}'. Payload: {msg.data.decode('utf-8')[:100]}...")
                # Envia uma resposta de erro
                error_response_payload = {"error": "Payload da requisição inválido (não é JSON)."}
                await self.nc.publish(msg.reply, json.dumps(error_response_payload).encode('utf-8'))
                return

            try:
                # Chama o handler fornecido pelo usuário com os dados da requisição
                response_payload_from_handler = await user_request_handler(request_data)

                # O handler do usuário DEVE retornar um dicionário para ser a resposta.
                if isinstance(response_payload_from_handler, dict):
                    response_data_encoded = json.dumps(response_payload_from_handler).encode('utf-8')
                    await self.nc.publish(msg.reply, response_data_encoded)
                    logging.debug(f"Resposta enviada para '{msg.reply}' com payload: {response_payload_from_handler}")
                else:
                    logging.error(f"O 'user_request_handler' para '{msg.subject}' não retornou um dict. Retornou: {type(response_payload_from_handler)}. Nenhuma resposta enviada.")
                    
                    error_response_payload = {"error": "Erro interno do servidor ao processar a requisição (handler não retornou dict)."}
                    await self.nc.publish(msg.reply, json.dumps(error_response_payload).encode('utf-8'))

            except Exception as e:
                logging.error(f"Erro ao executar o 'user_request_handler' para o subject '{msg.subject}': {e}", exc_info=True)
                # Envia uma resposta de erro para o requisitante
                error_response_payload = {"error": "Erro interno do servidor ao processar a requisição.", "details": str(e)}
                try:
                    await self.nc.publish(msg.reply, json.dumps(error_response_payload).encode('utf-8'))
                except Exception as pub_err:
                    logging.error(f"Falha adicional ao tentar enviar resposta de erro para '{msg.reply}': {pub_err}")

        logging.info(f"Subscrevendo ao subject '{subject}' para responder a requisições.")
        try:
            # self.nc.subscribe registra o wrapper para ser chamado para cada mensagem no subject.
            subscription = await self.nc.subscribe(subject, cb=internal_handler_wrapper)
            return subscription # Retorna o objeto de subscrição
        except Exception as e:
            logging.error(f"Erro ao tentar subscrever (para replies) ao subject '{subject}': {e}")
            raise

