from crewai import Crew, Agent, Task, Process
from crewai.project import CrewBase, agent, crew, task
from pydantic import BaseModel
from typing import List

class FeatureTask(BaseModel):
	title: str
	deliverable_explanation: str
	technical_backend_description: str
	technical_frontend_description: str

class Feature(BaseModel):
	title: str
	tasks: List[FeatureTask]

class FeatureSet(BaseModel):
    features: List[Feature]

@CrewBase
class TechTeam():
	agents_config = 'config/agents.yaml'
	tasks_config = 'config/tasks.yaml'

 
	@agent
	def stakeholder(self) -> Agent: 
		return Agent(
            config=self.agents_config['stakeholder'],
            verbose=True
        )
	
	@agent
	def requirement_analyst(self) -> Agent:
		return Agent(
            config=self.agents_config['requirement_analyst'],
            verbose=True
        )

	@agent
	def product_manager(self) -> Agent:
		return Agent(
            config=self.agents_config['product_manager'],
            verbose=True
        )
	
	@agent
	def tech_lead(self) -> Agent:
		return Agent(
            config=self.agents_config['tech_lead'],
            verbose=True
        )
	
	@task
	def stakeholder_project_definition_task(self) -> Task:
		return Task(
            config=self.tasks_config['stakeholder_project_definition_task'],
        )
	

	@task
	def requirement_analysis_task(self) -> Task:
		return Task(
            config=self.tasks_config['requirement_analysis_task'],
        )
	
	@task
	def feature_scoping_task(self) -> Task:
		return Task(
            config=self.tasks_config['feature_scoping_task'],
        )
	
	@task
	def backend_task_creation(self) -> Task:
		return Task(
			config=self.tasks_config['backend_task_creation'],
	)

	@task
	def frontend_task_creation(self) -> Task:
		return Task(
			config=self.tasks_config['frontend_task_creation'],
			output_json=FeatureSet
	)

	@crew
	def crew(self) -> Crew:
		return Crew(
			agents=self.agents,
			tasks=self.tasks,
			process=Process.sequential,
			verbose=True,
		)
