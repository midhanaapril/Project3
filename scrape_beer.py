from splinter import Browser
from bs4 import BeautifulSoup as soup
import pandas as pd
from webdriver_manager.chrome import ChromeDriverManager


def scrape(): 
    # Set up Splinter
    executable_path = {'executable_path': ChromeDriverManager().install()}
    browser = Browser('chrome', **executable_path, headless=False)  

    ################################### NASA MARS news site #####################################
    # Visit the Mars news site
    url = 'https://www.brewersassociation.org/directories/breweries/?location=GA'
    browser.visit(url)