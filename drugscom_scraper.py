"""
drugscom_scraper.py
A conservative scraper to get Drugs.com A-Z index (names + URLs).
Run locally. Respects robots.txt rules. Use responsibly and per site terms.
"""

import time
import csv
import re
import sys
from urllib.parse import urljoin, urlparse
import requests
from bs4 import BeautifulSoup
from time import sleep

BASE = "https://www.drugs.com"
INDEX_PATTERN = BASE + "/alpha/{letter}.html"  # e.g. /alpha/a.html
LETTERS = [chr(c) for c in range(ord('a'), ord('z')+1)] + ['0-9']
HEADERS = {"User-Agent": "YourAppName/1.0 (your-email@example.com)"}  # identify yourself

# Respectful defaults
REQUESTS_PER_MINUTE = 30
SLEEP_BETWEEN = 60.0 / REQUESTS_PER_MINUTE

session = requests.Session()
session.headers.update(HEADERS)

def allowed_by_robots():
    # Very simple check: fetch robots.txt and look for Disallow lines affecting /alpha/
    try:
        r = session.get(urljoin(BASE, "/robots.txt"), timeout=15)
        txt = r.text.lower()
        # If site disallows /alpha/ or 'user-agent: *' has rules that block, return False
        if "/alpha/" in txt and "disallow: /alpha/" in txt:
            return False
    except Exception as e:
        print("Couldn't fetch robots.txt:", e)
    return True

def fetch_index(letter):
    url = INDEX_PATTERN.format(letter=letter)
    print("Fetching index:", url)
    r = session.get(url, timeout=20)
    r.raise_for_status()
    return r.text

def parse_index(html):
    soup = BeautifulSoup(html, "html.parser")
    links = []
    
    # Find all list items within unordered lists (the drug listings are in <ul> elements)
    # The main drug list is in a <ul> with class "ddc-list-column-2" (2-column layout)
    drug_lists = soup.find_all("ul", class_="ddc-list-column-2")
    
    if drug_lists:
        # Extract drugs from the multi-column lists
        for ul in drug_lists:
            for li in ul.find_all("li"):
                a = li.find("a")
                if a:
                    href = a.get("href")
                    text = a.get_text(strip=True)
                    if href and text:
                        full_url = urljoin(BASE, href)
                        links.append((text, full_url))
    
    # Fallback: search for all links that look like drug pages
    if not links:
        for a in soup.select("a"):
            href = a.get("href")
            text = a.get_text(strip=True)
            if not href or not text:
                continue
            # Match drug detail page patterns
            if re.match(r"^/(mtm/|pro/|cons/)?[a-z0-9_-]+\.html$", href):
                full = urljoin(BASE, href)
                links.append((text, full))
    
    # Deduplicate preserving order
    seen = set()
    filtered = []
    for name, url in links:
        key = (name.lower(), url)
        if key in seen: 
            continue
        seen.add(key)
        filtered.append((name, url))
    return filtered

def main():
    if not allowed_by_robots():
        print("robots.txt appears to restrict crawling of this site. Abort or request permission.")
        sys.exit(1)

    out_file = "drugs_index.csv"
    with open(out_file, "w", newline='', encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["name", "url"])
        for letter in LETTERS:
            try:
                html = fetch_index(letter)
                items = parse_index(html)
                print(f"Found {len(items)} entries for {letter}")
                for name, url in items:
                    writer.writerow([name, url])
                sleep(SLEEP_BETWEEN)
            except requests.HTTPError as e:
                print("HTTP error for letter", letter, e)
            except Exception as e:
                print("Error for letter", letter, e)

    print("Done. Saved to", out_file)

if __name__ == "__main__":
    main()
