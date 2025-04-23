from pydantic import BaseModel
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
	

a = run()
