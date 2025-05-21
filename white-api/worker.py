import asyncio
import logging

from nats_client import NatsClient
from crew import TechTeam


def white_api_kickoff_handler (nats_payload: dict) -> dict:
    """
    Processa a requisição recebida via NATS para o kickoff da TechTeam.
    Este handler se encaixa no contrato de `NatsClient.subscribe_for_replies`.

    Args:
        payload_recebido_do_nats (dict): O payload da mensagem NATS, já como um dicionário.
                                         Espera-se que contenha os 'inputs' para a lógica de kickoff.

    Returns:
        dict: Um dicionário com o resultado da operação ou um dicionário de erro.
    """

    
    # inputs = {
    #     'language': 'Typescript',
    #     'framework': 'React JS',
    #     'project': 'Food Delivery Service'
    # }

    inputs = nats_payload

    if not inputs:
        logging.info("[WORKER - Handler] Payload vazio recebido do NATS. Retornando erro ou usando defaults.")

        return {
            "error": "Inputs não fornecidos",
            "message": "O payload da requisição NATS estava vazio, mas são necessários inputs para 'tech.team.kickoff'."
        }
    
    try:
        result = TechTeam().crew().kickoff(inputs=inputs)

        return result

    except ValueError as ve: # Captura erros de validação da sua lógica de negócios
        logging.error(f"[WORKER - Handler] Erro de validação na lógica de TechTeam: {ve}")
        return {
            "error": "Falha na validação dos inputs para TechTeam",
            "details": str(ve),
            "status_code_sugerido": 400 # Bad Request
        }
    except Exception as e:
        # Este é o ponto onde a sua função `run()` original faria:
        # raise Exception(f"An error occurred while running the crew: {e}")
        # Como o `user_request_handler` deve retornar um dict, formatamos o erro aqui.
        mensagem_de_erro_original = f"An error occurred while running the crew: {e}"
        logging.error(f"[WORKER - Handler] Exceção na lógica de negócios: {mensagem_de_erro_original}")
        return {
            "error": "Erro na execução do kickoff da TechTeam",
            "details": mensagem_de_erro_original, # Mantém a mensagem de erro original
            "status": 500 # Internal Server Error
        }

	

async def main():
    nats = NatsClient()
    await nats.connect()

    if nats.is_connected:
        listened_subject = "tech.team.kickoff"
        logging.info(f"[WORKER - Main] Configurando NATS listener para o subject: {listened_subject}")

        await nats.subscribe(subject=listened_subject, user_request_handler=white_api_kickoff_handler)

        logging.info(f"[WORKER - Main] White API está escutando em '{listened_subject}'.")

        # Mantenha o worker rodando para escutar por mensagens
        try:
            while True:
                await asyncio.sleep(3600)
        except KeyboardInterrupt:
            logging.info("\n[WORKER - Main] Worker encerrado pelo usuário.")
        finally:
            if nats.is_connected:
                logging.info("[WORKER - Main] Encerrando conexão NATS...")
                await nats.nc.drain() # Ou um método nats.close() se você adicionar
            logging.info("[WORKER - Main] Worker finalizado.")
    else:
        logging.info("[WORKER - Main] Não foi possível conectar ao NATS. Worker não iniciado.")

if __name__ == "__main__":
    asyncio.run(main())
