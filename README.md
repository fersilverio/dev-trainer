📄 Documentação do Backend

Esta documentação abrange a arquitetura de microsserviços do projeto, detalhando cada componente e a forma como se comunicam.

1. Visão Geral da Arquitetura

O backend é composto por uma arquitetura de microsserviços orquestrada por uma API principal. A comunicação entre os serviços é realizada de forma assíncrona utilizando o sistema de mensageria NATS.
A estrutura consiste em três aplicações:

 - Blue-API (API Gateway): Uma API RESTful desenvolvida em NestJS. É o ponto de entrada principal para o frontend, responsável por receber as requisições, orquestrar a comunicação com os microsserviços e retornar as respostas.
  
 - Black-API (Serviço de Dados): Um microsserviço em NestJS com Prisma ORM e MySQL. Sua responsabilidade é a persistência e o gerenciamento dos dados da aplicação (usuários, projetos, tarefas, etc.).
  
 - White-API (Serviço de IA): Um microsserviço em Python utilizando CrewAI. Ele gerencia os agentes de IA responsáveis por gerar novas features e tarefas, interagindo com os outros serviços através do NATS.

(Em desenvolvimento | In development )
