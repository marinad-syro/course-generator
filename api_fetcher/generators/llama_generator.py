import replicate
import json
from main_project import settings

def gen_pathway(area):
    client = replicate.Client(api_token=settings.REPLICATE_API_TOKEN)
    input_data = {
        "prompt":
            f"Create a structured learning pathway for the area '{area}'.\n"
            f"- Include 3–5 modules.\n"
            f"- Each module should have 3–5 lessons.\n"
            f"- Only return JSON, no extra explanation.\n"
            f"- Format example:\n"
            f"{{\n"
            f'  "title": "{area}",\n'
            f'  "modules": [\n'
            f'    {{ "title": "Module 1: Basics", "lessons": [\n'
            f'        {{"title": "Lesson 1"}}, {{"title": "Lesson 2"}}\n'
            f"      ]\n    }}\n"
            f"  ]\n"
            f"}}"
        ,
        "max_new_tokens": 512,
        "prompt_template": (
            "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n"
            "You are an expert curriculum architect. Generate clear, structured pathways "
            "for learners that are well-organized and concise.\n<|eot_id|>"
            "<|start_header_id|>user<|end_header_id|>\n\n"
            "{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n"
        ),
    }

    output = client.run(
        "meta/meta-llama-3-8b-instruct",
        input=input_data
    )

    if isinstance(output, list):
        output = "".join(output)
   
    try:
        data = json.loads(output)
    except json.JSONDecodeError:
        data = {
            "title": area,
            "modules": []
        }

    return data

def gen_lesson_content(topic: str) -> str:
    
    input_data = {
        "prompt": f"Create a structured lesson on the topic '{topic}'. "
                  f"Include: (1) an introduction, (2) step-by-step explanation, "
                  f"(3) examples (and code if relevant), and (4) a concise summary. "
                  f"Keep the style beginner-friendly but informative.",
        "max_new_tokens": 800,
        "prompt_template": "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n{system_prompt}<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n"
    }

    output = replicate.run(
        "meta/meta-llama-3-8b-instruct",
        input=input_data,
        api_token=settings.REPLICATE_API_TOKEN
    )

    try:
        data = json.loads(output)
    except:
        data = "".join(output)
    
    return data
