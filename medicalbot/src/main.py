from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
import dotenv
dotenv.load_dotenv('../.env')

llm = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
)

prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are a helpful medical assistant. Provide accurate and reliable medical information based on the {input} questions. Always be clear, compassionate, and professional.",
        ),
        ("human", "{input}"),
    ]
)

chain = prompt | llm
response = chain.invoke(
    {
        "input":"I have got too much pimples in my right side of cheeck."
    }
)
print(response.content)