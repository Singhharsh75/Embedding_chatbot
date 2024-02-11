from langchain.document_loaders import DirectoryLoader,PyPDFDirectoryLoader

file = 'data2'

def load_docs(files):
  loader = PyPDFDirectoryLoader(files)
  documents = loader.load_and_split()
  return documents

documents = load_docs(file)
print(len(documents))

from langchain.text_splitter import RecursiveCharacterTextSplitter

def split_docs(documents,chunk_size=100,chunk_overlap=10):
  text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
  docs = text_splitter.split_documents(documents)
  return docs

docs = split_docs(documents)
print(len(docs))

import os

os.environ["OPENAI_API_KEY"] = "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"

from langchain_openai import OpenAIEmbeddings
embeddings = OpenAIEmbeddings()

from langchain.vectorstores import FAISS
db = FAISS.from_documents(docs, embeddings)

from langchain_openai import OpenAI
from langchain.prompts import PromptTemplate
prompt_template = """Use the following pieces of context to answer the question at the end. Try to use the context to give possible faults diagnosis and the associated solutions.You are forbidden from answering any questions that are outside the scope of the context.Upon asking for customer support proivde the phone numbers listed in the context provided.

{context}

Question: {question}
Answer:"""
PROMPT = PromptTemplate(
    template=prompt_template, input_variables=["context", "question"]
)

chain_type_kwargs={"prompt":PROMPT}

from langchain.chains import RetrievalQA

retrievalQA = RetrievalQA.from_llm(llm=OpenAI(), retriever=db.as_retriever(),chain_type_kwargs=chain_type_kwargs)

query = "What are Faults?"
print(retrievalQA.run(query))

import openai

openai.api_key="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"
   

import gradio as gr

prompt = "Enter Your Query Here"
def api_calling(prompt):
    return retrieval_chain.run(prompt)
def message_and_history(input, history):
    history = history or []
    s = list(sum(history, ()))
    s.append(input)
    inp = ' '.join(s)
    output = api_calling(inp)
    history.append((input, output))
    return history, history


chatbot_block = gr.Blocks()

with chatbot_block:
    gr.Markdown("""<h1><center>Diagnosis and analysis</center></h1>
    """)
    chatbot = gr.Chatbot()
    message = gr.Textbox(placeholder=prompt)
    clear = gr.ClearButton([message, chatbot])
    state = gr.State()
    message.submit(message_and_history,
                 inputs=[message, state],
                 outputs=[chatbot, state])

chatbot_block.launch(debug=True)