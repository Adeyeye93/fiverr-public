from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from fastapi.middleware.cors import CORSMiddleware
import re
from selenium.webdriver.common.by import By


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"], 
)



class URLRequest(BaseModel):
    url: str

@app.post("/extract-username")
def extract_username(request: URLRequest):
    options = Options()
    options.add_argument("--headless")  # Run in headless mode
    options.add_argument("--disable-gpu")  # Optional for compatibility
    options.add_argument("--no-sandbox")  # Required for some environments

    driver = webdriver.Chrome(options=options)
    print(request)

    try:
        # Open the webpage
        driver.get(request.url)

        # Get the page title
        title = driver.find_element(By.TAG_NAME, 'title')

        print(title)
        return {"title": title}
  
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        driver.quit()
